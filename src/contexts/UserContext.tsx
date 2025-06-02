import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext<{
  userId: string | null;
  setUserId: (id: string | null) => void;
}>({ userId: null, setUserId: () => {} });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(() => {
    // Load userId from localStorage on initialization
    return localStorage.getItem('userId');
  });

  useEffect(() => {
    // Save userId to localStorage whenever it changes
    if (userId) {
      localStorage.setItem('userId', userId);
    } else {
      localStorage.removeItem('userId');
    }
  }, [userId]);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);