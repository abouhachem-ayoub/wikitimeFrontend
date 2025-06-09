import  { useEffect, useState } from "react";
import ProfileHeader from "./components/profileHeader";
import ProfileDropdown from "./components/profileDropdown";
import ViewAccountInfo from "./components/viewAccountInfo";
import EditInfoModal from "./components/editInfoModal";
import SetPasswordModal from "./components/setPasswordModal";
import {EditPasswordModal} from "./components/editPasswordModal";
import ConfirmDeleteModal from "./components/confirmDeleteModal";
import { useUser } from "contexts/UserContext";
type ConfirmDeleteData =
  | { password: string } // When the user has a password
  | { pseudo: string; confirmPhrase: string }; // When the user does not have a password
type User = {
  pseudo: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  emailVerified?: string | null;
  id: string;
  password?: string | null; // Optional field for password
};

const ProfilePage = () => {
  const { userId, setUserId } = useUser();
  const [isViewInfoOpen, setIsViewInfoOpen] = useState(false);
  const [isSetPasswordOpen, setIsSetPasswordOpen] = useState(false);
  const [isEditPasswordOpen, setIsEditPasswordOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditInfoOpen, setIsEditInfoOpen] = useState(false);
  const [user, setUser] = useState<User|null>(null);
  const [hasPassword, setHasPassword] = useState(!!user?.password);
  const [lastEmailSentTime, setLastEmailSentTime] = useState<number | null>(null); // Track the last email sent time

   // Track if the user has a password
    const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userid");
    localStorage.removeItem("user");
    setUserId(null);
  };
  const handleVerifyEmail = async () => {
    const currentTime = Date.now();
    // Check if the cooldown period has elapsed
    if (lastEmailSentTime && currentTime - lastEmailSentTime < 5 * 60 * 1000) {
      const remainingTime = Math.ceil((5 * 60 * 1000 - (currentTime - lastEmailSentTime)) / 1000);
  alert(`Please wait ${remainingTime} seconds before sending another verification email.`);
  return;
}

try {
  const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/send_verification_email", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId: user?.id }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || "Failed to verify email");
  }

  alert("A verification email has been sent to your email address.");
  setLastEmailSentTime(currentTime); // Update the last email sent time
} catch (error: any) {
  alert(error.message || "An error occurred while verifying your email.");
}
};
  const handleSetPasswordSuccess = () => {
    setHasPassword(true);
  }
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
    const fetchAndSetUserInfo = async () => {
      if (userId) {
        try {
          const userInfo:User = await fetchUserInfo(userId); // Await the async function
          if (userInfo) {
            localStorage.setItem("userINFO", JSON.stringify(userInfo)); // Store user info in localStorage
            setUser(userInfo); // Update the user state
            console.log("Fetched User Info:", userInfo);
          }
        } catch (error) {
          console.error("Error fetching user info:", error);
        }
      } else {
        console.error("User ID is not set.");
      }
    };
  
    fetchAndSetUserInfo(); // Call the async function
  }, [userId]); // Dependency array ensures this runs when userId changes
  


  
  const handleEditUserInfo = async (updatedUserInfo: Partial<User>) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/edituserinfo", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...updatedUserInfo,userid:userId}),
      });

      if (!response.ok) {
        throw new Error("Failed to update user info");
      }

      const updatedUser: User = { 
        ...user!, 
        ...updatedUserInfo 
      }; // Ensure all required fields are present
      setUser(updatedUser); // Update the user state
      localStorage.setItem("userINFO", JSON.stringify(updatedUser)); // Update localStorage
      alert("Your information has been updated.");
    } catch (error: any) {
      alert(error.message || "An error occurred while updating your information.");
    }
  };
  const handleDeleteAccount = async (data:ConfirmDeleteData) => {
    if(data.hasOwnProperty("password")) {
      const { password } = data as { password: string };
      if (!password) {
        alert("Please enter your password to confirm account deletion.");
        return;
      }
    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }
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
    }}
    else {
      const { pseudo, confirmPhrase } = data as { pseudo: string; confirmPhrase: string };
      if (!pseudo || !confirmPhrase) {
        alert("Please enter your pseudo and the confirmation phrase to delete your account.");
        return;
      }
      if (pseudo !== user?.pseudo) {
        alert("Pseudo does not match. Please try again.");
        return;
      }
      if (confirmPhrase !== "delete my account") {
        alert("Confirmation phrase is incorrect. Please type 'delete my account' to confirm.");
        return;
      }
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/deleteaccount", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ pseudo, confirmPhrase }),
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
    }

  };

  return (
    <div className="profile-page">
      <ProfileHeader user = {user}/>
      <ProfileDropdown
        hasPassword={hasPassword}
        onViewInfo={() => setIsViewInfoOpen(true)}
        onSetPassword={() => setIsSetPasswordOpen(true)}
        onEditPassword={() => setIsEditPasswordOpen(true)}
        onDelete={() => setIsDeleteModalOpen(true)}
        onSignOut={handleSignOut}
        onEditInfo={() => setIsEditInfoOpen(true)}
        onVerifyEmail={handleVerifyEmail}
        emailVerified={user?.emailVerified}
      />
      <ViewAccountInfo user={user} isOpen={isViewInfoOpen} onClose={() => setIsViewInfoOpen(false)} />
      <SetPasswordModal isOpen={isSetPasswordOpen} onClose={() => setIsSetPasswordOpen(false)}  onSuccess={handleSetPasswordSuccess} />
      <EditPasswordModal isOpen={isEditPasswordOpen} onClose={() => setIsEditPasswordOpen(false)} />
      <EditInfoModal isOpen={isEditInfoOpen} onClose={() => setIsEditInfoOpen(false)} onSave={handleEditUserInfo} user={user} />
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={(data) => handleDeleteAccount(data as ConfirmDeleteData)}
        pseudo ={user?.pseudo || ""}
        hasPassword={hasPassword}
      />
    </div>
  );
};

export default ProfilePage;