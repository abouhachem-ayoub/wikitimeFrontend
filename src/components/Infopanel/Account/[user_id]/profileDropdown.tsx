import React, { useState } from "react";

interface ProfileDropdownProps {
  onViewInfo: () => void;
  onSetPassword: () => void;
  onEditPassword: () => void;
  onDelete: () => void;
  onSignOut: () => void;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  onViewInfo,
  onSetPassword,
  onEditPassword,
  onDelete,
  onSignOut,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="profile-dropdown">
      <button onClick={() => setIsOpen(!isOpen)} className="dropdown-button">
        Menu
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          <li onClick={onViewInfo}>View Account Info</li>
          <li onClick={onSetPassword}>Set Your Password</li>
          <li onClick={onEditPassword}>Edit Your Password</li>
          <li onClick={onDelete}>Delete Your Account</li>
          <li onClick={onSignOut}>Sign Out</li>
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;