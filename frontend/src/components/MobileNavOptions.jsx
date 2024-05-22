import React from "react";

function MobileNavOptions({ show, toggle }) {
  return (
    <>
      {show && <div className="overlay" onClick={toggle}></div>}
        <div className="row">
          <div
            className={`mobile-nav-options ${
              show ? "show" : ""
            } d-flex flex-row h-100 p-3 justify-content-evenly align-items-center border-top border-secondary border-4 w-100`}
          >
            
            <div className="sub-nav-item">
              <a href="/livemazads" className="small text-center">
                Live Mazads
              </a>
            </div>
            <div className="sub-nav-item">
              <a href="/#:~:text=Our%20items-,Categories,-Mazad%20offers%20a" className="small text-center">
                Catagories
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
