import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import missingPfp from "../assets/images/missing-pfp.jpg";
import Navbar from "../components/Navbar";
import { useSnackbar } from "notistack";
import MobileNavbar from "../components/MobileNavbar";

import * as api from "../api/index";
import { useParams } from "react-router-dom";
import RecentItems from "../components/RecentItems";
import NotFound from "../components/NotFound";
import EditProfile from "./EditProfile";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Profile = () => {
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState(null);
  const [auctionCount, setAuctionCount] = useState(0);
  const [bidCount, setBidCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [showEditSection, setShowEditSection] = useState(false);
  const userData = sessionStorage.getItem("user");

  const handleSignOut = async (event) => {
    try {
      sessionStorage.clear();
      enqueueSnackbar("Signed out", { variant: "success" });
      setTimeout(() => {
        window.location.href = "/home";
      }, 300);
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (id) {
          const response = await api.getUserById(id);
          if (Object.keys(response.data).length) {
            setUser(response.data);
          } // check if user exists

          // else navigate('/not-found', {replace: true});
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
          <div className="user-cred">
            <div className="d-flex gap-2">
              <img
                className="profile-pic"
                src={user.profilePicture ? user.profilePicture : missingPfp}
              />
              <div className="d-flex flex-column justify-content-center mt-4">
                <div className="username-admin-tag">
                  <h2 className="mb-0 fw-bold text-nowrap">{user.username}</h2>
                  {user.isAdmin && <p className="admin-tag">ADMIN</p>}
                </div>
                <p className="profile-info">{user.email}</p>
                <p className="profile-info">{user.phoneNumber}</p>
              </div>
            </div>
            <div className="stats-msg">
              <div className="stats">
                <span className="d-flex flex-column align-items-center">
                  <h4>AUCTIONS HOSTED</h4>
                  <h5 className="text-secondary">20</h5>
                </span>
                <span className="d-flex flex-column align-items-center">
                  <h4>BIDS MADE</h4>
                  <h5 className="text-secondary">200</h5>
                </span>
                <span className="d-flex flex-column align-items-center">
                  <h4>AUCTIONS WON</h4>
                  <h5 className="text-secondary">10</h5>
                </span>
              </div>
              <div className="d-flex justify-content-end">
                {isCurrentUser ? (
                  <button className="btn btn-danger " onClick={handleSignOut}>
                    <FontAwesomeIcon icon="fa-solid fa-arrow-right-from-bracket" />{" "}
                    Log Out
                  </button>
                ) : (
                  <button className="btn btn-secondary text-white msg-btn">
                    <FontAwesomeIcon icon="fa-solid fa-comment-dots" /> Message
                    User
                  </button>
                )}
                {/* temporary shitty log out button until we make a dropdown from pfp */}
              </div>
            </div>
          </div>
          {isCurrentUser && (
            <div className="d-flex justify-content-center my-5">
              <div
                style={{
                  backgroundColor: "#e1e1e1",
                  padding: "8px 30px",
                  display: "flex",
                  borderRadius: "5px",
                  gap: "5px",
                }}
              >
                <h6
                  className={`edit-history-toggle ${
                    showEditSection
                      ? "text-secondary text-decoration-underline"
                      : " "
                  }`}
                  onClick={() => setShowEditSection(true)}
                >
                  EDIT
                </h6>
                <span
                  style={{ border: "1px solid var(--primary-green)" }}
                ></span>
                <h6
                  className={`edit-history-toggle ${
                    !showEditSection
                      ? "text-secondary text-decoration-underline"
                      : " "
                  }`}
                  onClick={() => setShowEditSection(false)}
                >
                  HISTORY
                </h6>
              </div>
            </div>
          )}

          {showEditSection ? (
            <EditProfile />
          ) : (
            <div className="d-flex">
              <div className="user-history-container w-100 ">
                <RecentItems isCurrentUser={isCurrentUser} />
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
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default Profile;
