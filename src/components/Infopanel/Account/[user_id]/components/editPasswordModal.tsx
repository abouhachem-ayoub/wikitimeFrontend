import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
type User = {
  pseudo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified?: string | null;
  id: string;
};
interface EditPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null; // Optional user prop
}

export const EditPasswordModal: React.FC<EditPasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [showPassword3, setShowPassword3] = useState(false);
  const [type, setType] = useState("password");
  const [type2, setType2] = useState("password");
  const [type3, setType3] = useState("password");


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!currentPassword || !newPassword || !newPassword2) {
      alert("Please fill in all fields.");
      return;
    }
    if (newPassword !== newPassword2) {
      alert("New passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      alert("New password must be at least 8 characters long.");
      return;
    }
    if (currentPassword === newPassword) {
      alert("New password cannot be the same as the current password.");
      return;
    }
    if (newPassword !== newPassword2) {
      alert("New password and confirmation do not match.");
      return;
    }
    if (newPassword2.length < 8) {
      alert("Confirmation password must be at least 8 characters long.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/editpassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        throw new Error("Failed to update password");
      }

      alert("Password updated successfully.");
      onClose();
    } catch (error: any) {
      alert(error.message || "An error occurred while updating your password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
          <input
            type={type}
            required
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          {            showPassword ? (
            <FiEye
              className="password-icon"
              onClick={() => {
                setShowPassword(false);
                setType("password");
              }}
            />
          ) : (
            <FiEyeOff
              className="password-icon"
              onClick={() => {
                setShowPassword(true);
                setType("text");
              }}
            />
          )}
        
          </div>
          <div>
          <input
            type={type2}
            required
            minLength={8}
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          {            showPassword2 ? (
            <FiEye
              className="password-icon"
              onClick={() => {
                setShowPassword2(false);
                setType2("password");
              }}
            />
          ) : (
            <FiEyeOff
              className="password-icon"
              onClick={() => {
                setShowPassword2(true);
                setType2("text");
              }}
            />
          )}
          </div>
          <div>
          <input
            type={type3}
            required
            minLength={8}
            placeholder="Confirm new password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
          {            showPassword3 ? (
            <FiEye
              className="password-icon"
              onClick={() => {
                setShowPassword3(false);
                setType3("password");
              }}
            />
          ) : (
            <FiEyeOff
              className="password-icon"
              onClick={() => {
                setShowPassword3(true);
                setType3("text");
              }}
            />
          )}
          </div>
          <button type="submit">Update Password</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
