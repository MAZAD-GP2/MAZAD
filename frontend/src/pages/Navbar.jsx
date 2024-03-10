import React from "react";
import { useState,useEffect } from "react";
import NavDropdown from 'react-bootstrap/NavDropdown';
import axios from "axios";

const Navbar = () => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

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
    <div className="bg-gradient pb-4" style={{ padding: "0px" }}>
      <nav className="navbar d-flex bg-primary shadow navbar-expand-lg navbar-light bg-light p-1 mb-0">
        <h4 className="p-lg-3">
          <a href="/" style={{ textDecoration: "none" }}>
            <i className="text-white user-select-none ">_MAZAD_</i>
          </a>
        </h4>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse d-flex flex-row justify-content-center p-lg-1 gap-2"
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav mr-auto"></ul>

          <form className="form-inline my-2 my-lg-0 w-50">
            <input
              className="form-control rounded-4 w-200 p-20"
              type="search"
              placeholder="Search Items, tags or categories"
              aria-label="Search"
            />
          </form>
          <button
            className="btn btn-secondary my-2 my-sm-0 rounded-4"
            type="submit"
          >
            Search
          </button>
        </div>
        <div id="signup-container" className="d-flex">
          <a
            href="/login"
            style={{ color: "#F7CCAC", opacity: "90%" }}
            className="mx-2"
          >
            Log In
          </a>
          <a
            href="/register"
            style={{ color: "#F7CCAC", opacity: "90%" }}
            className="mx-2"
          >
            Sign Up
          </a>
        </div>
      </nav>

      {/* Second Navigation Bar with Dropdown */}
      <nav className="navbar d-flex bg-primary shadow navbar-expand-lg navbar-light bg-light mb-5 p-1 mt-0">
        <div className="d-flex justify-content-center w-100">
          <a
            href="/"
            style={{ color: "#F7CCAC", opacity: "90%" }}
            className="mx-2"
          >
            Home
          </a>
          <div role="button"
              id="categoriesDropdown"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false" 
              style={{ color: "#F7CCAC", opacity: "90%" }}
              >
            <NavDropdown title="Categories" id="basic-nav-dropdown"   >{/*   style={{zIndex:'-1'}}   */}
              {categories.length > 0 ? (
                categories.map((category) => (
                  <NavDropdown.Item
                    key={category.id}
                    href={`#${category.name}`}
                  >
                    {category.name}
                  </NavDropdown.Item>
                ))
              ) : (
                <NavDropdown.Item disabled>
                  No categories found
                </NavDropdown.Item>
              )}
            </NavDropdown>
          </div>
          <a
            href="/liveMazads"
            style={{ color: "#F7CCAC", opacity: "90%" }}
            className="mx-2"
          >
            Live Mazads
          </a>
          <a
            href="/interestingItems"
            style={{ color: "#F7CCAC", opacity: "90%" }}
            className="mx-2"
          >
            Interesting Items
          </a>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
