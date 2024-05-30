import React, { useEffect, useState } from "react";
import "../assets/css/profile.css";
import Card from "../components/Card";
import * as api from "../api/index";

const RecentItems = ({ id, sessionUser, setAuctionCount }) => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);
  const limit = 3; // Set the limit to 3 items per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.getAllItemsByUserId(id || sessionUser.id, page, limit);
        setItems(response.data.items);
        const total = Math.ceil(response.data.count / limit);
        setTotalPages(total);
        // setAuctionCount(response.data.count);
        // loop over and only count auctions where status is new
        for (let i = 0; i < response.data.items.length; i++) {
          if (response.data.items[i].Auction.status === "new") {
            setAuctionCount((prev) => prev + 1);
          }
        }

        if (total === 0) {
          setPage(0);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchItems();
  }, [page, limit]);

  const goToNextPage = () => setPage(page + 1);
  const goToPrevPage = () => setPage(page - 1);

  return (
    <>
      <h3>Recent Items</h3>
      <div
        className="user-history d-flex flex-wrap justify-content-center gap-3"
        style={{ justifyContent: "space-evenly", marginBottom: "10px" }}
      >
        {isFetching ? (
          <div className="text-center w-100">
            <div
              className="spinner-border text-primary opacity-25"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : items.length > 0 ? (
          <>
            {items.map((item) => (
              <div
                className="position-relative d-flex flex-row card item-card"
                key={item.id}
              >
                <div
                  id="price"
                  className="position-absolute end-0 top-0 py-1 px-3 m-2 z-2 rounded-5 bg-primary text-white border border-secondary"
                >
                  <span>${item.Auction.highestBid}</span>
                </div>
                <Card item={item} key={item.id} className="item-card h1-00" />
              </div>
            ))}
          </>
        ) : (
          <h4>No items found</h4>
        )}
      </div>
      {totalPages > 0 && (
        <div className="text-muted d-flex flex-row justify-content-center">
          <button
            className="btn btn-secondary w-10 text-white rounded-5"
            disabled={page === 1}
            onClick={goToPrevPage}
          >
            &lt; Prev
          </button>
          <span className="m-2">
            {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary w-10 text-white rounded-5"
            disabled={page === totalPages}
            onClick={goToNextPage}
          >
            Next &gt;
          </button>
        </div>
      )}
    </>
  );
};

export default RecentItems;
