import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ✅ Check if user is authenticated
  const checkAuth = useCallback(async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }

      const response = await axios.get(
        "https://chatgpt-iet7.onrender.com/api/auth/verify",
        { withCredentials: true }
      );

      if (response.data.valid === "true") {
        setIsAuthenticated(true);
        // Optionally fetch user details
        try {
          const userRes = await axios.get(
            "https://chatgpt-iet7.onrender.com/api/auth/me",
            { withCredentials: true }
          );
          setUser(userRes.data);
        } catch (err) {
          console.log("Could not fetch user details");
        }
        setLoading(false);
        return true;
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        return false;
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(null);
      setLoading(false);
      return false;
    }
  }, []);

  // ✅ Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Login function
  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post(
        "https://chatgpt-iet7.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );
      
      if (response.data.token) {
        Cookies.set("token", response.data.token);
        await checkAuth();
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.response?.data?.message || "Login failed" };
    }
  }, [checkAuth]);

  // ✅ Logout function
  const logout = useCallback(() => {
    Cookies.remove("token");
    localStorage.clear();
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};