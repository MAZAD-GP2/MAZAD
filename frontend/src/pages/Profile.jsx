import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "./Navbar";
import * as api from "../api/index";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const userData = sessionStorage.getItem("user");
  const { enqueueSnackbar } = useSnackbar();

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

  const handleSignOut = async (event) =>{
    try{
    sessionStorage.clear()
    enqueueSnackbar("Singed out", { variant: "success" });
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
    }catch(err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  }

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
            <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
              {isCurrentUser && (
                <a className="edit-profile btn btn-secondary align-self-center" href="/edit-profile">
                  Edit Profile
                </a>
              )}
              {isCurrentUser && (
                <a className="edit-profile btn btn-danger align-self-center" onClick={handleSignOut}>
                  Sign Out
                </a>
              )}
            </div>
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
