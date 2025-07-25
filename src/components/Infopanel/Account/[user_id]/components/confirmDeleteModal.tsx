import React, { useState } from "react";
import '../../../../../styles/infopanel.scss'; // Adjust the path as necessary
import  toast,{Toaster}from 'react-hot-toast';
interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { password?: string; pseudo?: string; confirmPhrase?: string }) => void;
  hasPassword: boolean; // Indicates if the user has a password set
  pseudo: string; 
  onShowDeletePolicy?: () => void; // Optional callback to show the data deletion policy
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm,hasPassword,pseudo,onShowDeletePolicy}) => {
  const [password, setPassword] = useState("");
  const [typedPseudo, setTypedPseudo] = useState("");
  const [confirmationPhrase, setConfirmationPhrase] = useState("");
  const debug_mode = import.meta.env.VITE_DEBUG_MODE;
  localStorage.setItem('debug-mode',debug_mode); // Check if debug mode is enabled
  const handleConfirm = () => {
    if (hasPassword) {
      // Proceed with password confirmation
      onConfirm({ password });
    } else {
      // Check if the pseudo and confirmation phrase are correct
      if (typedPseudo === pseudo && confirmationPhrase.toLowerCase() === "delete my account") {
        onConfirm({ pseudo: typedPseudo, confirmPhrase: 'delete my account' });
      } else {
        toast.error("Please type your pseudo and the confirmation phrase correctly.");
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <Toaster/>
      <div className="modal-content">
      {debug_mode === "true" && (<p>Confirm Delete Modal from user_id/components/confirmDeleteModal.tsx</p>)}
        <h2 className="modal title">Confirm Account Deletion</h2>
        <p className="modal-description">
        {hasPassword
            ? "Please enter your password to confirm account deletion.Upon deleting your account, you can log back in for the next month, after a month passes, your account will be deleted permenantly."
            : "Please type your pseudo and the words 'delete my account' to confirm account deletion. Upon deleting your account, you can log back in for the next month, after a month passes, your account will be deleted permenantly.."}
            </p>
            {hasPassword ? (
          // Password confirmation form
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        ): (
          // Pseudo and confirmation phrase form
          <>
            <input
              type="text"
              placeholder="Enter your pseudo"
              value={typedPseudo}
              onChange={(e) => setTypedPseudo(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              placeholder="Type 'delete my account'"
              value={confirmationPhrase}
              onChange={(e) => setConfirmationPhrase(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </>
        )}
        <div className="fmodal-actions">
  <button
    onClick={onShowDeletePolicy}
    className="modal-button info-button"
    type="button"
  >
    View Data Deletion Policy
  </button>
  <button
    onClick={onClose}
    className="modal-button cancel-button"
  >
    Cancel
  </button>
  <button
    onClick={handleConfirm}
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