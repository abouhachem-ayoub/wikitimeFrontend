import React, { useState } from "react";

interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ isOpen, onClose }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!password || password.trim() === "") {
      alert("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    if (confirmPassword.length < 8) {
      alert("Confirmation password must be at least 8 characters long.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/setpassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }

      alert("Password set successfully.");
      onClose();
    } catch (error: any) {
      alert(error.message || "An error occurred while setting your password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Your Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            required
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
            <input
            required
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit">Set Password</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetPasswordModal;