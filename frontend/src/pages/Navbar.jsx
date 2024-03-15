import React from "react";
import { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import "../assets/css/nav.css";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get("http://localhost:3000/category");
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="d-flex flex-row w-100 gap-5 bg-primary">
      <div className="d-flex flex-column w-100 gap-1">
        <div className="row w-100 d-flex flex-row w-100 gap-5 mt-3 px-4">
          <span id="logo" className="col-md-auto col-1 text-secondary">
            Mazad
          </span>
          <div id="search-create-nav-container" className="col">
            <div id="search-create-container" className="d-flex flex-row gap-3 form-group">
              <input
                type="search"
                placeholder="Search Items, tags or categories"
                aria-label="Search"
                className="form-control col bg-dark text-white"
              />
              <button type="submit" className="btn btn-secondary col-auto">
                New MAZAD
              </button>

              <div className="col-auto d-flex flex-row gap-3 form-group">
                <a href="/register" role="button" className="btn btn-secondary">
                  Sign up
                </a>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div className="d-flex flex-row justify-content-center align-items-center gap-3 text-center">
            <div className="px-3 py-2 nav-item active">
              <a className="link d-inline-block w-auto" href="/">
                Home
              </a>
            </div>
            <div className="px-3 py-2 nav-item">
              <a className="link d-inline-block w-auto" id="categories" href="/categories">
                Categories <i className="fas fa-caret-down"></i>
              </a>
            </div>
            <div className="px-3 py-2 nav-item">
              <a className="link d-inline-block w-auto" id="liveMazad" href="/liveMazads">
                Live Mazads
              </a>
            </div>
            <div className="px-3 py-2 nav-item">
              <a className="link d-inline-block w-auto" href="/Popular">
                Popular Items
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
