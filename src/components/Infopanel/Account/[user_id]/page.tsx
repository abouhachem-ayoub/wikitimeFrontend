import React, { useState } from "react";
import ProfileHeader from "./profileHeader";
import ProfileDropdown from "./profileDropdown";
import ViewAccountInfo from "./viewAccountInfo";
import SetPasswordModal from "./setPasswordModal";
import EditPasswordModal from "./editPasswordModal";
import ConfirmDeleteModal from "../confirmDeleteModal";
import { useUser } from "contexts/UserContext";

const ProfilePage = () => {
  const { userId, setUserId } = useUser();
  const [isViewInfoOpen, setIsViewInfoOpen] = useState(false);
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("user");
    setUserId(null);
    window.location.href = "/"; // Redirect to login page
  };

  const handleDeleteAccount = async (password: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/deleteaccount", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to delete account");
      }

      alert("Your account has been deleted. You will be logged out.");
      handleSignOut();
    } catch (error: any) {
      alert(error.message || "An error occurred while deleting your account.");
    }
  };

  return (
    <div className="profile-page">
      <ProfileHeader />
      <ProfileDropdown
        onViewInfo={() => setIsViewInfoOpen(true)}
        onSetPassword={() => setIsSetPasswordOpen(true)}
        onEditPassword={() => setIsEditPasswordOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        onSignOut={handleSignOut}
      />
      <ViewAccountInfo isOpen={isViewInfoOpen} onClose={() => setIsViewInfoOpen(false)} />
      <SetPasswordModal isOpen={isSetPasswordOpen} onClose={() => setIsSetPasswordOpen(false)} />
      <EditPasswordModal isOpen={isEditPasswordOpen} onClose={() => setIsEditPasswordOpen(false)} />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfilePage;