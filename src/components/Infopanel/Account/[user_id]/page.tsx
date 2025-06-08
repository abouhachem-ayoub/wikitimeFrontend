import  { useEffect, useState } from "react";
import ProfileHeader from "./components/profileHeader";
import ProfileDropdown from "./components/profileDropdown";
import ViewAccountInfo from "./components/viewAccountInfo";
import EditInfoModal from "./components/editInfoModal";
import SetPasswordModal from "./components/setPasswordModal";
import {EditPasswordModal} from "./components/editPasswordModal";
import ConfirmDeleteModal from "./components/confirmDeleteModal";
import { useUser } from "contexts/UserContext";
import { userInfo } from "os";



const ProfilePage = () => {
  const { userId, setUserId } = useUser();
  const [isViewInfoOpen, setIsViewInfoOpen] = useState(false);
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
    const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("user");
    setUserId(null);
    window.location.href = "/"; // Redirect to login page
  };

  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL+"api/auth/getuserinfo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user info");
      }
  
      console.log("User Info:", data.user);
      return data.user;
    } catch (error: any) {
      console.error("Error fetching user info:", error.message);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserInfo(userId).then((userInfo) => {
        if (userInfo) {
          localStorage.setItem("userINFO", JSON.stringify(userInfo)); // Store user info in localStorage
          setUser(userInfo);
          setUserId(userInfo.id); // Update userId in context if needed
          console.log("Fetched User Info:", userInfo);
        }
      });
    } else {
      console.error("User ID is not set.");
    }
  }, [userId]);

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
      <ProfileHeader user = {user}/>
      <ProfileDropdown
        onViewInfo={() => setIsViewInfoOpen(true)}
        onSetPassword={() => setIsSetPasswordOpen(true)}
        onEditPassword={() => setIsEditPasswordOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        onSignOut={handleSignOut}
        onEditInfo={() => setIsEditInfoOpen(true)}
      />
      <ViewAccountInfo isOpen={isViewInfoOpen} onClose={() => setIsViewInfoOpen(false)} />
      <SetPasswordModal isOpen={isSetPasswordOpen} onClose={() => setIsSetPasswordOpen(false)} />
      <EditPasswordModal isOpen={isEditPasswordOpen} onClose={() => setIsEditPasswordOpen(false)} />
      <EditInfoModal isOpen={isEditInfoOpen} onClose={() => setIsEditInfoOpen(false)} />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteAccount}
      />
    </div>
  );
};

export default ProfilePage;