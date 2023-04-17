import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

import "./ImageCarousel.scss";

import { FreeMode, Navigation, Thumbs } from "swiper";
import { STORAGE_URL } from "../utils";

interface ImageCarouselProps {
  images?: string[];
  style?: object;
  isFromServer?: boolean;
  preview?: boolean;
  previewImages?: File[];
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  isFromServer = false,
  preview = false,
  previewImages = [],
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div style={{ width: "400px" }}>
      <Swiper
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mainSwiper"
      >
        {!preview &&
          images?.map((image, key) => (
            <SwiperSlide key={key}>
              <img
                src={isFromServer ? STORAGE_URL + image : image}
                alt={image}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png";
                }}
              />
            </SwiperSlide>
          ))}
        {preview &&
          previewImages?.map((file, key) => (
            <SwiperSlide key={key}>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png"
                }
                alt={"preview "}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png";
                }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {!preview &&
          images?.map((image, key) => (
            <SwiperSlide key={key}>
              <img
                src={isFromServer ? STORAGE_URL + image : image}
                alt={image}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png";
                }}
              />
            </SwiperSlide>
          ))}

        {preview &&
          previewImages?.map((file, key) => (
            <SwiperSlide key={key}>
              <img
                src={
                  file
                    ? URL.createObjectURL(file)
                    : "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png"
                }
                alt={"preview "}
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src =
                    "https://qawerk.com/wp-content/uploads/2021/07/no-image-available-icon-6.png";
                }}
              />
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default ImageCarousel;
