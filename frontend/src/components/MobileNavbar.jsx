import React from "react";
import { useState, useEffect } from "react";

import "../assets/css/mobileNav.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MobileNavOptions from "./MobileNavOptions";
const MobileNavbar = () => {
  const [showOptions, setShowOptions] = useState(false);

  const toggleOptions = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div id="mobile-navbar">
      <div className="w-100" id="navbar">
        <div className="d-flex flex-row w-100 gap-5 h-100 p-3 bg-primary border-top border-secondary border-4">
        <div className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${(location.pathname.includes("/home/") || location.pathname === "/") ? "active" : ""}`}>
            <FontAwesomeIcon icon="home" />
            <a href="/" className="small text-center">
              Home
            </a>
          </div>
          <div className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${location.pathname.includes("/chat") ? "active" : ""}`}>
            <FontAwesomeIcon icon="comment" />
            <a href="/chat" className="small text-center">
              Chat
            </a>
          </div>
          <div className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${location.pathname.includes("/profile") ? "active" : ""}`}>
            <FontAwesomeIcon icon="user" />
            <a href="/Profile" className="small text-center">
              Profile
            </a>
          </div>
          <div
            className={`mobile-nav-item d-flex flex-column justify-content-center align-items-center gap-1 ${showOptions ? "active" : ""}`}
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
  );
};

export default MobileNavbar;
