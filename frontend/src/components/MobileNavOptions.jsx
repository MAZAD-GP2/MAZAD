import React from "react";

function MobileNavOptions({ show, toggle }) {
  return (
    <>
      {show && <div className="overlay" onClick={toggle}></div>}
        <div className="row">
          <div
            className={`mobile-nav-options ${
              show ? "show" : ""
            } d-flex flex-row h-100 p-3 justify-content-between align-items-center border-top border-secondary border-4 w-100`}
          >
            
            <div className="sub-nav-item">
              <a href="/categories" className="small text-center">
                Categories
              </a>
            </div>
            <div className="sub-nav-item">
              <a href="/livemazads" className="small text-center">
                Live Mazads
              </a>
            </div>
            <div className="sub-nav-item">
              <a href="/popular" className="small text-center">
                Popular
              </a>
            </div>
            <div className="sub-nav-item">
              <a href="/add-item" className="small text-center">
                Start a Mazad
              </a>
            </div>
          </div>
        </div>
    </>
  );
}

export default MobileNavOptions;
