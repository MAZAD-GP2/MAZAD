import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import Card from "../components/Card";
import * as api from "../api/index";

const Home = () => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const queryParams = new URLSearchParams(window.location.search);
  const search = queryParams.get('search');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.search(search);
        setItems(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <>
      <Navbar />
      <div className="d-flex flex-row flex-wrap align-items-stretch justify-content-center gap-5 m-5 w-auto">
        {isFetching ? (
          <div className=" text-center w-100">
            <div
              className="spinner-border text-primary opacity-25"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => (
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
              <Card item={item} key={item.id} className="h1-00" />
            </div>
          ))
        ) : (
          <h1>No items found</h1>
        )}
      </div>
      
      <MobileNavbar />
    </>
  );
};

export default Home;
