import React from "react";
import "../assets/css/profile.css";

const RecentItems = () => {
  return (
    <div>
      <h3>Recent Auctions</h3>
      <div className="user-history">
        <div className="item-container">
          <p className="item-name">Item Name</p>
          <p className="bid-info">Highest Bid: $100</p>
          <p className="duration">Duration: 3 days left</p>
        </div>
        <nav aria-label="Page navigation example">
          <ul className="pagination justify-content-center">
            <li className="page-item">
              <a className="page-link text-black" href="#" aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
              </a>
            </li>
            <li className="page-item active ">
              <a className="page-link text-black" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-black" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-black" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link text-black" href="#" aria-label="Previous">
                <span aria-hidden="true">&raquo;</span>
                <span className="sr-only">Next</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default RecentItems;
