import React from "react";
import { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import "../assets/css/nav.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();

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
            مَزَاد
          </span>
          <div id="search-create-nav-container" className="col">
            <div id="search-create-container" className="d-flex flex-row gap-3 form-group">
              <input
                type="search"
                placeholder="Search Items, tags or categories"
                aria-label="Search"
                className="form-control col bg-dark text-white"
              />
              {user ? (
                <button type="submit" className="btn btn-secondary col-auto">
                  New Mazad
                </button>
              ) : (
                <button type="submit" className="btn btn-secondary col-auto" onClick={() => navigate("/login")}>
                  Log in
                </button>
              )}
              {user ? (
                // <div className="rounded-circle img-fluid">
                //   <div
                //     className="rounded-circle img-fluid btn btn-secondary col-auto"
                //     onClick={() => navigate("/login")}
                //     style={{
                //       backgroundImage: `url("${"https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"}")`,
                //       backgroundSize: "cover",
                //       width: "100%",
                //       height: "100%",
                //     }}
                //   ></div>
                // </div>
                <div className="col-auto d-flex flex-row gap-3 form-group">
                  <a href="/register" role="button" className="btn btn-secondary">
                    Profile
                  </a>
                </div>
              ) : (
                <a className="btn btn-secondary col-auto" href="/register" role="button">
                  Sign Up
                </a>
              )}
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
