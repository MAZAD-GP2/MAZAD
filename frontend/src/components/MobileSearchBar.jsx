import React from "react";
import { useState, useEffect } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const MobileSearchBar = ({ search, setSearch, SubmitSearch }) => {
  return (
    <div id="mobile-search" className="d-lg-none d-sm-block">
      <div className="d-flex flex-row w-100 gap-3 h-100 p-3 bg-primary border-bottom border-secondary border-4">
        <div className="d-flex flex-row justify-content-center align-items-center gap-3 w-100 ">
          <a
            className="navbar-logo col-md-auto col-1 text-secondary link me-3"
            href="/home"
            style={{ cursor: "pointer" }}
          >
            <img src="/src/assets/images/logo_english_black_mobile.png" alt="logo" height="50px" />
          </a>

          <div className="d-flex align-items-center justify-content-center gap-1 px-3 bg-dark rounded-5 border-0 w-100">
            <FontAwesomeIcon icon="fa-search" color="white" />
            <input
              type="search"
              placeholder="Search Mazad"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={SubmitSearch}
              className="form-control bg-dark text-white border-0 rounded-5"
              style={{ outline: "none" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchBar;
