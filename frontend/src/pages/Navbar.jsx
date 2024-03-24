import React from "react";
import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import "../assets/css/nav.css";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import * as api from "../api/index";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [show, setShow] = useState(false);
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const user = JSON.parse(sessionStorage.getItem("user"));
  const navigate = useNavigate();
  const location = useLocation();

  const showDropdown = (e) => {
    setShow(!show);
  };
  const hideDropdown = (e) => {
    setShow(false);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.getAllCategories();
        setCategories(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetching(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="d-flex flex-row w-100 gap-5 bg-primary">
      <div className="d-flex flex-column w-100 gap-1">
        <div className="row w-100 d-flex flex-row w-100 gap-5 mt-3 px-4">
          <span
            id="navbarlogo"
            className="col-md-auto col-1 text-secondary"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
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
                <button type="submit" className="btn btn-secondary col-auto" onClick={() => navigate("/add-item")}>
                  New Mazad
                </button>
              ) : (
                <button type="submit" className="btn btn-secondary col-auto" onClick={() => navigate("/login")}>
                  Log in
                </button>
              )}
              {user ? (
                //<img src="https://images.unsplash.com/photo-1575936123452-b67c3203c357?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aW1hZ2V8ZW58MHx8MHx8fDA%3D"
                // width={"40px"} style={{borderRadius:"90px"}}></img>
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
            <div className={"px-3 py-2 nav-item" + (location.pathname === "/" ? " active" : "")}>
              <a
                className="link d-inline-block w-auto"
                /*href="/"*/ onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              >
                Home
              </a>
            </div>
            <Nav>
              <NavDropdown
                title="Categories"
                id="navdropdown"
                show={show}
                onMouseEnter={showDropdown}
                onMouseLeave={hideDropdown}
                className={"nav-item" + (location.pathname.includes("/category-item/") ? " active" : "")}
              >
                {/* <a className="link d-inline-block w-auto" id="categories" href="/categories">
                Categories <i className="fas fa-caret-down"></i>
              </a> */}
                {categories.map((category) => (
                  <NavDropdown.Item key={category.id} onClick={() => navigate(`/category-item/${category.id}`)}>
                    {category.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
            </Nav>
            <div className={"px-3 py-2 nav-item" + (location.pathname === "/liveMazads" ? " active" : "")}>
              <a className="link d-inline-block w-auto" id="liveMazad" href="/liveMazads">
                Live Mazads
              </a>
            </div>
            <div className="px-3 py-2 nav-item">
              <a
                className={"link d-inline-block w-auto" + (location.pathname === "/Popular" ? " active" : "")}
                href="/Popular"
              >
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
