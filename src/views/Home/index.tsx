import "./index.css";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { HOME_TOP_BANNERS, ITEM_PER_ROW } from "../../constant";
import { Divider } from "antd";
import { useProducts } from "../../hooks/useProduct";
import { Product } from "../../type";
import { Link } from "react-router-dom";
import { NumberToVND } from "../../helper";

function Home() {
  const { data } = useProducts(1, 10);
  const products = data?.data ?? [];
  return (
    <div className="Home">
      <Swiper
        key={"banner"}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 200 }}
      >
        {HOME_TOP_BANNERS.map((item) => {
          return (
            <SwiperSlide key={item}>
              <div className="swiper-slide-banner">
                <img src={`${item}`} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Divider
        style={{
          color: "#f5a507",
          fontSize: "33px",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
        Chứng nhận chất lượng
      </Divider>
      <div className="quality-certification-container">
        <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_1a14d.jpg?1677557355750" />
        <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_2a14d.png?1677557355750" />
        <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_3a14d.jpg?1677557355750" />
        <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_4a14d.jpg?1677557355750" />
      </div>

      <Divider
        style={{
          color: "#f5a507",
          fontSize: "33px",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
        Sản phẩm nổi bật
      </Divider>
      <Swiper
        key={"top-product"}
        spaceBetween={10}
        slidesPerView={4}
        loop={true}
        autoplay={{ delay: 200 }}
      >
        {products.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <div className="swiper-slide-top-product">
                <img
                  src={`${item.image}`}
                  style={{ height: "100%", width: "20%" }}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <Divider
        style={{
          color: "#f5a507",
          fontSize: "33px",
          marginTop: "3rem",
          marginBottom: "3rem",
        }}
      >
        Tất cả sản phẩm
      </Divider>
      <div
        className="product-cards"
        style={{ gridTemplateColumns: `repeat(${ITEM_PER_ROW}, 1fr)` }}
      >
        {products.map((item: Product) => {
          return (
            <div key={item.id} className="grid-item">
              <Link to={`/product_detail/${item.id}`}>
                <img
                  src={item.image}
                  style={{ height: "70%", width: "100%" }}
                />
              </Link>
              <div className="overlay">
                <div className="product-card-info">
                  <div>{item.nameProduct}</div>
                  <div>Giá từ: {NumberToVND.format(item.price)}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
