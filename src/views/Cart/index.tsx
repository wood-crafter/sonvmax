import {
  Checkbox,
  InputNumber,
  notification,
  Select,
  Popconfirm,
  Button,
  Modal,
  Input,
} from "antd";
import { useCart } from "../../hooks/useCart";
import { Cart, PagedResponse, RGB } from "../../type";
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
import ColorTable from "../../components/ColorTable";

type DebouncedInputNumberProps = {
  defaultValue: number;
  id: string;
  min: number;
  max: number;
  className: string;
  refreshCart: KeyedMutator<PagedResponse<Cart>>;
};

type OrderProductColorPickerProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  orderProductId: string;
  accessToken: string;
  refreshCart: KeyedMutator<PagedResponse<Cart>>;
  currentColor: RGB;
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

const OrderProductColorPicker = (props: OrderProductColorPickerProps) => {
  const {
    isOpen,
    setIsOpen,
    orderProductId,
    accessToken,
    refreshCart,
    currentColor,
  } = props;
  const authFetch = useAuthenticatedFetch();

  const onPicked = async (rgb: RGB) => {
    await authFetch(
      `${API_ROOT}/order/update-order-product/${orderProductId}`,
      {
        ...requestOptions,
        body: JSON.stringify({ colorPick: rgb }),
        method: "PUT",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    refreshCart();
  };

  return (
    <ColorTable
      currentColor={currentColor}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onPicked={onPicked}
    />
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
  const [isOpenColorPick, setIsOpenColorPick] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState("");
  const [currentColor, setCurrrentColor] = useState({
    r: 255,
    g: 255,
    b: 255,
  });
  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const [orderAddress, setOrderAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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
      voucherIds: selectedVoucher ? [selectedVoucher][0] : "",
      address: orderAddress,
      phoneNumber: phoneNumber,
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

  const updateOrderProduct = async (id: string, volumeId: string) => {
    await authFetch(`${API_ROOT}/order/update-order-product/${id}`, {
      ...requestOptions,
      body: JSON.stringify({ volumeId: volumeId }),
      method: "PUT",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshCart();
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

  const handleOrderInforOk = () => {
    if (!orderAddress || !phoneNumber) {
      api.open({
        message: "Vui lòng điền đủ thông tin",
        icon: <FrownOutlined style={{ color: "red" }} />,
      });
      return;
    }

    handleOrder();
    setIsOpenOrderDetail(false);
  };

  const needsVouchersNotAppliedWarning =
    selectedVoucher === undefined && (voucher ?? []).length > 0;

  return (
    <div className="Cart">
      {contextHolder}
      <OrderProductColorPicker
        isOpen={isOpenColorPick}
        setIsOpen={setIsOpenColorPick}
        accessToken={accessToken}
        refreshCart={refreshCart}
        orderProductId={currentEditingId}
        currentColor={currentColor}
      />
      <Modal
        title="Thông tin giao hàng"
        open={isOpenOrderDetail}
        onOk={handleOrderInforOk}
        okText="Đặt hàng"
        onCancel={() => setIsOpenOrderDetail(false)}
        cancelText="Hủy"
      >
        <Input
          value={orderAddress}
          placeholder="Điền địa chỉ nhận hàng"
          onChange={(e) => setOrderAddress(e.target.value)}
          style={{ marginBottom: "1rem" }}
        ></Input>
        <Input
          value={phoneNumber}
          placeholder="Điền số điện thoại"
          onChange={(e) => setPhoneNumber(e.target.value)}
        ></Input>
      </Modal>
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
                {item?.product?.volumes && (
                  <Select
                    defaultValue={item.volumeId}
                    onChange={(value: string) => {
                      updateOrderProduct(item.id, value);
                    }}
                  >
                    {item?.product?.volumes?.map((volume) => {
                      return (
                        <Select.Option key={volume.id} value={volume.id}>
                          {volume.volume}
                        </Select.Option>
                      );
                    })}
                  </Select>
                )}
                <Button
                  className="rePick-color"
                  style={{
                    border: "1px solid black",
                    marginLeft: "1rem",
                    marginRight: "1rem",
                    backgroundColor: `rgb(${item.colorPick?.r ?? 255}, ${
                      item.colorPick?.g ?? 255
                    }, ${item.colorPick?.b ?? 255})`,
                  }}
                  onClick={() => {
                    setCurrentEditingId(item.id);
                    setCurrrentColor(item.colorPick);
                    setIsOpenColorPick(true);
                  }}
                ></Button>
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
            onClick={
              needsVouchersNotAppliedWarning
                ? undefined
                : () => setIsOpenOrderDetail(true)
            }
            style={{
              marginLeft: "1rem",
              marginRight: "1rem",
              color: "white",
              backgroundColor: "black",
            }}
          >
            Đặt hàng
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
