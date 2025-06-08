import React from "react";

interface ViewAccountInfoProps {
  isOpen: boolean;
  onClose: () => void;
}

const ViewAccountInfo: React.FC<ViewAccountInfoProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Information</h2>
        <p>Email: {user.email}</p>
        <p>First Name: {user.firstName}</p>
        <p>Last Name: {user.lastName}</p>
        <p>Pseudo: {user.pseudo}</p>
        <p>Phone: {user.phone}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewAccountInfo;