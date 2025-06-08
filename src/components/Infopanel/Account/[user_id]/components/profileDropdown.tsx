import React, { useState } from "react";
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
          {!user?.password &&<li onClick={onSetPassword}>Set Your Password</li>}
          {user?.password && <li onClick={onEditPassword}>Edit Your Password</li>}
          <li onClick={onDelete}>Delete Your Account</li>
          <li onClick ={onEditInfo} >Edit you account info</li>
          <li onClick={onSignOut}>Sign Out</li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;