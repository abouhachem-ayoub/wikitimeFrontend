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
type ProfileHeaderProps = {
  user: User | null;
};

const ProfileHeader = ({ user }: ProfileHeaderProps) =>
{  const { userId } = useUser();
  return (
    <div className="profile-header">
      <img
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.pseudo || "Guest"}`}
        alt="Profile"
        className="profile-image"
      />
      <h2 className="profile-name">{userId ? `Welcome, ${user?.pseudo}` : "Welcome, Guest"}</h2>
    </div>
  );
};

export default ProfileHeader;