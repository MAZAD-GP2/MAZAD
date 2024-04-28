import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import Card from "../components/Card";
import Filters from "../components/Filters";
import * as api from "../api/index";

const Home = () => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.getAllItems("status=all");
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
      <div className="d-flex flex-row align-items-start justify-content-start gap-3 px-3 py-3 w-100">
        <div id="filters-container" className="sticky-left col-lg-2 col-md-4 col-sm-5">
          <div  className="w-100">
            <Filters setItems={setItems} />
          </div>
        </div>
        <div className="d-flex flex-row flex-wrap align-items-stretch justify-content-center justify-self-center gap-5 w-100">
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
            items.map((item) => <Card item={item} key={item.id} />)
          ) : (
            <h1>No items found</h1>
          )}
        </div>
      </div>
      <MobileNavbar />
    </>
  );

};

export default Home;
