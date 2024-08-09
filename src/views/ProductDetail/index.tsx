/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import { API_ROOT, DISCOUNT_AMOUNT } from "../../constant";
import { requestOptions, useProductsById } from "../../hooks/useProduct";
import { Button, InputNumber, notification } from "antd";
import "./index.css";
import { classifyColor, NumberToVND } from "../../helper";
import { useLocation } from "react-router-dom";
import { SmileOutlined, FrownOutlined } from "@ant-design/icons";
import { Color } from "../../type";
import { useAuthenticatedFetch } from "../../hooks/useAuthenticatedFetch";
import { useUserStore } from "../../store/user";
import { ColorResult, SketchPicker } from "react-color";
import ColorTable from "../../components/ColorTable";

const noColorId = "clzdwqi900009skr5yrl5yvcq";

function ProductDetail() {
  const level = useUserStore((state) => state.level);
  const discount = DISCOUNT_AMOUNT[+level - 1] ?? 0;
  const accessToken = useUserStore((state) => state.accessToken);
  const authFetch = useAuthenticatedFetch();
  const currentProductId = useLocation().pathname.split("/")[2];
  const { data: product } = useProductsById(currentProductId);
  const [currentColor, setCurrentColor] = useState<Color | null>({
    r: 255,
    g: 255,
    b: 255,
  });
  const [numOfProduct, setNumOfProduct] = useState(1);
  const [api, contextHolder] = notification.useNotification();
  const [isColorModalOpen, setIsColorModalOpen] = useState(false);
  const ratioPriceColor = useMemo(() => {
    return classifyColor(currentColor);
  }, [currentColor]);

  const RequestLoginNotification = () => {
    api.open({
      message: "Tạo đơn hàng thất bại",
      description: "Vui lòng đăng nhập trước",
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const createCartSuccess = () => {
    api.open({
      message: "Tạo đơn hàng thành công",
      description: "Đơn hàng đã tạo",
      icon: <SmileOutlined style={{ color: "#108ee9" }} />,
    });
  };

  const createCartFail = (description: string) => {
    api.open({
      message: "Tạo đơn hàng thất bại",
      description: description,
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const openNotification = (description: string) => {
    api.open({
      message: "Thêm vào giỏ thất bại",
      description: description,
      icon: <FrownOutlined style={{ color: "red" }} />,
    });
  };

  const handleAddToCart = async () => {
    if (!accessToken) {
      RequestLoginNotification();
    }

    if (!currentColor) {
      openNotification("Vui lòng chọn màu");
    } else if (numOfProduct < 1) {
      openNotification("Số lượng không hợp lệ");
    }

    const cartBody: any = {
      quantity: numOfProduct,
    };

    if (product?.categoryId !== noColorId) {
      cartBody.rgb = {
        r: currentColor.r,
        g: currentColor.g,
        b: currentColor.b,
      };
    }

    const createResponse = await authFetch(
      `${API_ROOT}/order/create-order-product/${currentProductId}`,
      {
        ...requestOptions,
        body: JSON.stringify(cartBody),
        method: "POST",
        headers: {
          ...requestOptions.headers,
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (createResponse.status === 201) {
      createCartSuccess();
      resetOrderInfo();
    } else {
      createCartFail(createResponse.statusText);
    }
  };

  const resetOrderInfo = () => {
    setCurrentColor({
      r: 255,
      g: 255,
      b: 255,
    });
    setNumOfProduct(1);
  };

  const handleChangeColorComplete = (color: ColorResult) => {
    setCurrentColor(color.rgb);
  };

  function getBrightness(r: number, g: number, b: number): number {
    return (r * 299 + g * 587 + b * 114) / 1000;
  }

  function getTextColorForBackground(r: number, g: number, b: number): string {
    const brightness = getBrightness(r, g, b);
    return brightness > 128 ? "black" : "white";
  }

  return (
    <div className="ProductDetail">
      {contextHolder}
      {product?.categoryId !== noColorId && (
        <ColorTable
          setCurrentColor={setCurrentColor}
          isOpen={isColorModalOpen}
          setIsOpen={setIsColorModalOpen}
        />
      )}
      <div className="body">
        <div className="side-preview">
          <img src={product?.image}></img>
        </div>
        <div className="main-preview">
          <img src={product?.image}></img>
        </div>
        <div className="detail">
          <h3 className="full-width">{product?.nameProduct}</h3>
          <p className="full-width">
            {level && (
              <div
                style={{
                  fontSize: "20px",
                  color: "red",
                  fontWeight: "bold",
                  textDecoration: "line-through",
                }}
              >
                {NumberToVND.format(
                  numOfProduct *
                    (product?.volumes[0]?.price ?? 0) *
                    ratioPriceColor
                )}
              </div>
            )}
            <div
              style={{
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {level
                ? NumberToVND.format(
                    ((product?.volumes[0]?.price ?? 0) *
                      ratioPriceColor *
                      numOfProduct *
                      (100 - discount)) /
                      100
                  )
                : NumberToVND.format(
                    numOfProduct *
                      ratioPriceColor *
                      (product?.volumes[0]?.price ?? 0)
                  )}
            </div>
          </p>
          {product?.categoryId !== noColorId && (
            <div
              style={{
                width: "100%",
                display: "flex",
              }}
            >
              <div style={{ marginRight: "0.5rem" }}>
                <Button
                  style={{ width: "100%", marginBottom: "0.5rem" }}
                  onClick={() => setIsColorModalOpen(!isColorModalOpen)}
                >
                  Mở bảng màu
                </Button>
                <SketchPicker
                  disableAlpha
                  color={currentColor}
                  onChangeComplete={handleChangeColorComplete}
                />
              </div>
              <div
                style={{
                  flexGrow: "1",
                  backgroundColor: `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: `${getTextColorForBackground(
                    currentColor.r,
                    currentColor.g,
                    currentColor.b
                  )}`,
                }}
              >
                {`rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`}
              </div>
            </div>
          )}
          <h3 style={{ width: "100%" }}>Chi tiết</h3>
          <p className="full-width">{product?.description}</p>
          <div className="add-to-cart">
            <InputNumber
              min={1}
              max={100000}
              defaultValue={1}
              value={numOfProduct}
              onChange={(value) => setNumOfProduct(value ? value : 0)}
              changeOnWheel
            />
            <button style={{ marginLeft: "1rem" }} onClick={handleAddToCart}>
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
