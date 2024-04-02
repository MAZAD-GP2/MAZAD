import React, { useState, useEffect } from "react";
import "../assets/css/imageSlider.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

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
    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="image-slider-container">
      <div className="main-image">
        <img
          src={images[imageIndex].imgURL}
          alt="https://archive.org/download/placeholder-image/placeholder-image.jpg"
          className="img-slider-img"
        />
      </div>

      {images.length > 1 && (
        <>
          <button onClick={showPrevImage} className="img-slider-btn left">
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button onClick={showNextImage} className="img-slider-btn right">
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
