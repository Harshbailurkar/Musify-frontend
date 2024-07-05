// Layout.jsx

import React, { useState, useEffect } from "react";
import Footer from "./Footer";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  // Retrieve the initial collapsed state from localStorage or default to false
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const savedState = localStorage.getItem("isSidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;
  });

  // Save the collapsed state to localStorage whenever it changes
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
          className={`flex-1 p-4  overflow-y-auto ${
            isCollapsed ? "ml-28" : "ml-64"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <footer
        className={`flex-1 p-4 pb-0 pl-1 pr-0 overflow-y-auto ${
          isCollapsed ? "ml-28" : "ml-64"
        }`}
      >
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
