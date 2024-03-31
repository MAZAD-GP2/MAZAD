import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "./Navbar";
import * as api from "../api/index";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
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
          <div className="user-cred">
            <img src={user.profilePicture} className="profile-pic" />
            <h3 className="profile-username">{user.username}</h3>
            {user.isAdmin && <p className="admin-tag">Admin</p>}
            <p className="profile-info">{user.email}</p>
            <p className="profile-info">{user.phoneNumber}</p>
            {isCurrentUser && (
              <a
                className="edit-profile btn btn-secondary align-self-center"
                href="/editProfile"
              >
                Edit Profile
              </a>
            )}
          </div>
          <div className="user-history-container">
            <h3>Recent Auctions</h3>
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
    </>
  );
};

export default Profile;
