import './App.css'
import AppRoutes from './AppRoutes.jsx'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ChatProvider } from "./context/ChatContext.jsx";
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
