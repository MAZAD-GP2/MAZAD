import React from "react";
import notFoundImage from "../assets/images/404-image.webp";

const NotFound = () => {
  return (
    <div
      style={{
        top: "50%",
        left: "50%",
        display: "flex",
        gap: "15px",
      }}
    >
      <img src={notFoundImage} alt="" />
      <div className="d-flex flex-column justify-content-center">
        <h2>Page not found</h2>
        <p>Sorry, but we can't find the page you're looking for..</p>
      </div>
    </div>
  );
};

export default NotFound;
