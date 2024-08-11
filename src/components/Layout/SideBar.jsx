import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../../assets/images/Logo.svg";
import { CgMediaLive } from "react-icons/cg";
import { MdRadio, MdOutlineOndemandVideo } from "react-icons/md";
import { getCurrentUser, logoutUser } from "../../API/userAPI";
import {
  HiOutlineHome,
  HiSearch,
  HiViewList,
  HiHeart,
  HiOutlineFolder,
  HiOutlineSave,
  HiOutlineDotsHorizontal,
} from "react-icons/hi";

const SideBar = ({ isCollapsed, toggleSidebar }) => {
  const navigate = useNavigate();
  const [getUser, setGetUser] = useState(null);
  const [error, setError] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const iconRef = useRef(null);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setGetUser(data.data);
      })
      .catch((error) => {
        setError(error.message || "Login failed");
      });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (iconRef.current && !iconRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleIconClick = () => {
    setShowTooltip((prev) => !prev);
  };

  const handleLogout = () => {
    logoutUser()
      .then((data) => {
        localStorage.setItem("isAuthenticated", false);
        navigate("/login");
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message || "Logout failed");
      });

    setShowTooltip(false);
  };

  return (
    <header className="text-white fixed top-0 left-0 h-full py-4 px-4 border-l-4 border-gray-500 shadow-lg shadow-gray-700 transition-width duration-300 z-50 hidden md:block">
      <div className="flex justify-between items-center sm:justify-start">
        <HiViewList
          size={25}
          onClick={toggleSidebar}
          className="cursor-pointer"
        />
        {!isCollapsed && (
          <img
            src={Logo}
            alt="Logo"
            className="sm:ml-4 sm:mb-6 w-10 sm:w-auto"
          />
        )}
      </div>
      <div
        className={`container flex flex-col justify-between mt-2 h-full ${
          isCollapsed ? "hidden sm:flex" : "flex"
        }`}
      >
        <div>
          <div className="bg-musify-dark rounded-lg p-2 py-2">
            <ul>
              <li className="px-2 py-2 my-2 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8 "
                      : "flex flex-row items-center"
                  }
                >
                  <HiOutlineHome size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">Home</span>
                  )}
                </NavLink>
              </li>
              <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/search"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <HiSearch size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">Search</span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="bg-musify-dark rounded-lg p-2 py-2 mt-3">
            <ul>
              <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/favorite"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <HiHeart size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">
                      Favorite
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/playlist"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <HiOutlineFolder size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">
                      Playlists
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/listen-later"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <HiOutlineSave size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">
                      Listen Later
                    </span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="bg-musify-dark rounded-lg p-2 py-2 mt-3">
            <ul>
              <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/concerts"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <CgMediaLive size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">
                      Live Concert
                    </span>
                  )}
                </NavLink>
              </li>
              {
                // <li className="px-2 py-2 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                //   <NavLink
                //     to="/musicvideos"
                //     className={({ isActive }) =>
                //       isActive
                //         ? "font-bold flex flex-row items-center underline underline-offset-8"
                //         : "flex flex-row items-center"
                //     }
                //   >
                //     <MdOutlineOndemandVideo size={22} />
                //     {!isCollapsed && (
                //       <span className="hidden sm:inline-block ml-2">
                //         Music Videos
                //       </span>
                //     )}
                //   </NavLink>
                // </li>
              }
              <li className="px-2 py-1 my-3 rounded-lg hover:bg-neutral-950 flex flex-row items-center hover:font-bold">
                <NavLink
                  to="/radio"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <MdRadio size={22} />
                  {!isCollapsed && (
                    <span className="hidden sm:inline-block ml-2">Radio</span>
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
          <div className="mt-10 ml-2 relative">
            {getUser && (
              <div className="flex items-center">
                <NavLink
                  to="/user"
                  className={({ isActive }) =>
                    isActive
                      ? "font-bold flex flex-row items-center underline underline-offset-8"
                      : "flex flex-row items-center"
                  }
                >
                  <div className="flex items-center">
                    <img
                      src={
                        getUser.avatar
                          ? getUser.avatar
                          : "https://avatars.githubusercontent.com/u/149575885?v=4"
                      }
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    {!isCollapsed && (
                      <h1 className="text-basic font-semibold">
                        {getUser.fullName.split(" ")[0]}
                      </h1>
                    )}
                  </div>
                </NavLink>

                <div className="relative" ref={iconRef}>
                  <HiOutlineDotsHorizontal
                    onClick={handleIconClick}
                    className="cursor-pointer ml-2"
                  />
                  {showTooltip && (
                    <div className="absolute bg-musify-dark text-white hover:bg-neutral-950 border p-2 rounded shadow-lg z-10 right-0 -top-10">
                      <button
                        className="w-full text-left p-1"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default SideBar;
