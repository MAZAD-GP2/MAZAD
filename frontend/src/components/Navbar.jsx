import React from "react";
import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../assets/css/nav.css";
import { useLocation } from "react-router-dom";
import * as api from "../api/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MobileSearchBar from "./MobileSearchBar";

const Navbar = (showMobileNavbar=true) => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [isMessages, setIsMessages] = useState("");
  const user = JSON.parse(sessionStorage.getItem("user"));
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

  function handleHref(id) {
    window.location.href = `/category-item/${id}`;
  }

  async function SubmitSearch(e) {
    if (!search) return;
    if (e.key === "Enter") {
      window.location.href = `/search?search=${search}`;
      setSearch("");
    }
  }

  return (
    <>
      {showMobileNavbar && (
        <MobileSearchBar
          search={search}
          setSearch={setSearch}
          SubmitSearch={SubmitSearch}
        />
      )}
      <div id="desktopNavbar" className="d-lg-block d-none">
        <div className="d-flex flex-row w-100 gap-5 bg-primary">
          <div className="d-flex flex-column w-100 gap-1">
            <div className="row w-100 d-flex flex-row w-100 gap-5 mt-3">
              <a
                className="navbar-logo col-md-auto col-1 text-secondary link px-4"
                href="/home"
                style={{ cursor: "pointer" }}
              >
                <img
                  src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1715589905/Mazad_Logo_English_With_Z_qorc8g.png"
                  alt="logo"
                  height="50px"
                />
              </a>
              <div id="search-create-nav-container" className="col">
                <div
                  id="search-create-container"
                  className="d-flex flex-row gap-3 form-group"
                >
                  <div className="input-container bg-dark rounded-5 border-0 d-flex">
                    <FontAwesomeIcon icon="fa-search" color="white" />
                    <input
                      type="search"
                      placeholder="Search Items, tags or categories"
                      aria-label="Search"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={SubmitSearch}
                      className="form-control col bg-dark text-white border-0 rounded-5 "
                      style={{ outline: "none" }}
                    />
                  </div>
                  {user ? (
                    <div className="create-item-pfp justify-end">
                      <a
                        type="submit"
                        className="btn btn-secondary col-auto align-content-center px-2 rounded-5 add-item"
                        href="/add-item"
                      >
                        <FontAwesomeIcon icon="fa-add" /> New Mazad
                      </a>
                      <div className="col-auto d-flex flex-row form-group align-content-end">
                        {user.profilePicture ? (
                          <img
                            onClick={() => (window.location.href = "/profile")}
                            src={user.profilePicture}
                            width={"40px"}
                            height={"40px"}
                            style={{
                              borderRadius: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                            }}
                          />
                        ) : (
                          <FontAwesomeIcon
                            icon="fa-regular fa-user"
                            className="profile-redirect"
                            onClick={() => (window.location.href = "/profile")}
                          />
                        )}
                      </div>
                    </div>
                  ) : (
                    <div id="lgn-sign-up-container w-100">
                      <div className="d-flex flex-row justify-content-between gap-3">
                        <a
                          type="submit"
                          className="btn btn-secondary col-auto px-3 rounded-5 align-content-center lgn-sign-up"
                          href="/login"
                        >
                          Log In
                        </a>
                        <a
                          className="btn btn-secondary col-auto px-3 rounded-5 align-content-center lgn-sign-up"
                          href="/register"
                          role="button"
                        >
                          Sign Up
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div>
              <div className="d-flex flex-row justify-content-center align-items-center gap-3 text-center">
                <a
                  className={
                    "px-3 py-2 nav-item" +
                    (location.pathname === "/home" ? " active" : "")
                  }
                  href="/home"
                >
                  <span
                    className={
                      "link d-inline-block w-auto" +
                      (location.pathname === "/home" ? " active-nav-link" : "")
                    }
                  >
                    Home
                  </span>
                </a>
                <Nav>
                  <NavDropdown
                    title="Categories"
                    id="navdropdown"
                    show={show}
                    onMouseEnter={showDropdown}
                    onMouseLeave={hideDropdown}
                    className={
                      "nav-item" +
                      (location.pathname.includes("/category-item/")
                        ? " active active-nav-link"
                        : "")
                    }
                  >
                    {/* <a className="link d-inline-block w-auto" id="categories" href="/categories">
                Categories <i className="fas fa-caret-down"></i>
              </a> */}
                    {categories.map((category) => (
                      <NavDropdown.Item
                        key={category.id}
                        onClick={() => handleHref(category.id)}
                      >
                        {category.name}
                      </NavDropdown.Item>
                    ))}
                  </NavDropdown>
                </Nav>
                <a
                  className={
                    "px-3 py-2 nav-item" +
                    (location.pathname === "/livemazads" ? " active" : "")
                  }
                  href="/livemazads"
                >
                  <span
                    className={
                      "link d-inline-block w-auto" +
                      (location.pathname === "/livemazads"
                        ? " active-nav-link"
                        : "")
                    }
                    id="liveMazad"
                  >
                    Live Mazads
                  </span>
                </a>
                <a
                  className={
                    "px-3 py-2 nav-item" +
                    (location.pathname === "/popular" ? " active" : "")
                  }
                  href="/popular"
                >
                  <span
                    className={
                      "link d-inline-block w-auto" +
                      (location.pathname === "/popular"
                        ? " active-nav-link"
                        : "")
                    }
                  >
                    Popular Items
                  </span>
                </a>
                {user ? (
                  <a
                    className={
                      "px-3 py-2 nav-item" +
                      (location.pathname === "/favorites" ? " active" : "")
                    }
                    href="/favorites"
                  >
                    <span
                      className={
                        "link d-inline-block w-auto" +
                        (location.pathname === "/favorites"
                          ? " active-nav-link"
                          : "")
                      }
                    >
                      Favorites
                    </span>
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
