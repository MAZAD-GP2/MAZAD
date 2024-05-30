import React from "react";
import { useState, useEffect } from "react";

import "../assets/css/mobileNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MobileNavOptions from "./MobileNavOptions";

const MobileNavbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [showOptions, setShowOptions] = useState(false);
  const [newMessages, setNewMessages] = useState(true);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <>
      <div id="mobile-navbar" className="d-lg-none d-sm-block t-5">
        <div className="w-100 z-3" id="navbar">
          <div className="d-flex flex-row justify-content-between w-100 h-100 p-3 bg-primary border-top border-secondary border-4">
            <div
              className={`mobile-nav-item d-flex flex-column ${
                location.pathname.includes("/home") ? "active" : ""
              }`}
            >
              <a
                href="/home"
                className="small text-center d-flex flex-column gap-2"
              >
                <i className="fa fa-home"></i>
                Home
              </a>
            </div>
            <div
              className={`mobile-nav-item d-flex flex-column ${
                location.pathname.includes("/chat") ? "active" : ""
              }`}
            >
              <a
                href="/chat"
                className="small text-center d-flex flex-column gap-2"
              >
                <i className="fa fa-comment"></i>
                Chat
              </a>
            </div>
            {/* <div
              className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                location.pathname.includes("/add-item") ? "active" : ""
              }`}
            >
            <a href="/add-item" className="small text-center d-flex flex-column gap-2">
              <FontAwesomeIcon icon="add" />
              New Mazad
              </a>
            </div> */}
            {user ? (
              <div
                className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                  location.pathname.includes("/profile") ? "active" : ""
                }`}
              >
                <a href="/Profile" className="small text-center d-flex flex-column gap-2">
                  <i className="fa fa-user"></i>
                  Profile
                </a>
              </div>
            ) : (
              <div
                className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                  location.pathname.includes("/login") ? "active" : ""
                }`}
              >
                <a href="/login" className="small text-center d-flex flex-column gap-2">
                  <i className="fa fa-user"></i>
                  Login
                </a>
              </div>
            )}
            <div
              className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                showOptions ? "active" : ""
              }`}
              onClick={toggleOptions}
            >
              <i className="fa fa-ellipsis"></i>
              <div className="small text-center">More</div>
            </div>
          </div>
        </div>
        <div>
          <MobileNavOptions show={showOptions} toggle={toggleOptions} />
        </div>
      </div>
    </>
  );
};

export default MobileNavbar;
