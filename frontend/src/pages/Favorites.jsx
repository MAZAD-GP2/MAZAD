import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import Card from "../components/Card";
import * as api from "../api/index";

const Home = () => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.getAllItemsByFavorites();
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
        <div className="d-flex flex-row flex-wrap align-items-stretch justify-content-center gap-5 w-auto">
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
            items.map((item) => <Card item={item} />)
          ) : (
            <h1>No items found</h1>
          )}
        </div>
      <MobileNavbar />
    </>
  );

};

export default Home;
