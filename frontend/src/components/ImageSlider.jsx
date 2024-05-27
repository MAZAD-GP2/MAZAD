import React, { useState, useEffect } from "react";
import "../assets/css/imageSlider.css";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";

const ImageSlider = ({ images }) => {
  const imageChangeInterval = 8000;
 
  useEffect(() => {
    const intervalId = setInterval(() => {
      document.querySelector(".swiper-button-next")?.click();
    }, imageChangeInterval);
    return () => clearInterval(intervalId);
  }, [imageChangeInterval]);
  
  return (
    <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="d-flex">
            <img src={image.imgURL} alt={`Slide ${index}`} />
          </SwiperSlide>
        ))}
      </Swiper>
  );
};

export default ImageSlider;
