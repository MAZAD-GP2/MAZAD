import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Card from "./Card";
import * as api from "../api/index"
import { useDispatch, useSelector } from "react-redux";

const Home = () => {
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await api.getAllItems();
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
      <div className="d-flex flex-row flex-wrap gap-5 p-5 p-lg-5">
        {isFetching ? (
          <div className=" text-center w-100 mt-5">
            <div className="spinner-border text-primary opacity-25" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : items.length > 0 ? (
          items.map((item) => <Card item={item} key={item.id} />)
        ) : (
          <h1>No items found</h1>
        )}
      </div>
    </>
  );
};

export default Home;
