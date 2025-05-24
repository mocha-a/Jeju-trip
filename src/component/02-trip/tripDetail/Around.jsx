import { NavLink, useLocation } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from 'swiper/modules';
import AroundItem from './AroundItem'

function Around({arounddata}) {
  const location = useLocation();
  const pathParts = location.pathname.split('/');
  const type = pathParts[3]; // 현재 페이지의 type 추출

  return (
    <Swiper className='trip-around-swiper'
    slidesPerView={3.5}
    spaceBetween={20}
    modules={[Autoplay]}
    autoplay={{
      delay: 3000,
      disableOnInteraction: false,
    }}
    loop={arounddata.length > 4}
    >
      {
        arounddata.slice(0,8).map((item)=>
          <SwiperSlide className='trip-around-slide' key={item.contentsid}>
            <NavLink to={`/trip/triplist/${type}/tripdetail/${item.contentsid}`}>
              <AroundItem img={item.repPhoto?.photoid?.imgpath || '/imgs/common_noimage_02.png'} title={item.title} address={(item.roadaddress).replace("제주특별자치도 ", "")}/>
            </NavLink>
          </SwiperSlide>
        )
      }
    </Swiper>
  )
}

export default Around