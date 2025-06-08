import React from "react";
import { useUser } from "contexts/UserContext";
type User = {
  pseudo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified?: string | null;
  id: string;
};
interface ProfileHeaderProps {
  user: User;
}

const ProfileHeader :React.FC<ProfileHeaderProps>=({user}) => {
  const { userId } = useUser();
  return (
    <div className="profile-header">
      <img
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.pseudo || "Guest"}`}
        alt="Profile"
        className="profile-image"
      />
      <h2 className="profile-name">{userId ? `Welcome, ${userId}` : "Welcome, Guest"}</h2>
    </div>
  );
};

export default ProfileHeader;