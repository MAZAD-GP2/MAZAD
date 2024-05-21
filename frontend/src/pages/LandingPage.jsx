import React, { useEffect, useRef, useState } from "react";
import "../assets/css/landing.css";

const LandingPage = () => {
  const user = sessionStorage.getItem("user");
  const [isLoaded, setIsLoaded] = useState(false);
  const AboutRef = useRef(null);
  const categoriesRef = useRef(null);

  const scrollToAbout = () => {
    AboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToCategories = () => {
    categoriesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const categoryImages = [
    {
      id: 3,
      name: "Cars",
      img: "https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 1,
      name: "Electronics",
      img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      name: "Fashion",
      img: "https://images.unsplash.com/photo-1607892381203-0c54bd738575?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 7,
      name: "Furniture",
      img: "https://plus.unsplash.com/premium_photo-1670950411934-e21abf39191e?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZnVybml0dXJlfGVufDB8fDB8fHww",
    },
    {
      id: 6,
      name: "Vintage & Antique",
      img: "https://images.unsplash.com/photo-1616315168316-61d6e5f16ead?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YW50aXF1ZXxlbnwwfHwwfHx8MA%3D%3D",
    },
    {
      id: 5,
      name: "Art",
      img: "https://images.unsplash.com/photo-1514905552197-0610a4d8fd73?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 4,
      name: "Collectibles",
      img: "https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29sbGVjdGlibGVzfGVufDB8fDB8fHww",
    },
    {
      id: 8,
      name: "Toys & Games",
      img: "https://images.unsplash.com/photo-1606167668584-78701c57f13d?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Z2FtZXN8ZW58MHx8MHx8fDA%3D",
    },
  ];

  return (
    <div className="d-flex flex-column ">
      <div className="nav pt-4 pb-5">
        <div className="lgn-register-tab">
          {!user ? (
            <>
              <a href="/register" className="register-btn">
                Register
              </a>
              <a href="/login" className="lgn-btn">
                Login
              </a>
            </>
          ) : (
            <h6 >
              <a href="/home" className="lgn-btn">
                Home
              </a>
            </h6>
          )}
        </div>
      </div>
      <div className="d-flex mt-5 mb-5 justify-content-between top-container">
        <div className="logo-container">
          <img src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1716233934/full_logo_black_cnesqj.png" alt="" id="logo-img" />
          <h5 className="slogan">
            Jordan's First Specialized Auctioning Platform
          </h5>
          <p>
          Providing an avenue for trading unique items that are local to the area, ensuring a seamless and convenient experience for both buyers and sellers.
          </p>
          <button className="nav-btn" onClick={scrollToCategories}>
            Our items <i className="fa-solid fa-chevron-down"></i>
          </button>
        </div>
        <div
          className="image-container"
        >
          <div className="offset-rectangle"></div>
          <img src="https://res.cloudinary.com/djwhrh0w7/image/upload/v1716233934/hammer_z7kekv.avif" className="main-image"></img>
        </div>
      </div>

      <div className="categories-container" ref={categoriesRef}>
        <h3 className="fw-bold mb-4 pt-5">Categories</h3>
        <p className="category-header">
          Mazad offers a diverse array of items you can put up for auction, or
          bid on any existing auction for them, click on any of the images below
          to browse a category.
        </p>
        <div className="d-flex gap-4 flex-wrap">
          {categoryImages.map((category, index) => (
            <div
              key={index}
              className="category-item position-relative"
              onClick={() =>
                (window.location.href = `/category-item/${category.id}`)
              }
            >
              <img
                src={category.img}
                alt={category.name}
                className="category-img"
              />
              <div className="category-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center">
                <span className="category-name text-white fw-bold">
                  {category.name}
                </span>
              </div>
            </div>
          ))}
          <a
            className="category-item view-all link text-primary"
            href="/home"
          >
            <h3>View All</h3>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
