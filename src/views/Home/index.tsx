import './index.css'
import 'swiper/css'
import { Swiper, SwiperSlide } from 'swiper/react'
import { HOME_TOP_BANNERS } from '../../constant'

function Home() {
  return (
    <div className='Home'>
      <Swiper
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 200 }}
      >
        {HOME_TOP_BANNERS.length && HOME_TOP_BANNERS.map(item => {
          return <SwiperSlide><div className='swiper-slide-banner'><img src={`${item}`}></img></div></SwiperSlide>
        })}
      </Swiper>
    </div>
  )
}

export default Home
