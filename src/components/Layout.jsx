import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import SideBar from "./SideBar";
import MusicPlayer from "./MusicPlayer/index"; // Adjust the import path as necessary
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";

const Layout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("isSidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem("isAuthenticated") === "true"
  );

  useEffect(() => {
    const authState = localStorage.getItem("isAuthenticated") === "true";
    setIsAuthenticated(authState);
  }, []);

  useEffect(() => {
    localStorage.setItem("isSidebarCollapsed", JSON.stringify(isCollapsed));
    window.dispatchEvent(new CustomEvent("isSidebarCollapsedChange"));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        <TopBar toggleSidebar={toggleSidebar} />
        <SideBar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
        <main
          className={`flex-1 p-4 overflow-y-auto ${
            isCollapsed ? "ml-0 md:ml-28" : "ml-0 md:ml-64"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <footer
        className={`flex-1 p-4 pb-0 pl-1 pr-0 ${
          isAuthenticated ? "mb-20" : "mb-0"
        } overflow-y-auto ${isCollapsed ? "ml-0 md:ml-28" : "ml-0 md:ml-64"}`}
      >
        <Footer />
      </footer>
      {
        /* Music Player fixed at the bottom */
        isAuthenticated && (
          <div
            className={`fixed bottom-0 w-[full-64] ${
              isCollapsed ? "ml-0 md:ml-28" : "ml-0 md:ml-64"
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
