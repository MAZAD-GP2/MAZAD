import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "react-bootstrap";
import { OverlayTrigger, Popover } from "react-bootstrap";
import Navbar from "../components/Navbar";
import MobileNavbar from "../components/MobileNavbar";
import { useLocation } from "react-router-dom";

import { useSnackbar } from "notistack";
import * as api from "../api/index";
import "bootstrap";
import "../assets/css/profile.css";
import "/src/assets/css/auth.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const userData = sessionStorage.getItem("user");

  const [isEditing, setisEditing] = useState(false); // Track editing status
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const [username, setUsername] = useState({ value: "", isValid: true });
  const [phoneNumber, setPhoneNumber] = useState({ value: "", isValid: true });
  const [email, setEmail] = useState({ value: "", isValid: true });

  const [password, setPassword] = useState({ value: "", isValid: true });
  const [confirmPassword, setConfirmPassword] = useState({
    value: "",
    isValid: true,
  });

  const [showPassword, setShowPassword] = useState(false); // password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // confirm password visibility

  const fileInputRef = useRef(null); //profile pic file
  const [profilePicture, setProfilePicture] = useState("");
  const [selectedProfilePicture, setSelectedProfilePicture] = useState(null);

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
      <Popover.Body>Enter a Jordanian valid phone number</Popover.Body>
    </Popover>
  );

  const popoverEmail = (
    <Popover id="popover-basic">
      <Popover.Body>Enter a valid email address</Popover.Body>
    </Popover>
  );

  const popoverPassword = (
    <Popover id="popover-basic">
      <Popover.Body>
        <ul>
          <li>Use 8 to 64 characters</li>
          <li>Include at least 1 uppercase letter</li>
          <li>Include at least 1 lowercase letter</li>
          <li>Include at least 1 number</li>
        </ul>
      </Popover.Body>
    </Popover>
  );

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
      setProfilePicture(parsedUserData.profilePicture);
    }
  }, []);

  const handleInputChange = () => {
    setUsername({ ...username, isValid: true });
    setPhoneNumber({ ...phoneNumber, isValid: true });
    setEmail({ ...email, isValid: true });
    setPassword({ ...password, isValid: true });
    setConfirmPassword({ ...confirmPassword, isValid: true });
  };

  const handleProfilePic = async (event) => {
    fileInputRef.current.click();
  };
  const handleFileChange = async (event) => {
    const profilePicture = event.target.files[0];
    const selectedImage = event.target.files[0];
    setProfilePicture(profilePicture);
    setSelectedProfilePicture(selectedImage);
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

  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword({ value, isValid: true });
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword({ value, isValid: true });
  };

  const handleEdit = async (event) => {
    event.preventDefault();
    setisEditing(true);
    let success = true;

    if (
      !username.isValid ||
      !username.value ||
      username.value.length < 6 ||
      username.value.length > 20
    ) {
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
      setisEditing(false);
      return;
    }
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("username", username.value);
    formData.append("phoneNumber", phoneNumber.value);
    formData.append("email", email.value);
    await api
      .userUpdate(formData)
      .then((result) => {
        sessionStorage.setItem("user", JSON.stringify(result.data));
        enqueueSnackbar("Changes Saved Successfully", { variant: "success" });
        window.location.href = "/home";
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      })
      .finally(() => {
        setisEditing(false);
      });
  };

  const handleChangePassword = async (event) => {
    event.preventDefault();
    setIsChangingPassword(true); // Set registration status to true when registration button is clicked
    let success = true;

    const regex = /^(?=.*\d)(?=.*[a-zA-Z]).{8,}$/;
    if (!regex.test(password.value)) {
      enqueueSnackbar(
        "Password must contain at least 8 characters, including at least one letter and one number",
        { variant: "error", hideIconVariant: true }
      );
      setPassword({ ...password, isValid: false });
      setIsChangingPassword(false);
      return;
    }
    if (
      !confirmPassword.isValid ||
      !confirmPassword.value ||
      confirmPassword.value !== password.value
    ) {
      setConfirmPassword({ ...confirmPassword, isValid: false });
      success = false;
      enqueueSnackbar(
        "Password and Confirm Password don't match or are not valid",
        { variant: "error", hideIconVariant: true }
      );
    }

    if (!success) {
      setIsChangingPassword(false);
      return;
    }

    api
      .passwordUpdate({
        password: password.value,
        confirmPassword: confirmPassword.value,
      })
      .then((result) => {
        sessionStorage.setItem("user", JSON.stringify(result.data));
        enqueueSnackbar("Password Changed Successfully", {
          variant: "success",
        });
        setTimeout(() => {
          window.location.href = "/home";
        }, 500);
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      })
      .finally(() => {
        setIsChangingPassword(false);
      });
  };

  const handleCancel = async (event) => {
    event.preventDefault();
    enqueueSnackbar("Discarded Changes", {
      variant: "error",
    });
    setTimeout(() => {
      window.location.href = "/profile";
    }, 1000);
  };

  return (
    <>
      <Navbar />
      {user && (
        <>
          <div
            className="user-history-container"
            style={{ marginTop: "0px", paddingTop: "5px" }}
          >
            {/* <button
              className="btn border-secondary text-secondary btn-block confirm-button"
              onClick={() => window.location.href = "/profile"}
              style={{ alignSelf: "flex-start", margin: "5px", backgroundColor:"white" }}
            >
            &lt; Back
            </button>
             */}
            <div className="row">
              <div className="col-md-6">
                <h2 className="py-2" style={{ marginBottom: "0px" }}>
                  Edit Profile
                </h2>
                <form
                  className="user-history"
                  style={{
                    width: "100%",
                    alignContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "5px",
                    marginTop: "5px",
                  }}
                >
                  <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div
                        className="form-group"
                        style={{ width: "80%", position: "relative" }}
                      >
                        <span className="profile-pic-hover">
                          <img
                            src={
                              selectedProfilePicture
                                ? URL.createObjectURL(selectedProfilePicture)
                                : user.profilePicture
                                ? user.profilePicture
                                : "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="
                            }
                            className="profile-pic"
                            onClick={handleProfilePic}
                          />
                          <input
                            ref={fileInputRef}
                            type="file"
                            name="profilePicture"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                          />
                        </span>
                      </div>
                    </div>

                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div className="form-group" style={{ width: "80%" }}>
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
                            style={{ width: "100%" }}
                          />
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div className="form-group" style={{ width: "80%" }}>
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
                            style={{ width: "100%" }}
                          />
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div className="form-group" style={{ width: "80%" }}>
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
                            style={{ width: "100%" }}
                          />
                        </OverlayTrigger>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        className="btn btn-secondary text-white btn-block confirm-button"
                        disabled={isEditing}
                        onClick={handleEdit}
                        style={{
                          marginBottom: "10px",
                          width: "60%",
                          alignSelf: "center",
                        }}
                      >
                        {isEditing ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save Changes"
                        )}
                      </button>
                      <button
                        className="btn btn-danger btn-block confirm-button"
                        onClick={handleCancel}
                        style={{ width: "60%", alignSelf: "center" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <h2 className="py-2" style={{ marginBottom: "0px" }}>
                  Change Password
                </h2>
                <form
                  className="user-history"
                  style={{
                    width: "100%",
                    alignContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    marginBottom: "5px",
                    marginTop: "5px",
                  }}
                >
                  <div className="col-sm-12 col-md-12 col-lg-9 mx-auto">
                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div
                        className="form-group position-relative d-flex"
                        style={{ width: "80%" }}
                      >
                        <OverlayTrigger
                          className="overlay"
                          trigger="focus"
                          placement="top"
                          overlay={popoverPassword}
                        >
                          <input
                            className={`form-control ${
                              !password.isValid ? "is-invalid" : ""
                            }`}
                            type={showPassword ? "text" : "password"}
                            placeholder="New Password"
                            id="password"
                            value={password.value}
                            onChange={(e) => {
                              handleInputChange();
                              handlePasswordChange(e);
                            }}
                            required
                            style={{ width: "100%" }}
                          />
                        </OverlayTrigger>
                        <button
                          type="button"
                          className="btn btn-toggle-password position-absolute"
                          style={{ right: "10px", border: "0" }}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <FontAwesomeIcon
                            style={{ opacity: "0.7" }}
                            icon={
                              showPassword
                                ? "fa-regular fa-eye"
                                : "fa-regular fa-eye-slash"
                            }
                          />
                        </button>
                      </div>
                    </div>
                    <div className="col-sm-12 row justify-content-center mb-3">
                      <div
                        className="form-group position-relative d-flex"
                        style={{ width: "80%" }}
                      >
                        <input
                          className={`form-control ${
                            !confirmPassword.isValid ? "is-invalid" : ""
                          }`}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm New password"
                          id="confirm-password"
                          value={confirmPassword.value}
                          onChange={(e) => {
                            handleInputChange();
                            handleConfirmPasswordChange(e);
                          }}
                          required
                          style={{ width: "100%" }}
                        />
                        <button
                          type="button"
                          className="btn btn-toggle-password position-absolute"
                          style={{ right: "10px", border: "0" }}
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          <FontAwesomeIcon
                            style={{ opacity: "0.7" }}
                            icon={
                              showConfirmPassword
                                ? "fa-regular fa-eye"
                                : "fa-regular fa-eye-slash"
                            }
                          />
                        </button>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <button
                        className="btn btn-secondary text-white btn-block confirm-button"
                        disabled={isChangingPassword}
                        onClick={handleChangePassword}
                        style={{
                          marginBottom: "10px",
                          width: "60%",
                          alignSelf: "center",
                        }}
                      >
                        {isChangingPassword ? (
                          <Spinner animation="border" size="sm" />
                        ) : (
                          "Save Password"
                        )}
                      </button>
                      <button
                        className="btn btn-danger btn-block confirm-button"
                        onClick={handleCancel}
                        style={{ width: "60%", alignSelf: "center" }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
      <MobileNavbar />
    </>
  );
};

export default EditProfile;
