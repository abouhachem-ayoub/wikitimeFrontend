import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
interface ProfileDropdownProps {
  onViewInfo: () => void;
  onSetPassword: () => void;
  onEditPassword: () => void;
  onDelete: () => void;
  onSignOut: () => void;
  onEditInfo: () => void;
  hasPassword?: boolean;
  onVerifyEmail: () => void;
  emailVerified?: string | null;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({
  hasPassword,
  onViewInfo,
  onSetPassword,
  onEditPassword,
  onDelete,
  onSignOut,
  onEditInfo,
  onVerifyEmail,
  emailVerified
}) => {
  const [isOpen, setIsOpen] = useState(false);

  
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
          {emailVerified === null ? (
            <ul>
            <li className="disabled">Your Email Is Not Verified</li>
            <li onClick={onVerifyEmail}>Click To Receive Verification Email</li>
            </ul>
          ) : (
            <>
              <li onClick={onViewInfo}>View Account Info</li>
              {!hasPassword && <li onClick={onSetPassword}>Set Your Password</li>}
              {hasPassword && <li onClick={onEditPassword}>Edit Your Password</li>}
              <li onClick={onDelete}>Delete Your Account</li>
              <li onClick={onEditInfo}>Edit Your Account Info</li>
              <li onClick={onSignOut}>Sign Out</li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;