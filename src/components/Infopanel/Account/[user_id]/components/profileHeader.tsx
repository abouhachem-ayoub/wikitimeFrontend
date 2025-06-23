import {useEffect,useState} from "react";
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

const ProfileHeader = ({ user }: ProfileHeaderProps) =>{  
  const { userId,setUserId } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const debug_mode = (import.meta.env.VITE_DEBUG_MODE).toLowerCase(); // Check if debug mode is enabled
  useEffect(() => {
    if (user) {
      setIsLoading(false); // Stop loading once user data is available
    }
  }, [user]);
  useEffect(() => {
  if (userId) {
    setUserId(userId);
  }
}, [userId,user,user?.id]);
  return (
    <div className="profile-header">
      {isLoading ? (
        <div className="loading-indicator">Loading...</div> // Show loading indicator
      ):( <div className="profile-header-content">
      {debug_mode === "true" && (<p>Profile Header from user_id/components/profileHeader.tsx</p>)}
      <img
        src={`https://api.dicebear.com/6.x/initials/svg?seed=${user?.pseudo || "Guest"}`}
        alt="Profile"
        className="profile-image"
      />
      <h2 className="profile-name">{userId ? `Welcome, ${user?.pseudo}` : "Welcome, Guest"}</h2>
      </div>
      )}
    </div>
  );
};

export default ProfileHeader;