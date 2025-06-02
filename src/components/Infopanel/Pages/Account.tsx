import React, { useState } from 'react';
import Login from '../Account/Login';
import ProfilePage from '../Account/[user_id]/page';
import RegisterForm from '../Account/Register';
import { useUser } from 'contexts/UserContext';

const Account: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const { userId, setUserId } = useUser();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };

  const logout = async () => {
    await localStorage.removeItem('token'); // Clear token
    setUserId(null); // Clear userId in context
    window.dispatchEvent(new Event('storage')); // Notify other tabs
  };

  return (
    <div>
      {!userId && (
        <div>
          <button onClick={toggleForm}>Login</button>
          <button onClick={toggleForm}>Sign-Up</button>
        </div>
      )}
      {!userId && (isRegistering ? <Login /> : <RegisterForm toggleForm={toggleForm} />)}
      {userId && (
        <div>
          <button onClick={logout}>Sign out</button>
          <ProfilePage params={{ user_id: userId }} />
        </div>
      )}
    </div>
  );
};

export default Account;