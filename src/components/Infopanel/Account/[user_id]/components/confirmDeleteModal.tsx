import React, { useState } from "react";
import '../../../../../styles/infopanel.scss'; // Adjust the path as necessary
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm}) => {
  const [password, setPassword] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal title">Confirm Account Deletion</h2>
        <p className="modal-description">
          Please enter your password to confirm account deletion. This action cannot be undone.
        </p>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <div className="fmodal-actions">
          <button
            onClick={onClose}
            className="modal-button cancel-button"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(password)}
            className="modal-button delete-button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;