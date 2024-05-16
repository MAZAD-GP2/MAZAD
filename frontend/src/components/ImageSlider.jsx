import React, { useState, useEffect } from "react";
import "../assets/css/imageSlider.css";

const ImageSlider = ({ images }) => {
  const imageChangeInterval = 6000;
  const [imageIndex, setImageIndex] = useState(0);

  // Function to show the previous image
  const showPrevImage = () => {
    setImageIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  // Function to show the next image
  const showNextImage = () => {
    setImageIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      showNextImage();
    }, imageChangeInterval);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="image-slider-container w-100  h-100">
      <div className="main-image d-flex flex-row justify-content-center align-items-center w-100 h-100">
        <img
          src={images[imageIndex].imgURL}
          alt="https://archive.org/download/placeholder-image/placeholder-image.jpg"
          className="img-slider-img"
        />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={showPrevImage} className="img-slider-btn left">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button onClick={showNextImage} className="img-slider-btn right">
            <i className="fas fa-chevron-right"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
