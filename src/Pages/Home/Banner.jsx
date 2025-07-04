import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

import banner1 from '../../assets/banner/banner1.png';
import banner2 from '../../assets/banner/banner2.png';
import banner3 from '../../assets/banner/banner3.png';

import { Pagination, Autoplay } from "swiper/modules";

const Banner = () => {
  return (
    <div>
      <Swiper
        spaceBetween={30}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className="mySwiper"
      >
        <SwiperSlide>
            <img src={banner1} className="w-full h-[700px]" />
        </SwiperSlide>
        <SwiperSlide>
            <img src={banner2} className="w-full h-[700px]" />
        </SwiperSlide>
        <SwiperSlide>
            <img src={banner3} className="w-full h-[700px]" />
        </SwiperSlide>

      </Swiper>
    </div>
  );
};

export default Banner;
