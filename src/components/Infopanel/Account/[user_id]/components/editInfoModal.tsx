import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import { useUser } from "contexts/UserContext";
import { use } from "i18next";

type User = {
  pseudo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified?: string | null;
  id: string;
};

interface EditInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null; // Optional user prop
  onSave: (updatedUserInfo: Partial<User>) => void; // Callback to save changes
}

const EditInfoModal: React.FC<EditInfoModalProps> = ({ isOpen, onClose, user, onSave }) => {
  const { userId } = useUser();
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName || "",
    pseudo: user?.pseudo || "",
    phone: user?.phone || "",
  });

  const [phone, setPhone] = useState("");

  // Update formData when the modal is opened or the user prop changes
  useEffect(() => {
    if (isOpen && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        pseudo: user.pseudo || "",
        phone: user.phone || "",
      });
      setPhone(user.phone || "");
      localStorage.setItem("userINFfromedit", JSON.stringify(user)); // Store user info in localStorage
    }
  }, [isOpen, user]);

  const handlePhoneChange = (value: string) => {
    setPhone(value); // Update the phone state
    setFormData((prevFormData) => ({
      ...prevFormData,
      phone: value, // Use the value directly from the onChange handler
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Pass the updated data to the parent
    onClose(); // Close the modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Edit Your Info</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="pseudo"
            placeholder="Pseudo"
            value={formData.pseudo}
            onChange={handleInputChange}
          />
          <PhoneInput
            enableSearch={true}
            country={"us"}
            value={formData.phone}
            onChange={handlePhoneChange}
          />
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditInfoModal;