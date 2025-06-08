import React, { useState } from "react";
import { FiUser } from "react-icons/fi";

interface ProfileDropdownProps {
  onViewInfo: () => void;
  onSetPassword: () => void;
  onEditPassword: () => void;
  onDelete: () => void;
  onSignOut: () => void;
  onEditInfo: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
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
          <li onClick={onSetPassword}>Set Your Password</li>
          <li onClick={onEditPassword}>Edit Your Password</li>
          <li onClick={onDelete}>Delete Your Account</li>
          <li onClick ={onEditInfo} >Edit you account info</li>
          <li onClick={onSignOut}>Sign Out</li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;