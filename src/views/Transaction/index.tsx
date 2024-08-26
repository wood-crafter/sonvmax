import React, { useState } from "react";
import { Modal, Button, Input, notification } from "antd";
import { NumberToVND } from "../../helper";
import "./index.css";
import { API_ROOT } from "../../constant";
import { requestOptions } from "../../hooks/utils";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { FrownOutlined, SmileOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";
import { useNavigate } from "react-router-dom";

function convertNumberToText(number: number) {
  const units = [
    "",
    "một",
    "hai",
    "ba",
    "bốn",
    "năm",
    "sáu",
    "bảy",
    "tám",
    "chín",
  ];
  const tens = [
    "",
    "mười",
    "hai mươi",
    "ba mươi",
    "bốn mươi",
    "năm mươi",
    "sáu mươi",
    "bảy mươi",
    "tám mươi",
    "chín mươi",
  ];
  const scales = ["", "nghìn", "triệu", "tỷ"];

  function readThreeDigits(number: number) {
    let result = "";
    const hundreds = Math.floor(number / 100);
    const remainder = number % 100;
    const tensValue = Math.floor(remainder / 10);
    const unitsValue = remainder % 10;

    if (hundreds > 0) {
      result += `${units[hundreds]} trăm`;
    }

    if (remainder > 0) {
      if (tensValue > 1) {
        result += `${tens[tensValue]}`;
        if (unitsValue > 0) {
          result += `${units[unitsValue]}`;
        }
      } else if (tensValue === 1) {
        result += "mười ";
        if (unitsValue > 0) {
          if (unitsValue === 5) {
            result += "lăm ";
          } else {
            result += `${units[unitsValue]}`;
          }
        }
      } else if (unitsValue > 0) {
        if (hundreds > 0) {
          result += "lẻ ";
        }
        result += `${units[unitsValue]}`;
      }
    }

    return result.trim();
  }

  function readWholeNumber(number: number) {
    if (number === 0) return "không đồng";

    let result = "";
    let scaleIndex = 0;

    while (number > 0) {
      const threeDigits = number % 1000;
      if (threeDigits > 0) {
        const threeDigitsText = readThreeDigits(threeDigits);
        result = `${threeDigitsText} ${scales[scaleIndex]} ${result}`;
      }
      number = Math.floor(number / 1000);
      scaleIndex++;
    }

    return result.trim() + " đồng";
  }

  return readWholeNumber(number);
}

function capitalizeFirstLetter(string: string) {
  if (!string) return string;
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function Transaction() {
  const accessToken = useUserStore((state) => state.accessToken);
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const navigate = useNavigate();

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const maxAmount = 100000000000;

    if (value > maxAmount) {
      setAmount(maxAmount);
    } else {
      setAmount(value);
    }
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setDescription(e.target.value);
  };

  const showConfirm = () => {
    if (amount < 1000) {
      api.open({
        message: "Số tiền nạp không hợp lệ",
        description: "Số tiền nạp ít nhất là 1 nghìn đồng",
        icon: <FrownOutlined style={{ color: "#108ee9" }} />,
      });
      return;
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    makeTransaction();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const makeTransaction = async () => {
    if (amount < 1000) {
      api.open({
        message: "Số tiền nạp không hợp lệ",
        description: "Số tiền nạp ít nhất là 1 nghìn đồng",
        icon: <FrownOutlined style={{ color: "#108ee9" }} />,
      });
      return;
    }

    const transactionBody = {
      totalAmount: amount,
      description: description,
    };
    const createTransactionResponse = await authFetch(
      `${API_ROOT}/transaction/create-transaction`,
      {
        ...requestOptions,
        body: JSON.stringify(transactionBody),
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (createTransactionResponse.ok) {
      api.open({
        message: "Tạo phiếu nạp tiền thành công",
        icon: <SmileOutlined style={{ color: "#108ee9" }} />,
      });

      navigate("/transaction_history");
    } else {
      const resJson = await createTransactionResponse.json();
      api.open({
        message: "Tạo phiếu nạp tiền thất bại",
        description: resJson?.message,
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
    }
  };

  return (
    <div className="Transaction">
      {contextHolder}
      <div
        style={{
          width: "50%",
          backgroundColor: "white",
          padding: "2rem",
          borderRadius: "1rem",
        }}
      >
        <div className="description-zone">
          <p>Ngân hàng: Techcombank</p>
          <p>Số tài khoản: 2010666161</p>
          <p>Chủ tài khoản: Nguyễn Kim Hưng</p>
        </div>
        <div className="transaction-form">
          <Input
            type="number"
            placeholder="Nhập số tiền"
            value={amount}
            onChange={handleAmountChange}
            style={{}}
          />
          <p
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
              color: "red",
            }}
          >
            {capitalizeFirstLetter(convertNumberToText(amount))}
          </p>
          <TextArea
            placeholder="Ghi chú"
            value={description}
            onChange={handleDescriptionChange}
            style={{ marginBottom: "10px" }}
            rows={3}
          />
          <Button type="primary" onClick={showConfirm}>
            Nạp tiền
          </Button>
        </div>
        <Modal
          title="Xác nhận giao dịch"
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>Ngân hàng: Techcombank</p>
          <p>STK: 2010666161</p>
          <p>Chủ tài khoản: Nguyễn Kim Hưng</p>
          <p>Số tiền: {NumberToVND.format(amount)}</p>
          <p>Bằng chữ: {capitalizeFirstLetter(convertNumberToText(amount))}</p>
          <p>Ghi chú: {description}</p>
        </Modal>
      </div>
    </div>
  );
}

export default Transaction;
