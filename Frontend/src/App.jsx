import './App.css'
import AppRoutes from './AppRoutes.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
function App() {
  

  return (
    <>
    <ChatProvider>
      <AppRoutes></AppRoutes>
    </ChatProvider>
      
    </>
  )
}

export default App
