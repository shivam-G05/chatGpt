import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

const BlockAuthRoute = ({ children }) => {
  if (isLoggedIn()) {
    alert("You are already logged in!");
    return <Navigate to="/" replace />; // redirect to your dashboard/home page
  }
  return children;
};

export default BlockAuthRoute;