import React, { useState, useEffect } from "react";
import "../assets/css/profile.css";
import Navbar from "./Navbar";
import * as api from "../api/index";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "/src/assets/css/auth.css";
import { useSnackbar } from "notistack";
import { Spinner } from "react-bootstrap";
import "bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const userData = sessionStorage.getItem("user");

  const [isEditing, setisEditing] = useState(false); // Track editing status
  const { enqueueSnackbar } = useSnackbar();

  const [username, setUsername] = useState({ value: "", isValid: true });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", isValid: true });
  const [email, setEmail] = useState({ value: "", isValid: true });
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (userData) {
          setUser(JSON.parse(userData));
          setIsCurrentUser(true);
        } else {
          console.error("User ID not provided.");
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
  }, [userData]);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUsername({ value: parsedUserData.username, isValid: true });
      setPhoneNumber({ value: parsedUserData.phoneNumber, isValid: true });
      setEmail({ value: parsedUserData.email, isValid: true });
    }
  }, []);

  const popoverUsername = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul>
          <li>Use 6 to 20 characters</li>
          <li>Must start with a letter</li>
          <li>Use only letters, numbers, underscores, dots, and spaces</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

  const popoverPhoneNumber = (
    <Popover id="popover-basic">
      <Popover.Body>Enter a jordanian valid phone number</Popover.Body>
    </Popover>
  );

  const popoverEmail = (
    <Popover id="popover-basic">
      <Popover.Body>Enter a valid email address</Popover.Body>
    </Popover>
  );

  const handleInputChange = () => {
    setUsername({ ...username, isValid: true });
    setPhoneNumber({ ...phoneNumber, isValid: true });
    setEmail({ ...email, isValid: true });
  };

  const handleUsernameChange = (event) => {
    const value = event.target.value;
    setUsername({ value, isValid: true });
  };

  const handlePhoneNumberChange = (event) => {
    const value = event.target.value;
    let valid = true;
    let regex = new RegExp("^[0-9]{10}$");
    if (!regex.test(value)) {
      valid = false;
    }
    setPhoneNumber({ value, isValid: !!valid });
  };

  const handleEmailChange = (event) => {
    const value = event.target.value;
    setEmail({ value, isValid: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setisEditing(true); // Set registration status to true when registration button is clicked
    let success = true;
    // Validate input fields
    if (!username.isValid || !username.value) {
      setUsername({ ...username, isValid: false });
      success = false;
    }
    if (!phoneNumber.isValid || !phoneNumber.value) {
      setPhoneNumber({ ...phoneNumber, isValid: false });
      success = false;
    }
    if (!email.isValid || !email.value) {
      setEmail({ ...email, isValid: false });
      success = false;
    }

    if (!success) {
      setisEditing(false); // Set registration status back to false
      return;
    }
    // Perform registration
    await api
      .userUpdate({
        username: username.value,
        email: email.value,
        phoneNumber: phoneNumber.value,
      })
      .then((result) => {
        setUsername({ value: "", isValid: true });
        setPhoneNumber({ value: "", isValid: true });
        setEmail({ value: "", isValid: true });
        sessionStorage.setItem("user", JSON.stringify(result.data));
        enqueueSnackbar("Changes Saved Successfully", { variant: "success" });
        window.location.href = "/";
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      })
      .finally(() => {
        setisEditing(false); // Set registration status back to false
      });
  };
  const handleDiscard = async (event) => {
    event.preventDefault();
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      setUsername({ value: parsedUserData.username, isValid: true });
      setPhoneNumber({ value: parsedUserData.phoneNumber, isValid: true });
      setEmail({ value: parsedUserData.email, isValid: true });
    }
  };

  return (
    <>
      <Navbar />
      {user && (
        <div className="d-flex">
          <div className="user-cred">
            <img src={user.profilePicture} className="profile-pic" />
            <h3 className="profile-username">{user.username}</h3>
            {user.isAdmin && <p className="admin-tag">Admin</p>}
            {isCurrentUser && (
              <a
                className="edit-profile btn btn-secondary align-self-center"
                href="/profile"
              >
                Profile
              </a>
            )}
          </div>
          <div className="user-history-container">
            <form
              className="card-body user-history"
              style={{
                width: "100%",
                alignContent: "center",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1 className="py-2" style={{ textAlign: "center" }}>
                Edit Profile
              </h1>
              <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                <div className="col-sm-12 row justify-content-center mb-3">
                  <div className="form-group">
                    <OverlayTrigger
                      trigger="focus"
                      placement="top"
                      overlay={popoverUsername}
                    >
                      <input
                        className={`form-control ${
                          !username.isValid ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="Username"
                        id="name"
                        value={username.value}
                        onChange={(e) => {
                          handleInputChange();
                          handleUsernameChange(e);
                        }}
                        required
                        autoFocus
                      />
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="col-sm-12 row justify-content-center mb-3">
                  <div className="form-group">
                    <OverlayTrigger
                      trigger="focus"
                      placement="top"
                      overlay={popoverEmail}
                    >
                      <input
                        className={`form-control ${
                          !email.isValid ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="Email"
                        id="email"
                        value={email.value}
                        onChange={(e) => {
                          handleInputChange();
                          handleEmailChange(e);
                        }}
                        required
                      />
                    </OverlayTrigger>
                  </div>
                </div>
                <div className="col-sm-12 row justify-content-center mb-3">
                  <div className="form-group">
                    <OverlayTrigger
                      trigger="focus"
                      placement="top"
                      overlay={popoverPhoneNumber}
                    >
                      <input
                        className={`form-control ${
                          !phoneNumber.isValid ? "is-invalid" : ""
                        }`}
                        type="text"
                        placeholder="Phone Number"
                        id="phone-number"
                        value={phoneNumber.value}
                        onChange={(e) => {
                          handleInputChange();
                          handlePhoneNumberChange(e);
                        }}
                        required
                      />
                    </OverlayTrigger>
                  </div>
                </div>
                        <div style={{display:"flex", justifyContent:"space-around"}}>
                <button
                  className="btn btn-secondary btn-block confirm-button"
                  disabled={isEditing} // Disable button while editing
                  onClick={handleSubmit}
                >
                  {isEditing ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  className="btn btn-danger btn-block confirm-button"
                  onClick={handleDiscard}
                  >
                    Discard Changes
                </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
