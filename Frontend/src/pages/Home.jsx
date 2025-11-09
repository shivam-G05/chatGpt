import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "./Home.css";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 770);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // ✅ Auto-close/open based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 770 && isSidebarOpen) {
        setIsSidebarOpen(true);
      } else if (window.innerWidth > 770 && !isSidebarOpen) {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  return (
    <div className="home-container">
      

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div className={`chat-area-container ${isSidebarOpen ? "shifted" : ""}`}>
        <div className="main-container">
          <ChatArea />
        </div>
      </div>
    </div>
  );
};

export default Home;
