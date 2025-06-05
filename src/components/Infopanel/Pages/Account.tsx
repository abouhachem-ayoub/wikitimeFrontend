import React, { useState ,useEffect} from 'react';
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
        // No token found, log the user out
        logout();
        return;
      }

      try {
        // Decode or validate the token (e.g., using a backend API or JWT library)
        const response = await fetch(import.meta.env.VITE_API_BASE_URL + 'api/auth/decodetoken', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          // Token is invalid or expired
          logout();
          
        }
      } catch (error) {
        console.error('Error validating token:', error);
        logout();
      }
    };

    checkToken();
  }, []);

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