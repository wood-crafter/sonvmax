import {
  Checkbox,
  InputNumber,
  notification,
  Select,
  Popconfirm,
  Button,
  Modal,
  Input,
  Spin,
} from "antd";
import { useCart } from "../../hooks/useCart";
import { AgentInfo, Cart, PagedResponse, RGB, StaffInfo } from "../../type";
import "./index.css";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useState } from "react";
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
import { useMeMutation } from "../../hooks/useMe";

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
  currentColorId: string | null;
  setColorId: React.Dispatch<React.SetStateAction<string | null>>;
  productId: string;
};

type CartUpdateBody = {
  id: string;
  colorId?: string;
  rgb?: RGB | null;
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
    currentColorId,
    productId,
    setColorId,
  } = props;
  const authFetch = useAuthenticatedFetch();

  const onPicked = async (currentColorId: string, rgb: RGB) => {
    const body: CartUpdateBody = {
      id: orderProductId,
    };
    if (currentColorId) {
      body.colorId = currentColorId;
      body.rgb = null;
    } else {
      body.colorId = "";
      body.rgb = {
        r: rgb.r,
        b: rgb.b,
        g: rgb.g,
      };
    }
    await authFetch(`${API_ROOT}/order/create-order-product/${productId}`, {
      ...requestOptions,
      body: JSON.stringify(body),
      method: "POST",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    refreshCart();
  };

  return (
    <ColorTable
      currentColor={currentColor}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onPicked={onPicked}
      currentColorId={currentColorId}
      setColorId={setColorId}
    />
  );
};

// Type guard to check if the user is an agent
function isAgentInfo(me: AgentInfo | StaffInfo | null): me is AgentInfo {
  return me?.type === "agent";
}

function UserCart() {
  const me = useUserStore((state) => state.userInformation);
  const { data: currentCart, mutate: refreshCart } = useCart();
  const { data: voucherResponse } = useVouchers(1);
  const voucher = voucherResponse?.data;
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const { trigger: triggerMe } = useMeMutation();
  const setUserInformation = useUserStore((state) => state.setUserInformation);
  const [api, contextHolder] = notification.useNotification();
  const [cartsChecked, setCartsChecked] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedVoucher, setSelectedVoucher] = useState<string | undefined>(
    undefined
  );
  const [colorPrice, setColorPrice] = useState(0);
  const [isOpenColorPick, setIsOpenColorPick] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState("");
  const [currentEditingProductId, setCurrentEditingProductId] = useState("");
  const [currentColor, setCurrrentColor] = useState({
    r: 255,
    g: 255,
    b: 255,
  });
  const level = useUserStore((state) => state.level);
  const [colorId, setColorId] = useState<string | null>("");
  const [isOpenOrderDetail, setIsOpenOrderDetail] = useState(false);
  const [isApiCalling, setIsApiCalling] = useState(false);
  const [orderAddress, setOrderAddress] = useState(
    isAgentInfo(me) ? me?.address : ""
  );
  const [phoneNumber, setPhoneNumber] = useState(me?.phoneNumber ?? "");
  const isPickAll = useMemo(() => {
    let isNoAll = false;
    currentCart?.forEach((item) => {
      if (!cartsChecked?.includes(item.id)) {
        isNoAll = true;
        return;
      }
    });

    return !isNoAll;
  }, [cartsChecked, currentCart]);

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
    const orderBody = {
      orderProductIds: currentCart
        ?.filter((it) => cartsChecked.includes(it.id))
        ?.map((it) => it.id),
      voucherIds: selectedVoucher ? [selectedVoucher][0] : "",
      address: orderAddress,
      phoneNumber: phoneNumber,
    };

    setIsApiCalling(true);
    const orderRes = await authFetch(`${API_ROOT}/order/create-order`, {
      ...requestOptions,
      method: "POST",
      body: JSON.stringify(orderBody),
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    setIsApiCalling(false);
    if (orderRes.ok) {
      const me = await triggerMe();
      setUserInformation(me);
      addSuccessNotification();
      refreshCart();
      setTotal(0);
      setTotalPrice(0);
    } else {
      const orderJson = await orderRes.json();
      addFailNotification(orderRes.status, orderJson.message);
    }
  };

  const handleDeleteCart = async (id: string) => {
    setIsApiCalling(true);
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

    setIsApiCalling(false);
    if (deleteRes.ok) {
      deleteSuccessNotification();
      refreshCart();
    } else {
      const orderJson = await deleteRes.json();
      deleteFailNotification(deleteRes.status, orderJson?.message);
    }
  };

  const updateOrderProduct = async (
    productId: string,
    volumeId: string,
    id: string
  ) => {
    setIsApiCalling(true);
    await authFetch(`${API_ROOT}/order/create-order-product/${productId}`, {
      ...requestOptions,
      body: JSON.stringify({ volumeId: volumeId, id }),
      method: "POST",
      headers: {
        ...requestOptions.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });
    setIsApiCalling(false);
    refreshCart();
  };

  const handlePickAll = () => {
    if (!isPickAll) {
      setCartsChecked(currentCart ? currentCart.map((it) => it.id) : []);
      return;
    }
    setCartsChecked([]);
  };

  useEffect(() => {
    const triggerPersonalInfo = async () => {
      const me = await triggerMe();
      setUserInformation(me);
    };
    triggerPersonalInfo();
  }, []);

  useEffect(() => {
    const currentTotal = currentCart
      ?.filter((item) => cartsChecked.includes(item.id))
      ?.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const currentTotalPrice = currentCart
      ?.filter((item) => cartsChecked.includes(item.id))
      ?.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);

    const colorPrice = currentCart
      ?.filter((item) => cartsChecked.includes(item.id))
      ?.reduce(
        (sum, item) =>
          sum +
          item.originalPrice *
            item.quantity *
            (item.colorClassification === 1
              ? 0.05
              : item.colorClassification === 2
              ? 0.1
              : item.colorClassification === 3
              ? 0.2
              : 0),
        0
      );

    const discountAmount = selectedVoucher
      ? voucher?.find((v) => v.id === selectedVoucher)?.discountAmount || 0
      : 0;

    const discountedTotal = currentTotal
      ? currentTotal - (currentTotal * discountAmount) / 100
      : 0;

    setTotal(discountedTotal);
    setTotalPrice(currentTotalPrice ?? 0);
    setColorPrice(colorPrice ?? 0);
  }, [
    cartsChecked.length,
    selectedVoucher,
    currentCart,
    voucher,
    cartsChecked,
  ]);

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
        productId={currentEditingProductId}
        isOpen={isOpenColorPick}
        setIsOpen={setIsOpenColorPick}
        accessToken={accessToken}
        refreshCart={refreshCart}
        orderProductId={currentEditingId}
        currentColor={currentColor}
        currentColorId={colorId}
        setColorId={setColorId}
      />
      <Modal
        title="Thông tin giao hàng"
        open={isOpenOrderDetail}
        onOk={handleOrderInforOk}
        okText="Đặt hàng"
        onCancel={() => setIsOpenOrderDetail(false)}
        cancelText="Hủy"
      >
        <div style={{ color: "red" }}>
          *Đơn hàng sẽ được giao trong 1-3 ngày
        </div>
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
      <Spin spinning={isApiCalling}>
        {currentCart && (
          <div className="cart-container">
            {currentCart.map((item: Cart) => {
              return (
                <div key={item.id} className="cart-item">
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
                    <div className="cart-voumes">
                      <Select
                        defaultValue={item.volumeId}
                        onChange={(value: string) => {
                          updateOrderProduct(item.productId, value, item.id);
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
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Button
                      className="rePick-color"
                      style={{
                        border: "1px solid black",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                        backgroundColor: `rgb(${
                          item?.color?.r
                            ? item?.color?.r
                            : item.colorPick?.r ?? 255
                        }, ${
                          item?.color?.g
                            ? item?.color?.g
                            : item.colorPick?.g ?? 255
                        }, ${
                          item?.color?.b
                            ? item?.color?.b
                            : item.colorPick?.b ?? 255
                        })`,
                      }}
                      onClick={() => {
                        if (!item.product.canColorPick) {
                          api.open({
                            message: "Sản phẩm này không cho phép chọn màu",
                            icon: <FrownOutlined style={{ color: "red" }} />,
                          });
                        }
                        setCurrentEditingId(item.id);
                        setCurrentEditingProductId(item.productId);
                        setColorId((item.colorId ?? "") + "");
                        setCurrrentColor(
                          item.colorId ? item.color : item.colorPick
                        );
                        setIsOpenColorPick(true);
                      }}
                    ></Button>
                    <div>
                      {item?.color
                        ? item.color.code
                        : `rgb(${item.colorPick?.r ?? 255}, ${
                            item.colorPick?.g ?? 255
                          }, ${item.colorPick?.b ?? 255})`}
                    </div>
                  </div>
                  <DebouncedInputNumber
                    refreshCart={refreshCart}
                    className="cart-item-num-of-product"
                    id={item.id}
                    min={1}
                    max={100000}
                    defaultValue={item.quantity}
                  />
                  <Checkbox
                    checked={!!cartsChecked.find((it) => it === item.id)}
                    onChange={(e) => {
                      handleChangeCheckedProduct(e, item.id);
                    }}
                    style={{ marginRight: "2rem" }}
                  />
                  <div className="cart-item-total">
                    Tổng: {NumberToVND.format(item.price * item.quantity)}
                  </div>
                  <Button
                    className="cart-item-delete"
                    onClick={() => {
                      handleDeleteCart(item.id);
                    }}
                  >
                    Xoá
                  </Button>
                </div>
              );
            })}
          </div>
        )}
        {!!currentCart?.length && (
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              style={{ marginRight: "2rem", marginTop: "0.5rem" }}
              onClick={handlePickAll}
            >
              {isPickAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
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
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex" }}>
              <strong>Tổng giá niêm yết:</strong>
              <div style={{ color: "black", marginLeft: "0.5rem" }}>
                {NumberToVND.format(totalPrice)}
              </div>
            </div>
            {colorPrice !== 0 && (
              <div style={{ display: "flex" }}>
                <strong>Tổng giá pha màu:</strong>
                <div style={{ color: "black", marginLeft: "0.5rem" }}>
                  + {NumberToVND.format(colorPrice)}
                </div>
              </div>
            )}
            {selectedVoucher &&
              voucher?.find((it) => it.id === selectedVoucher) && (
                <div style={{ display: "flex" }}>
                  <strong>Giá giảm voucher:</strong>
                  <div style={{ color: "black", marginLeft: "0.5rem" }}>
                    -{" "}
                    {NumberToVND.format(
                      (totalPrice + colorPrice) *
                        (level
                          ? level === "1"
                            ? 0.6
                            : level === "2"
                            ? 0.7
                            : 0.8
                          : 1) *
                        ((voucher?.find((it) => it.id === selectedVoucher)
                          ?.discountAmount ?? 0) /
                          100)
                    )}
                  </div>
                </div>
              )}
            {level && totalPrice > 0 && (
              <div style={{ display: "flex" }}>
                <strong>Giá giảm cấp đại lý:</strong>
                <div style={{ color: "black", marginLeft: "0.5rem" }}>
                  -{" "}
                  {NumberToVND.format(
                    (totalPrice + colorPrice) *
                      (level === "1" ? 0.4 : level === "2" ? 0.3 : 0.2)
                  )}
                </div>
              </div>
            )}
            <div style={{ display: "flex" }}>
              <strong>Tổng thanh toán:</strong>
              <div style={{ color: "red", marginLeft: "0.5rem" }}>
                {NumberToVND.format(total)}
              </div>
            </div>
          </div>
        )}
        {!!currentCart?.length && voucher && voucher.length > 0 && (
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
              <Select.Option key={"noVoucher"} value={""}>
                Bỏ chọn
              </Select.Option>
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
            onConfirm={() => {
              if (cartsChecked.length < 1) {
                noProductInOrder();
                return;
              }
              setIsOpenOrderDetail(true);
            }}
            okText="Có"
            cancelText="Hủy"
            disabled={!needsVouchersNotAppliedWarning}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <button
              onClick={
                needsVouchersNotAppliedWarning
                  ? undefined
                  : () => {
                      if (cartsChecked.length < 1) {
                        noProductInOrder();
                        return;
                      }
                      setIsOpenOrderDetail(true);
                    }
              }
              style={{
                marginLeft: "1rem",
                marginRight: "1rem",
                color: "white",
                backgroundColor: "black",
                width: "calc(100% - 2rem)",
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
      </Spin>
    </div>
  );
}

export default UserCart;
