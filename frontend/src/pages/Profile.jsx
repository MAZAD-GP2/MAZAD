import React, { useState } from "react";
import * as api from "../api/index";
import Dropzone from "react-dropzone";

const Profile = () => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem("user")));

  const handleProfilePictureUpload = async (acceptedFiles) => {
    // Handle profile picture upload
    const file = acceptedFiles[0];
    try {
      const formData = new FormData();
      formData.append("profilePicture", file);
      // Call API to upload profile picture
      const response = await api.uploadProfilePicture(formData);
      // Update user object with new profile picture URL
      setUser({ ...user, profilePicture: response.data.profilePicture });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        {/* Profile Picture Container */}
        <Dropzone onDrop={handleProfilePictureUpload}>
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()} className="profile-picture-container">
              {user && user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" />
              ) : (
                <div className="default-profile-picture">
                  Upload a Profile Picture
                </div>
              )}
              <input {...getInputProps()} />
            </div>
          )}
        </Dropzone>

        {/* User Details */}
        <div className="user-details">
          <p>
            <strong>Name:</strong> {user && user.username}
          </p>
          <p>
            <strong>Email:</strong> {user && user.email}
          </p>
          <p>
            <strong>Admin:</strong> {user && user.isAdmin ? "Yes" : "No"}
          </p>
          <p>
            <strong>Phone Number:</strong> {user && user.phoneNumber}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
