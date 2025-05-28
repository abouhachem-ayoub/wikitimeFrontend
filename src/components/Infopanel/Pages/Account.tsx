import React, { useState, useEffect } from 'react';
import Login from '../Account/Login';
import ProfilePage from '../Account/[user_id]/page';
import RegisterForm from '../Account/Register';

  const Account: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [userId, setUserId] = useState<string>('');
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [login,setlogin] = useState<boolean>(true);
  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };
  const getUserId = async () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL+"/api/auth/decodetoken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        if (!response.ok) {
          setUserId('');
        } else {
          setUserId(data.user_id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setUserId('');
      }
    } else {
      setUserId('');
    }
  };

  useEffect(() => {

    getUserId();
  }, [token]);

  useEffect(() => {
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token");
      setToken(newToken);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const togglelogin = () =>{
    setlogin(!login);
  }

  const logout = async()=>{
    await localStorage.removeItem('token');
    window.dispatchEvent(new Event("storage"));
  }

  return (
    <div>
      {!userId && (<div><button onClick={toggleForm}>Login</button>
        <button onClick={toggleForm}>Sign-Up</button></div>)}
      {!userId ? (isRegistering ? <Login />:<RegisterForm toggleForm = {toggleForm}/>) : 
      <div>
        <button onClick={logout}>Sign out</button>
        <ProfilePage params={{ user_id: userId }} />
        </div>}
    </div>
  );
};

export default Account;