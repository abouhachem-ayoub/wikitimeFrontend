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
    }
  }, []);
  const handleVerifyEmail = () => {
    if (emailVerified !== null) {
      alert("Your email is already verified!");
      return;
    }

    onVerifyEmail(); // Call the provided handler to send the verification email
  };


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
            <li>Your Email Is Not Verified</li>
            <li><button className="secondary-button" onClick={handleVerifyEmail}>Click To Receive Verification Email</button></li>
            <li><a href = '#' onClick={onSignOut}>Sign Out</a></li>
            </ul>
          ) : (
            <>
              <li><button className="secondary-button" onClick={onViewInfo}>View Account Info</button></li>
              {!hasPassword && <li><button className="secondary-button" onClick={onSetPassword}>Set Your Password</button></li>}
              {hasPassword && <li><button className="secondary-button" onClick={onEditPassword}>Edit Your Password</button></li>}
              <li><button className='secondary-button' onClick={onDelete}>Delete Your Account</button></li>
              <li><button className="secondary-button" onClick={onEditInfo}>Edit Your Account Info</button></li>
              <li><button className="secondary-button" onClick={onSignOut}>Sign Out</button></li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProfileDropdown;