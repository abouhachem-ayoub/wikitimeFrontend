import React, { useState } from "react";
import PhoneInput from "react-phone-input-2";
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
}

const EditInfoModal = ({ isOpen, onClose,user }:EditInfoModalProps) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName|| "",
    pseudo: user?.pseudo || "",
    phone: user?.phone || "",
  });
  const [phone,setPhone] = useState(user?.phone || '');
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/edituserinfo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      alert("Your information has been updated.");
      onClose();
    } catch (error: any) {
      alert(error.message || "An error occurred while updating your information.");
    }
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
                country={'us'}
                value={user?.phone}
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