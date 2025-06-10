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
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");

    if (action === "verifyEmail") {
      alert("Your email has been successfully verified!");
      window.location.href = '/';
    }
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
            <li><a href = '#' className="disabled">Your Email Is Not Verified</a></li>
            <li><a href = '#' onClick={onVerifyEmail}>Click To Receive Verification Email</a></li>
            </ul>
          ) : (
            <>
              <li><a href = '#' onClick={onViewInfo}>View Account Info</a></li>
              {!hasPassword && <li><a href = '#' onClick={onSetPassword}>Set Your Password</a></li>}
              {hasPassword && <li><a href = '#' onClick={onEditPassword}>Edit Your Password</a></li>}
              <li><a href = '#' onClick={onDelete}>Delete Your Account</a></li>
              <li><a href = '#' onClick={onEditInfo}>Edit Your Account Info</a></li>
              <li><a href = '#' onClick={onSignOut}>Sign Out</a></li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;