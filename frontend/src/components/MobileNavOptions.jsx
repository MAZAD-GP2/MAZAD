import React from "react";

function MobileNavOptions({ show, toggle }) {
  return (
    <>
      {show && <div className="overlay" onClick={toggle}></div>}
      <div className="d-flex flex flex-column">
        <div className="row">
          <div
            className={`mobile-nav-options ${
              show ? "show" : ""
            } d-flex flex-row gap-5 h-100 p-3 border-top border-secondary border-4`}
          >
            
            <div className="nav-item d-flex flex-column justify-content-center align-items-center gap-1">
              <a href="/categories" className="small text-center">
                Categories
              </a>
            </div>
            <div className="nav-item d-flex flex-column justify-content-center align-items-center gap-1">
              <a href="/livemazads" className="small text-center">
                Live Mazads
              </a>
            </div>
            <div className="nav-item d-flex flex-column justify-content-center align-items-center gap-1">
              <a href="/popular" className="small text-center">
                Popular
              </a>
            </div>
            <div className="nav-item d-flex flex-column justify-content-center align-items-center gap-1">
              <a href="/add-item" className="small text-center">
                Start a Mazad
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MobileNavOptions;
