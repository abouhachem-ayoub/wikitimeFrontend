import React from "react";
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
interface ViewAccountInfoProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

const ViewAccountInfo: React.FC<ViewAccountInfoProps> = ({ user, isOpen, onClose, }) => {
  if (!isOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Information</h2>
        <p>Email: {user?.email}</p>
        <p>First Name: {user?.firstName}</p>
        <p>Last Name: {user?.lastName}</p>
        <p>Pseudo: {user?.pseudo}</p>
        <p>Phone: {user?.phone}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewAccountInfo;