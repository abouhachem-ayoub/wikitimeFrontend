import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
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
interface ProfileDropdownProps {
  onViewInfo: () => void;
  onSetPassword: () => void;
  onEditPassword: () => void;
  onDelete: () => void;
  onSignOut: () => void;
  onEditInfo: () => void;
  user?: User | null;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  user,
  onViewInfo,
  onSetPassword,
  onEditPassword,
  onDelete,
  onSignOut,
  onEditInfo
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasPassword, setHasPassword] = useState(user?.password ? true:false); // State to track if the user has a password
  useEffect(() => {
    if (user?.password) {
      setHasPassword(true); // Update state when the password is set
    }
  }, [user?.password,isOpen]);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".profile-dropdown")) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);


  return (
    <div className="profile-dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        <FiUser className="icon" />
        <span className="username">Profile</span>
        <span className="caret">{isOpen ? "▲" : "▼"}</span>
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={onViewInfo}>View Account Info</li>
          {!hasPassword &&<li onClick={onSetPassword}>Set Your Password</li>}
          {hasPassword && <li onClick={onEditPassword}>Edit Your Password</li>}
          <li onClick={onDelete}>Delete Your Account</li>
          <li onClick ={onEditInfo} >Edit you account info</li>
          <li onClick={onSignOut}>Sign Out</li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;