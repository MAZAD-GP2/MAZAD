import React from "react";
import "../assets/css/profile.css";
import { useSnackbar } from "notistack";
import { useLocation } from "react-router-dom";

const SideProfile = ({ user, isCurrentUser }) => {
  const { enqueueSnackbar } = useSnackbar();
  const location = useLocation();

  const handleSignOut = async (event) => {
    try {
      sessionStorage.clear();
      enqueueSnackbar("Singed out", { variant: "success" });
      setTimeout(() => {
        window.location.href = "/";
      }, 300);
    } catch (err) {
      enqueueSnackbar(err.response.data.message, { variant: "error" });
    }
  };
  return (
    <div className="user-cred">
      <img src={user.profilePicture} className="profile-pic" />
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
        {isCurrentUser && location.pathname.includes("/profile") &&(<a
            className="edit-profile btn btn-secondary align-self-center"
            href="/edit-profile"
          >
            Edit Profile
          </a>)} {isCurrentUser && location.pathname.includes("/edit-profile")&& (
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
