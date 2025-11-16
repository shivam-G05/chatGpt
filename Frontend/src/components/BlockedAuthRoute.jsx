// import { Navigate } from "react-router-dom";
// import { isLoggedIn } from "../utils/auth";

// const BlockAuthRoute = ({ children }) => {
//   if (isLoggedIn()) {
//     alert("You are already logged in!");
//     return <Navigate to="/" replace />; // redirect to your dashboard/home page
//   }
//   return children;
// };

// export default BlockAuthRoute;



import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/authContextValue";

/**
 * BlockedAuthRoute prevents authenticated users from accessing
 * login/register pages. If already logged in, redirects to chat.
 */
const BlockedAuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <p>Loading...</p>
      </div>
    );
  }

  // If authenticated, redirect to chat
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, allow access to login/register
  return children;
};

export default BlockedAuthRoute;