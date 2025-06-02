import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext<{
  userId: string | null;
  setUserId: (id: string | null) => void;
}>({ userId: null, setUserId: () => {} });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider value={{ userId, setUserId }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);