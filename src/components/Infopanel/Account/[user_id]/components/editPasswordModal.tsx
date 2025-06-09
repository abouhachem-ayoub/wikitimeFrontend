import React, { useState } from "react";
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
          <input
            type="password"
            placeholder="Enter current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={newPassword2}
            onChange={(e) => setNewPassword2(e.target.value)}
          />
          <button type="submit">Update Password</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
