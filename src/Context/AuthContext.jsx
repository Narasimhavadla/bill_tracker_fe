// Context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // In a real app, 'user' would come from your Login API response
  const [user, setUser] = useState({
    name: "user",
    permissions: {
      canBill: true,
      canPick: false,
      canVerify: false
    }
  });



  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);