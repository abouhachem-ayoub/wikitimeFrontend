import React,{useState,useEffect} from "react";
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
  const [userInfo, setUserInfo] = useState<User | null>(null);

  // Update userInfo whenever the user prop or its attributes change

  if (!isOpen) return null;


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Account Information</h2>
        <p>Email: {userInfo?.email}</p>
        <p>First Name: {userInfo?.firstName}</p>
        <p>Last Name: {userInfo?.lastName}</p>
        <p>Pseudo: {userInfo?.pseudo}</p>
        <p>Phone: {"+"+userInfo?.phone}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ViewAccountInfo;