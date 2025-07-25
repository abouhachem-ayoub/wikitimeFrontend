import React, { useState } from "react";
import {FiEye, FiEyeOff} from "react-icons/fi";
import { useUser } from "contexts/UserContext";
import { updatePassword } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { get } from "lodash";
import toast,{ Toaster } from "react-hot-toast";
interface SetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess :() => void; // Optional callback for success
}

const SetPasswordModal: React.FC<SetPasswordModalProps> = ({ isOpen, onClose, onSuccess}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const[type, setType] = useState("password");
  const[type2, setType2] = useState("password");
  const debug_mode = import.meta.env.VITE_DEBUG_MODE; // Check if debug mode is enabled
  const { userId } = useUser();
  const auth=getAuth();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!password || password.trim() === "") {
      toast.error("Please enter a password.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (confirmPassword.length < 8) {
      toast.error("Confirmation password must be at least 8 characters long.");
      return;
    }
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/setpassword", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password:password, userId:userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to set password");
      }
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No user is currently logged in.");
      }
      await updatePassword(user, password);
      toast.success("Password set successfully.");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || "An error occurred while setting your password.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Toaster />
      <div className="modal-content">
      {debug_mode === "true" && (<p>Set Password Modal from user_id/components/setPasswordModal.tsx</p>)}

        <h2>Set Your Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex">
          <input
            required
            type={type}
            placeholder="Enter new password"
            value={password}
            minLength={8}
            onChange={(e) => setPassword(e.target.value)}
          />
          {showPassword ? (
            <FiEye
              className="custom-class2"
              onClick={() => {
                setShowPassword(false);
                setType("password");
              }}
            />
          ) : (
            <FiEyeOff
              className="custom-class2"
              onClick={() => {
                setShowPassword(true);
                setType("text");
              }}
            />
          )}
          </div>
          <div className="mb-4 flex">
            <input
            required
            type={type2}
            minLength={8}
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {showConfirmPassword ? (
            <FiEye
              className="custom-class2"
              onClick={() => {
                setShowConfirmPassword(false);
                setType2("password");
              }}
            />
          ) : (
            <FiEyeOff
              className="custom-class2"
              onClick={() => {
                setShowConfirmPassword(true);
                setType2("text");
              }}
            />
          )}
          </div>
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