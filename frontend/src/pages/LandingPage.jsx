import React, { useEffect, useState } from "react";
import "../assets/css/landing.css";

const LandingPage = () => {

    const user = sessionStorage.getItem("user");
    const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > document.querySelector(".about").offsetTop) {
        setIsLoaded(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  return (
    <div className="landing-page">
      <div className="nav">
        <h5 className="home-lgn-nav">
          <a href="/home" className="link text-white">
            Home
          </a>
        </h5>
        {!user &&
         <h5 className="home-lgn-nav">
          <a href="/login" className="link text-white">
            Log In
          </a>
        </h5>}
      </div>
      <div className="slider-overlay">
        <h1 id="logo">MAZAD</h1>
        <p>Jordan's first specialized auctioning platform</p>
      </div>

      <div className="about">
        <div>
          <h3>Introducing Mazad</h3>
          <p>
            An innovative online auction platform specifically tailored to
            address the distinctive challenges encountered by consumers in
            Jordan when navigating international online auctions. Acknowledging
            the significant financial hurdles posed by import taxes, fees,
            shipment costs, and customs duties, our platform aims to transform
            the online auction landscape for Jordanian users. At the heart of
            Mazad is a commitment to offering a cost-effective alternative to
            traditional international auction systems, localizing the experience
            to empower Jordanian consumers without the deterrent of exorbitant
            fees.
          </p>
        </div>
        <div>
          <h3>Why Mazad?</h3>
          <p>
            The auctioning market in Jordan is witnessing a dynamic landscape
            with a substantial potential for growth. As of now, there is a
            diverse array of valuable items, ranging from antiques and
            collectibles to everyday use items, that are scattered across the
            country. However, the existing avenues for selling and acquiring
            such items are often fragmented, lacking a centralized platform that
            can efficiently connect buyers and sellers.
          </p>
          <p>
            Mazad aims to bridge this gap by not only catering to antique and
            rare items but also by providing a versatile space for the
            auctioning of a broad spectrum of goods. From contemporary artworks
            and collectibles to everyday items with unique stories.
          </p>
        </div>
        <div>
          <h3>Get Started</h3>
          <p>
            Our home page provides a list of in demand items that either don't
            have an auction set for them or have one set in a specified time in
            the future, login to Mazad to be able to start your own auctions,
            make bids on other users' auctioned items, add items to your
            favorites and chat with other users.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
