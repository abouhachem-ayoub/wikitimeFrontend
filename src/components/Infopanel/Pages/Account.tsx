import React, { useState, useEffect } from 'react';
import Login from '../Account/Login';
import ProfilePage from '../Account/[user_id]/page';
import RegisterForm from '../Account/Register';
import { useUser } from 'contexts/UserContext';
  const Account: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  //const [userId,setUserId] = useState('');
  //const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [userId, setUserId] = useState<string | null>(null);
  const user = useUser();
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };
  useEffect(() => {
    if (user && user.userId) {
      setUserId(user.userId);
      console.log(user);
      console.log(user.userId);
    } else {
      setUserId(null);
    }
  }, [user]);
/*
  const getUserId = async () => {
    if (token) {
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + "api/auth/decodetoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });
  
        const data = await response.json();
        if (!response.ok) {
          console.error("Error decoding token:", data.message);
          setUserId('');
        } else {
          console.log("Decoded user ID:", data.user_id);
          setUserId(data.user_id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
      }
    } else {
    }
  };
    
useEffect(() => {
    getUserId();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
      if (newToken) {
        getUserId(); // Ensure userId is updated immediately
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);


*/
//logout to be changed if the context idea works
  const logout = async()=>{
    await localStorage.removeItem('token');
    setUserId(null);
    window.dispatchEvent(new Event("storage"));
  }
 
  return (
    <div>
      {!userId && (<div><button onClick={toggleForm}>Login</button>
        <button onClick={toggleForm}>Sign-Up</button></div>)}
      {!userId && (isRegistering ? <Login />:<RegisterForm toggleForm = {toggleForm}/>)}
      {userId &&
      (<div>
        <button onClick={logout}>Sign out</button>
        <ProfilePage params={{ user_id: userId }} />
        </div>
      )  
      }
    </div>
  );
};

export default Account;