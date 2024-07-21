import { Button, Divider } from "antd";
import { Carousel } from "react-responsive-carousel";
import { Link } from "react-router-dom";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { HOME_TOP_BANNERS } from "../../constant";
import { NumberToVND } from "../../helper";
import { useProducts } from "../../hooks/useProduct";
import { Product } from "../../type";

import "react-responsive-carousel/lib/styles/carousel.min.css";
import "swiper/css";
import "swiper/css/navigation";

import "./index.css";

function TopBanners() {
  return (
    <Carousel
      autoPlay
      infiniteLoop
      showThumbs={false}
      showStatus={false}
      emulateTouch
      swipeable
    >
      {HOME_TOP_BANNERS.map((item) => (
        <div className="swiper-slide-banner" key={item}>
          <img src={item} />
        </div>
      ))}
    </Carousel>
  );
}

type TopProductGridProps = {
  products: Product[];
};

function TopProductGrid({ products }: TopProductGridProps) {
  return (
    <div className="top-product-grid">
      {products.slice(0, 8).map((item: Product) => {
        return (
          <div key={item.id} className="grid-item">
            <Link to={`/product_detail/${item.id}`} className="product-link">
              <img src={item.image} />
              <div className="overlay">
                <div className="product-card-info">
                  <div>{item.nameProduct}</div>
                  <div>Giá từ: {NumberToVND.format(item.price)}</div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function QualityCertificates() {
  return (
    <div className="quality-certification-container">
      <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_1a14d.jpg?1677557355750" />
      <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_2a14d.png?1677557355750" />
      <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_3a14d.jpg?1677557355750" />
      <img src="https://sonvmax.com/bizweb.dktcdn.net/100/156/168/themes/694077/assets/banner_center_4a14d.jpg?1677557355750" />
    </div>
  );
}

function Home() {
  const { data } = useProducts(1, 10);
  const products = data?.data;

  return (
    <div className="Home">
      <TopBanners />
      <Divider className="Home-divider">Chứng nhận chất lượng</Divider>
      <QualityCertificates />

      <Divider className="Home-divider">Sản phẩm nổi bật</Divider>
      <TopProductGrid products={products ?? []} />

      <Divider className="Home-divider">Tất cả sản phẩm</Divider>
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        modules={[Navigation, Autoplay]}
        navigation
        loop
        autoplay={{ delay: 3000 }}
      >
        {products?.map((item) => (
          <SwiperSlide key={item.id}>
            <div className="swiper-slide-top-product">
              <img src={`${item.image}`} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Link to="/products">
        <Button>Xem tất cả</Button>
      </Link>

      <Divider className="Home-divider">Tin tức</Divider>
    </div>
  );
}

export default Home;
