import React from "react";
import { useState, useEffect } from "react";
import NavDropdown from "react-bootstrap/NavDropdown";
import axios from "axios";
import "../assets/css/nav.css";

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
    <header>
      <h1 id="logo">Mazad</h1>
      <div id="search-create-nav-container">
        <div id="search-create-container">
          <form>
            <input
              type="search"
              placeholder="Search Items, tags or categories"
              aria-label="Search"
            />
          </form>
          <button
            type="submit"
          >
           New Mazad
          </button>
        </div>
        <div id="nav-container">
          <a href="/">Home</a>

          <a id="dropd"><NavDropdown title="Categories" >
            {categories.length > 0 ? (
              categories.map((category) => (
                <NavDropdown.Item key={category.id} href={`#${category.name}`}>
                  {category.name}
                </NavDropdown.Item>
              ))
            ) : (
              <NavDropdown.Item disabled>No categories found</NavDropdown.Item>
            )}
          </NavDropdown>
          </a>
          <a id='liveMazad' href="/liveMazads">Live Mazads</a>
          <a href="/interestingItems">Popular Items</a>
        </div>
      </div>
      <div id="login-signup">
        <ul>
          <li>
            <a href="/login">Login</a>
          </li>
          <li>
            <a href="/register">Sign up</a>
          </li>
        </ul>
      </div>
    </header>

  );
};

export default Navbar;
