import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import Card from "./Card";
import * as api from "../api/index";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CategoryItems = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  let isAdmin = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchItemsByCategory = async () => {
      try {
        const response = await api.getAllItemsByCategory(id);
        setItems(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchItemsByCategory();
  }, [id]);

  return (
    <>
      <Navbar />
      <div className="d-flex flex-row flex-wrap align-items-stretch justify-content-center gap-5 m-5 w-auto">
        {isFetching ? (
          <div className=" text-center w-100 mt-5">
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
      <MobileNavbar />
    </>
  );
};

export default CategoryItems;
