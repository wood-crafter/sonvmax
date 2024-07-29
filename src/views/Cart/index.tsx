import { InputNumber, notification } from "antd";
import { useCart } from "../../hooks/useCart";
import { Cart, PagedResponse } from "../../type";
import "./index.css";
import _ from "lodash";
import { useCallback, useEffect, useState } from "react";
import { API_ROOT } from "../../constant";
import { requestOptions } from "../../hooks/useProduct";
import { useUserStore } from "../../store/user";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { NumberToVND } from "../../helper";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { KeyedMutator } from "swr";

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

  const debouncedFetchData = useCallback(_.debounce(fetchData, 500), []);

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
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const [api, contextHolder] = notification.useNotification();

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
  const handleOrder = async () => {
    const orderBody = {
      orderProductIds: currentCart?.map((it) => it.id),
      voucherIds: [],
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
    } else {
      addFailNotification(orderRes.status, orderRes.statusText);
    }
  };

  return (
    <div className="Cart">
      {contextHolder}
      {currentCart &&
        currentCart.map((item: Cart) => {
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
                <div style={{ color: "red" }}>{item.product.price}</div>
                <div>x{item.quantity}</div>
              </div>
              <DebouncedInputNumber
                refreshCart={refreshCart}
                className="cart-item-num-of-product"
                id={item.id}
                min={1}
                max={100000}
                defaultValue={item.quantity}
              />
              <div className="cart-item-total">
                Tổng: {NumberToVND.format(item.product.price * item.quantity)}
              </div>
              <div className="cart-item-delete">Xoá</div>
            </div>
          );
        })}
      {currentCart ? (
        <button
          style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            color: "white",
            backgroundColor: "black",
          }}
          onClick={handleOrder}
        >
          Mua ngay
        </button>
      ) : (
        <div>Chưa có sản phẩm nào</div>
      )}
    </div>
  );
}

export default UserCart;
