import React from "react";
import { useUser } from "contexts/UserContext";

const ProfileHeader = () => {
  const { userId } = useUser();

  return (
    <div className="profile-header">
      <img
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${userId || "Guest"}`}
        alt="Profile"
        className="profile-image"
      />
      <h2 className="profile-name">{userId ? `Welcome, ${userId}` : "Welcome, Guest"}</h2>
    </div>
  );
};

export default ProfileHeader;