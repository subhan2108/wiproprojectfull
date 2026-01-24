// context/AuthContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 🔄 Restore session (NO API CALL)
  useEffect(() => {
    console.log("🔁 AuthProvider mounted");

    const token = localStorage.getItem("access_token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // 🔐 LOGIN
  const login = async (credentials) => {
    const user = await authAPI.login(credentials);
    setUser(user);
    setIsAuthenticated(true);
    return { success: true };
  };

  // 📝 REGISTER
  const register = async (userData) => {
    const user = await authAPI.register(userData);
    setUser(user);
    setIsAuthenticated(true);
    return { success: true };
  };

  // 🚪 LOGOUT
  const logout = () => {
    authAPI.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
