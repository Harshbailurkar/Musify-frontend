import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import SideBar from "./SideBar";
import MusicPlayer from "./MusicPlayer/index"; // Adjust the import path as necessary
import { Outlet } from "react-router-dom";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("isSidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  const loggedIn = localStorage.getItem("loggedIn");

  useEffect(() => {
    localStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 overflow-hidden">
        <SideBar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-4 overflow-y-auto ${
            isCollapsed ? "ml-28" : "ml-64"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <footer
        className={`flex-1 p-4 pb-0 pl-1 pr-0 mb-20 overflow-y-auto ${
          isCollapsed ? "ml-28" : "ml-64"
        }`}
      >
        <Footer />
      </footer>
      {
        /* Music Player fixed at the bottom */
        loggedIn && (
          <div
            className={`fixed bottom-0 w-[full-64] ${
              isCollapsed ? "ml-28" : "ml-64"
            }`}
          >
            <MusicPlayer />
          </div>
        )
      }
    </div>
  );
};

export default Layout;
