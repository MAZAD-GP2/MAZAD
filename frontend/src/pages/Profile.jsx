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
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [user, setUser] = useState(null);
  const [auctionCount, setAuctionCount] = useState(0);
  const [bidCount, setBidCount] = useState(0);
  const [auctionWon, setAuctionWon] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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
      if (id) {
        if (sessionUser.id == id) {
          setIsCurrentUser(true);
        } 
        else setIsCurrentUser(false);
      }
      else setIsCurrentUser(true);
      
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
            // setIsCurrentUser(true);
          }
        } else {
          if (userData) {
            setUser(JSON.parse(userData));
            // setIsCurrentUser(true);
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
      // setIsCurrentUser(false);
    };
  }, [id, userData]);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.getUserStats(id);
        setAuctionWon(response.data.AuctionsWonCount);
        setBidCount(response.data.bidCount);
      } catch (err) {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      }
      setStatsLoading(false);
    };

    const fetchData = async () => {
      await fetchUserStats();
    };

    fetchData();

    return () => {
      setStatsLoading(true);
    };
  }, [id]);

  const handleMessageUser = async () => {
    try {
      const response = await api.getRoomByUser(id);
      window.location.href = `/chat/${response.data.roomId}`;
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  };


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
          <div className="p-lg-5 p-2 d-flex flex-column gap-lg-4 gap-2">
            <div className="card user-card bg-white p-lg-4 p-2 d-flex flex-row flex-wrap gap-4 justify-content-between align-items-center">
              <div className="d-flex gap-3">
                <img
                  className="profile-pic"
                  src={user.profilePicture ? user.profilePicture : missingPfp}
                />
                <div className="d-flex flex-column justify-content-center mt-4">
                  <div className="username-admin-tag">
                    <h2 className="mb-0 fw-bold text-nowrap">
                      {user.username}
                    </h2>
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
                    <h5 className="text-secondary">
                      {statsLoading ? (
                        <div className=" text-center w-100 mt-5">
                          <div
                            className="spinner-border text-primary opacity-25"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        auctionCount
                      )}
                    </h5>
                  </span>
                  <span className="d-flex flex-column align-items-center">
                    <h4>BIDS MADE</h4>
                    <h5 className="text-secondary">
                      {statsLoading ? (
                        <div className=" text-center w-100 mt-5">
                          <div
                            className="spinner-border text-primary opacity-25"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        bidCount
                      )}
                    </h5>
                  </span>
                  <span className="d-flex flex-column align-items-center">
                    <h4>AUCTIONS WON</h4>
                    <h5 className="text-secondary">
                      {statsLoading ? (
                        <div className=" text-center w-100 mt-5">
                          <div
                            className="spinner-border text-primary opacity-25"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      ) : (
                        auctionWon
                      )}
                    </h5>
                  </span>
                </div>
                <div className="d-flex justify-content-end">
                  {isCurrentUser ? (
                    <button className="btn btn-danger " onClick={handleSignOut}>
                      <i className="fa-solid fa-arrow-right-from-bracket"></i> Log Out
                    </button>
                  ) : (
                    <button className="d-flex align-items-center gap-2 btn btn-secondary text-white msg-btn" onClick={handleMessageUser}>
                      <i className="fa-solid fa-comment-dots"></i>
                      Message User
                    </button>
                  )}
                  {/* temporary shitty log out button until we make a dropdown from pfp */}
                </div>
              </div>
            </div>
            <div className="card user-card d-flex flex-column gap-lg-4 gap-1s p-lg-4 p-2">
              {isCurrentUser && (
                <div className="d-flex justify-content-center">
                  <ul
                    className="nav nav-pills mb-3 gap-3"
                    id="pills-tab"
                    role="tablist"
                  >
                    <li className="nav-item" role="presentation">
                      <button
                        className={`btn ${
                          showEditSection ? "btn-white text-primary border-primary" : "btn-secondary"
                        } w-100`}
                        id="pills-history-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-history"
                        type="button"
                        role="tab"
                        aria-controls="pills-history"
                        aria-selected={showEditSection}
                        onClick={() => setShowEditSection(false)}
                      ><i className="fa-solid fa-clock-rotate-left"></i> History
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`btn ${
                          !showEditSection ? "btn-white text-primary border-primary" : "btn-secondary"
                        } w-100`}
                        id="pills-edit-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-edit"
                        type="button"
                        role="tab"
                        aria-controls="pills-edit"
                        aria-selected={!showEditSection}
                        onClick={() => setShowEditSection(true)}
                      ><i className="fa-solid fa-gear"></i> Edit
                      </button>
                    </li>
                  </ul>
                </div>
              )}

              <div className="tab-content" id="pills-tabContent">
                <div
                  className={`tab-pane fade ${
                    !showEditSection ? "show active" : ""
                  }`}
                  id="pills-history"
                  role="tabpanel"
                  aria-labelledby="pills-history-tab"
                >
                  <div className="card user-card d-flex flex-column gap-lg-4 gap-3 p-lg-4 p-2">
                    <RecentItems
                      isCurrentUser={isCurrentUser}
                      setAuctionCount={setAuctionCount}
                    />
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
                {isCurrentUser && (
                  <div
                    className={`tab-pane fade ${
                      showEditSection ? "show active" : ""
                    }`}
                    id="pills-edit"
                    role="tabpanel"
                    aria-labelledby="pills-edit-tab"
                  >
                    <div className="card user-card d-flex flex-column gap-lg-4 gap-3 p-lg-4 p-2">
                      <EditProfile />
                    </div>
                  </div>
                )}
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
