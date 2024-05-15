import React from "react";
import notFoundImage from "../assets/images/404-image.webp";
import Navbar from "./Navbar";
import MobileNavbar from "./MobileNavbar";

const NotFound = () => {

  const goBack = () => {
    window.history.back();
  };

  return (
    <>
      <Navbar />
      <div className="container">
        <div className="row justify-content-center align-items-center">
          <div className="col-lg-6 col-md-8 col-sm-10 col-12 text-center">
            <img src={notFoundImage} alt="404 Page not found" className="img-fluid" style={{ userSelect: "none" }} />
            <div>
              <h4 style={{ fontWeight: "bold" }}>Page not found</h4>
              <p>Sorry, but we can't find the page you're looking for...</p>
              <button onClick={goBack} className="btn btn-secondary text-white mt-4">Go back</button>
            </div>
          </div>
        </div>
      </div>
      <MobileNavbar />
    </>
  );
};

export default NotFound;
