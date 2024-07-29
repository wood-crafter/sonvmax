import { Checkbox, InputNumber, notification } from "antd";
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
import { CheckboxChangeEvent } from "antd/es/checkbox";

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
  const [cartsChecked, setCartsChecked] = useState<string[]>([]);

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
      refreshCart();
    } else {
      addFailNotification(orderRes.status, orderRes.statusText);
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

  return (
    <div className="Cart">
      {contextHolder}
      {currentCart &&
        currentCart.map((item: Cart) => {
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
      {currentCart ? (
        <button
          style={{
            marginLeft: "1rem",
            marginRight: "1rem",
            color: "white",
            backgroundColor: "black",
          }}
          onClick={handleOrder}
          disabled={cartsChecked.length < 1}
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
