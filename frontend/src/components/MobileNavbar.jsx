import React from "react";
import { useState, useEffect } from "react";

import "../assets/css/mobileNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MobileNavOptions from "./MobileNavOptions";

const MobileNavbar = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const [showOptions, setShowOptions] = useState(false);
  const [newMessages, setNewMessages] = useState(true);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <>
      <div id="mobile-navbar" className="d-lg-none d-sm-block z-999">
        <div className="w-100" id="navbar">
          <div className="d-flex flex-row justify-content-between w-100 h-100 p-3 bg-primary border-top border-secondary border-4">
            <div
              className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                location.pathname.includes("/home") ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon="home" />
              <a href="/home" className="small text-center">
                Home
              </a>
            </div>
            <div
              className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                location.pathname.includes("/chat") ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon="comment" />
              <a href="/chat" className="small text-center">
                Chat
              </a>
            </div>
            {/* <div
              className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                location.pathname.includes("/add-item") ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon="add" />
              <a href="/add-item" className="small text-center">
                New Mazad
              </a>
            </div> */}
            {user ? (
              <div
                className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                  location.pathname.includes("/profile") ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon="user" />
                <a href="/Profile" className="small text-center">
                  Profile
                </a>
              </div>
            ) : (
              <div
                className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${
                  location.pathname.includes("/login") ? "active" : ""
                }`}
              >
                <FontAwesomeIcon icon="user" />
                <a href="/login" className="small text-center">
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
              <FontAwesomeIcon icon="ellipsis-h" />
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
