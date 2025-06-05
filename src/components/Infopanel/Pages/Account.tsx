import React, { useState ,useEffect} from 'react';
import Login from '../Account/Login';
import ProfilePage from '../Account/[user_id]/page';
import RegisterForm from '../Account/Register';
import { useUser } from 'contexts/UserContext';
import '../../../styles/infopanel.scss';

const Account: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(true);
  const { userId, setUserId } = useUser();

  const toggleForm = () => {
    setIsRegistering(!isRegistering);
  };
  const handleLoginSuccess = async (userId: string, token: string, user: string) => {
    await setUserId(userId); // Update the context
    await localStorage.setItem('userId', userId || '');
    await localStorage.setItem('token', token);
    await localStorage.setItem('user', user || 'nothing');
  };
  const logout = async () => {
    await localStorage.removeItem('token'); // Clear token
    setUserId(null); // Clear userId in context
    setIsRegistering(true);
    window.dispatchEvent(new Event('storage')); // Notify other tabs
  };
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token found, logging out...');
        logout();
        return;
      }
  
      try {
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'api/auth/decodetoken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }), // Send the token in the request body
        });
  
        const data = await response.json();
        if (!response.ok) {
          console.log('Token validation failed, logging out...');
          logout();
        } else {
          console.log('Token validation successful:', data);
        }
      } catch (error) {
        console.error('Error validating token:', error);
        logout();
      }
    };
  
    if (userId) {
      checkToken();
    }
  }, [userId]);
  return (
    <div>
      {!userId && (
        <div>
          <button onClick={toggleForm}>Login</button>
          <button onClick={toggleForm}>Sign-Up</button>
        </div>
      )}
      {!userId && (isRegistering ? <Login /> : <RegisterForm toggleForm={toggleForm} onLoginSuccess={handleLoginSuccess} />)}
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