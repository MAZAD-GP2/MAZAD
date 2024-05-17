import React from "react";

const MobileSearchBar = ({ search, setSearch, SubmitSearch }) => {
  return (
      <div className="d-lg-none d-sm-block bg-primary p-2 border-bottom border-secondary border-4">
        <div className="d-flex flex-row justify-content-center align-items-center gap-3">
          <a
            className="text-secondary link"
            href="/home"
            style={{ cursor: "pointer" }}
          >
            <img src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1715590016/logo_english_black_mobile_j6ywrs.png" alt="logo" height="40px" />
          </a>

          <div className="d-flex align-items-center justify-content-center gap-1 px-3 bg-dark rounded-5 border-0 w-100">
            <i className="fa fa-search text-white" ></i>
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
  );
};

export default MobileSearchBar;
