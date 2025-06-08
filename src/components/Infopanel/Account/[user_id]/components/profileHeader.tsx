import {useEffect} from "react";
import { useUser } from "contexts/UserContext";

type User = {
  pseudo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified?: string | null;
  id: string;
  password?: string | null; // Optional field for password
};
type ProfileHeaderProps = {
  user: User | null;
};

const ProfileHeader = ({ user }: ProfileHeaderProps) =>
{  const { userId,setUserId } = useUser();
useEffect(() => {
  if (userId) {
    setUserId(userId);
  }
}, [userId]);
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