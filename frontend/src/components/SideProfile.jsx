import React, { useRef } from "react";
import "../assets/css/profile.css";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";
import * as api from "../api/index";

const SideProfile = ({ user, isCurrentUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();
  const fileInputRef = useRef(null);

  const handleProfilePic = async (event) => {
    if (location.pathname.includes("/edit-profile")) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const profilePicture = event.target.files[0];
    const formData = new FormData();
    formData.append("profilePicture", profilePicture);
    formData.append("username", user.username);
    formData.append("phoneNumber", user.phoneNumber);
    formData.append("email", user.email);
    try {
      const updatedUser = await api.userUpdate(formData); 
      sessionStorage.setItem("user", JSON.stringify(updatedUser.data));
      enqueueSnackbar("Changes Saved Successfully", { variant: "success" });
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (error) {
      enqueueSnackbar("Failed to update profile picture", { variant: "error" });
    }
  };

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

  return (
    <div className="user-cred">
      <img
        src={
          user.profilePicture
            ? user.profilePicture
            : "https://media.istockphoto.com/id/1288129985/vector/missing-image-of-a-person-placeholder.jpg?s=612x612&w=0&k=20&c=9kE777krx5mrFHsxx02v60ideRWvIgI1RWzR1X4MG2Y="
        }
        className={
          "profile-pic " +
          (location.pathname === "/edit-profile" ? "profile-pic-hover" : "")
        }
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
      <h3 className="profile-username">{user.username}</h3>
      {user.isAdmin && <p className="admin-tag">Admin</p>}
      <p className="profile-info">{user.email}</p>
      <p className="profile-info">{user.phoneNumber}</p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
        }}
      >
        {isCurrentUser && location.pathname.includes("/profile") && (
          <a
            className="edit-profile btn btn-secondary align-self-center"
            href="/edit-profile"
          >
            Edit Profile
          </a>
        )}
        {isCurrentUser && location.pathname.includes("/edit-profile") && (
          <a
            className="edit-profile btn btn-secondary align-self-center"
            href="/profile"
          >
            Profile
          </a>
        )}
        {isCurrentUser && (
          <a
            className="edit-profile btn btn-danger align-self-center"
            onClick={handleSignOut}
          >
            Sign Out
          </a>
        )}
      </div>
    </div>
  );
};
export default SideProfile;
