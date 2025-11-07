import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import ProfileCard from "../components/ProfileCrad";
import "./Settings.css";

const Settings = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="settings-page">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="settings-content">
        <header className="settings-header">
          <h1>User Settings</h1>
        </header>

        <section className="settings-main">
          <ProfileCard />
        </section>
      </div>
    </div>
  );
};

export default Settings;
