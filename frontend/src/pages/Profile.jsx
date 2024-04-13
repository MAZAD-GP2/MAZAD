import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";

import SideProfile from "../components/SideProfile";
import * as api from "../api/index";
import { useNavigate, useParams } from "react-router-dom";
import RecentItems from "../components/RecentItems";
import NotFound from "../components/NotFound";

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const userData = sessionStorage.getItem("user");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const response = await api.getUserById(id);
          if (Object.keys(response.data).length) {
            setUser(response.data);
          } // check if user exists
          else navigate('/not-found', {replace: true});
          setLoading(false);
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
          setLoading(false);
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

  if (loading) {
    return (
      <div className=" text-center w-100 mt-5">
        <div className="spinner-border text-primary opacity-25" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <>
          <Navbar />
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
          <MobileNavbar />
        </>
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Profile;
