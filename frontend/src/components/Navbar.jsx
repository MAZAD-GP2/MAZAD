import React from "react";
import { useState, useEffect } from "react";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import "../assets/css/nav.css";
import { useLocation } from "react-router-dom";
import * as api from "../api/index";
import MobileSearchBar from "./MobileSearchBar";
import { Modal } from "react-bootstrap";
// import LoginForm from "./LoginForm";

const Navbar = (showMobileNavbar = true) => {
  const [categories, setCategories] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [show, setShow] = useState(false);
  const [search, setSearch] = useState("");
  const [isMessages, setIsMessages] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();
  const [loginModal, setLoginModal] = useState(false);
  const handleLoginModalClose = () => setLoginModal(false);

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

  function FavoritesRoute() {
    if(!user){
      setLoginModal(true);
      return;
    }
    window.location.href='/favorites';
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
                    <i className="fa fa-search text-white"></i>
                    <input
                      type="search"
                      placeholder="Search Items, tags or categories"
                      aria-label="Search"
                      name="search"
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
                        className="col-auto align-content-center px-2 rounded-5 add-item"
                        href="/chat"
                      >
                        <i className="fa fa-comment"></i> Chats
                      </a>
                      <a
                        className="col-auto align-content-center px-2 rounded-5 add-item"
                        href="/add-item"
                      >
                        <i className="fa fa-add"></i> New Mazad
                      </a>
                      <a
                        className="col-auto d-flex flex-row form-group align-content-end"
                        href="/profile"
                      >
                        <img
                          src={
                            user.profilePicture ||
                            "https://res.cloudinary.com/djwhrh0w7/image/upload/c_fill,w_60,h_60/v1716060482/profile_uakprb.png"
                          }
                          width={"40px"}
                          height={"40px"}
                          style={{
                            borderRadius: "100px",
                            objectFit: "cover",
                            cursor: "pointer",
                          }}
                        />
                      </a>
                    </div>
                  ) : (
                    <div id="lgn-sign-up-container w-100">
                      <div className="d-flex flex-row justify-content-between gap-3">
                        <a
                          className="col-auto align-content-center px-3 py-2 rounded-5 lgn-sign-up"
                          href="/register"
                          role="button"
                        >
                          Sign Up
                        </a>
                        <a
                          type="submit"
                          className="col-auto align-content-center px-2 rounded-5 lgn-sign-up"
                          href="/login"
                        >
                          Log In
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
                {/* <a
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
                </a> */}
                  <a
                    className={
                      "px-3 py-2 nav-item" +
                      (location.pathname === "/favorites" ? " active" : "")
                    }
                    href="/favorites"
                    // onClick={FavoritesRoute}
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
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal centered show={loginModal} onHide={handleLoginModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>To perform this action you must be logged in</p>
          <LoginForm {...{ next: window.location.href }} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Navbar;
