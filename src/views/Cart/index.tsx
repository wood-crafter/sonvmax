import { Checkbox, InputNumber, notification, Select, Popconfirm } from "antd";
import { useCart } from "../../hooks/useCart";
import { Cart, PagedResponse } from "../../type";
import "./index.css";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useState } from "react";
import { API_ROOT } from "../../constant";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { NumberToVND } from "../../helper";
import {
  SmileOutlined,
  FrownOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import { KeyedMutator } from "swr";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { useVouchers } from "../../hooks/useVoucher";
import { requestOptions } from "../../hooks/utils";

type DebouncedInputNumberProps = {
  defaultValue: number;
  id: string;
  min: number;
  max: number;
  className: string;
  refreshCart: KeyedMutator<PagedResponse<Cart>>;
};

const DebouncedInputNumber = (props: DebouncedInputNumberProps) => {
  const accessToken = useUserStore((state) => state.accessToken);
  const { defaultValue, id, min, max, className, refreshCart } = props;
  const [value, setValue] = useState(defaultValue);
  const authFetch = useAuthenticatedFetch();

  const fetchData = async (val: number) => {
    await authFetch(`${API_ROOT}/order/update-order-product/${id}`, {
      ...requestOptions,
      body: JSON.stringify({ quantity: val }),
      method: "PUT",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshCart();
  };

  const debouncedFetchData = useCallback(debounce(fetchData, 500), []);

  useEffect(() => {
    if (value !== null) {
      debouncedFetchData(value);
    }
    return () => {
      debouncedFetchData.cancel();
    };
  }, [value, debouncedFetchData]);

  const handleChange = (val: number | null) => {
    if (val) setValue(val);
  };

  return (
    <div>
      <InputNumber
        className={className}
        value={value}
        onChange={handleChange}
        defaultValue={defaultValue}
        min={min}
        max={max}
        changeOnWheel
      />
    </div>
  );
};

function UserCart() {
  const { data: currentCart, mutate: refreshCart } = useCart();
  const { data: voucherResponse } = useVouchers(1);
  const voucher = voucherResponse?.data;
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();
  const [cartsChecked, setCartsChecked] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<string | undefined>(
    undefined
  );

  const addSuccessNotification = () => {
    api.open({
      message: "Mua thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const addFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Mua thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const deleteSuccessNotification = () => {
    api.open({
      message: "Xoá thành công",
      description: "",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const deleteFailNotification = (status: number, statusText: string) => {
    api.open({
      message: "Xoá thất bại",
      description: `Mã lỗi: ${status} ${statusText}`,
      icon: <FrownOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const noProductInOrder = () => {
    api.open({
      message: "Không thể mua",
      description: `Vui lòng thêm sản phẩm vào đơn`,
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const handleChangeCheckedProduct = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      setCartsChecked((prev) => {
        const next = [...prev, id];
        return next;
      });
    } else {
      setCartsChecked((prev) => {
        const next = prev.filter((item) => item !== id);
        return next;
      });
    }
  };

  const handleOrder = async () => {
    if (cartsChecked.length < 1) {
      noProductInOrder();
      return;
    }

    const orderBody = {
      orderProductIds: currentCart
        ?.filter((it) => cartsChecked.includes(it.id))
        ?.map((it) => it.id),
      voucherIds: selectedVoucher ? [selectedVoucher] : [],
    };

    const orderRes = await authFetch(`${API_ROOT}/order/create-order`, {
      ...requestOptions,
      method: "POST",
      body: JSON.stringify(orderBody),
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (orderRes.ok) {
      addSuccessNotification();
      refreshCart();
      setTotal(0);
    } else {
      const orderJson = await orderRes.json();
      addFailNotification(orderRes.status, orderJson.message);
    }
  };

  const handleDeleteCart = async (id: string) => {
    const deleteRes = await authFetch(
      `${API_ROOT}/order/remove-order-product/${id}`,
      {
        ...requestOptions,
        method: "DELETE",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (deleteRes.ok) {
      deleteSuccessNotification();
      refreshCart();
    } else {
      deleteFailNotification(deleteRes.status, deleteRes.statusText);
    }
  };

  useEffect(() => {
    const currentTotal = currentCart
      ?.filter((item) => cartsChecked.includes(item.id))
      ?.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const discountAmount = selectedVoucher
      ? voucher?.find((v) => v.id === selectedVoucher)?.discountAmount || 0
      : 0;

    const discountedTotal = currentTotal
      ? currentTotal - (currentTotal * discountAmount) / 100
      : 0;

    setTotal(discountedTotal);
  }, [cartsChecked.length, selectedVoucher, currentCart, voucher]);

  const needsVouchersNotAppliedWarning =
    selectedVoucher === undefined && (voucher ?? []).length > 0;

  return (
    <div className="Cart">
      {contextHolder}
      {currentCart && (
        <div className="cart-container">
          {currentCart.map((item: Cart) => {
            return (
              <div key={item.id} className="cart-item">
                <Checkbox
                  onChange={(e) => {
                    handleChangeCheckedProduct(e, item.id);
                  }}
                />
                <div className="cart-item-image-container">
                  <img
                    src={item.product.image}
                    style={{ width: "100%", height: "100%" }}
                  />
                </div>
                <div className="cart-item-product-info">
                  <div>{item.product.nameProduct}</div>
                  <div style={{ color: "red" }}>
                    {NumberToVND.format(item.price)}
                  </div>
                  <div>x{item.quantity}</div>
                </div>
                <div className="">{item.colors}</div>
                <DebouncedInputNumber
                  refreshCart={refreshCart}
                  className="cart-item-num-of-product"
                  id={item.id}
                  min={1}
                  max={100000}
                  defaultValue={item.quantity}
                />
                <div className="cart-item-total">
                  Tổng: {NumberToVND.format(item.price * item.quantity)}
                </div>
                <div
                  className="cart-item-delete"
                  onClick={() => {
                    handleDeleteCart(item.id);
                  }}
                >
                  Xoá
                </div>
              </div>
            );
          })}
        </div>
      )}
      {!!currentCart?.length && (
        <div
          style={{
            width: "calc(100% - 2rem)",
            marginRight: "2rem",
            marginTop: "2rem",
            marginBottom: "2rem",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          Tổng đơn hàng:
          <div style={{ color: "red", marginLeft: "0.5rem" }}>
            {NumberToVND.format(total)}
          </div>
        </div>
      )}
      {voucher && voucher.length > 0 && (
        <div
          style={{
            marginBottom: "1rem",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "1rem",
          }}
        >
          <Select
            onChange={(value) => setSelectedVoucher(value)}
            placeholder="Chọn voucher"
            style={{ width: "20%" }}
          >
            {voucher.map((v) => (
              <Select.Option key={v.id} value={v.id}>
                {v.code} - {v.discountAmount}%
              </Select.Option>
            ))}
          </Select>
        </div>
      )}
      {currentCart?.length !== 0 ? (
        <Popconfirm
          title="Bạn chưa chọn voucher, bạn có muốn tiếp tục không?"
          onConfirm={handleOrder}
          okText="Có"
          cancelText="Hủy"
          disabled={!needsVouchersNotAppliedWarning}
          icon={<QuestionCircleOutlined style={{ color: "red" }} />}
        >
          <button
            onClick={needsVouchersNotAppliedWarning ? undefined : handleOrder}
            style={{
              marginLeft: "1rem",
              marginRight: "1rem",
              color: "white",
              backgroundColor: "black",
            }}
          >
            Mua ngay
          </button>
        </Popconfirm>
      ) : (
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Chưa có sản phẩm nào
        </div>
      )}
    </div>
  );
}

export default UserCart;
