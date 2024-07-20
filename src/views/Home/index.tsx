import "./index.css";
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { HOME_TOP_BANNERS } from "../../constant";
import { Divider } from "antd";
import { useProducts } from "../../hooks/useProduct";

function Home() {
  const { data, mutate: _refreshProducts } = useProducts(1, 10);
  const products = data?.data ?? [];
  return (
    <div className="Home">
      <Swiper
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
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 200 }}
      >
        {products.map((item) => {
          return (
            <SwiperSlide key={item.id}>
              <div className="swiper-slide-top-product">
                <img src={`${item.image}`} />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}

export default Home;
