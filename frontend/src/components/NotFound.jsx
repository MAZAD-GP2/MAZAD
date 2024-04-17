import React from "react";
import notFoundImage from "../assets/images/404-image.webp";
import Navbar from "./Navbar";

const NotFound = () => {
  return (
    <>
    <Navbar/>
    <div
      style={{
        position: "fixed",
        top: "45%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex",
        gap: "15px",
      }}
    >
      <img src={notFoundImage} alt="" />
      <div className="d-flex flex-column justify-content-center">
        <h4 style={{fontWeight: "630"}}>Page not found</h4>
        <p>Sorry, but we can't find the page you're looking for...</p>
      </div>
    </div>
    </>
  );
};

export default NotFound;
