import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import SideProfile from "../components/SideProfile";
import * as api from "../api/index";
import { useParams } from "react-router-dom";
import RecentItems from "../components/RecentItems";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const userData = sessionStorage.getItem("user");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const response = await api.getUserById(id);
          setUser(response.data);
          const parsedUserData = JSON.parse(userData);
          if (parsedUserData && parsedUserData.id == id) {
            setIsCurrentUser(true);
          }
        } else {
          if (userData) {
            setUser(JSON.parse(userData));
            setIsCurrentUser(true);
          } else {
            console.error("User ID not provided.");
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
    fetchUser();
    // Clean-up function to reset state when component unmounts or id changes
    return () => {
      setIsCurrentUser(false);
    };
  }, [id, userData]);

  return (
    <>
      <Navbar />
      {user && (
        <div className="d-flex">
          <SideProfile user={user} isCurrentUser={isCurrentUser} />
          <div className="user-history-container">
            <RecentItems />
            <h3>Bid History</h3>
            <div className="user-history">
              <div className="item-container">
                <p className="item-name">Item Name</p>
                <p className="bid-info">Highest Bid: $100</p>
                <p className="duration">Duration: 3 days left</p>
              </div>
              <div className="item-container">
                <p className="item-name">Item Name</p>
                <p className="bid-info">Highest Bid: $100</p>
                <p className="duration">Duration: 3 days left</p>
              </div>
              <div className="item-container">
                <p className="item-name">Item Name</p>
                <p className="bid-info">Highest Bid: $100</p>
                <p className="duration">Duration: 3 days left</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <MobileNavbar />
    </>
  );
};

export default Profile;
