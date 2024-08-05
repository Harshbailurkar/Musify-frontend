import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/images/Logo.svg";
import { getCurrentUser, logoutUser } from "../API/userAPI";
import {
  HiOutlineMenu,
  HiOutlineUserCircle,
  HiOutlineLogout,
} from "react-icons/hi";

const TopBar = () => {
  const navigate = useNavigate();
  const [getUser, setGetUser] = useState(null);
  const [error, setError] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setGetUser(data.data);
      })
      .catch((error) => {
        setError(error.message || "Login failed");
      });
  }, []);

  const handleLogout = () => {
    logoutUser()
      .then(() => {
        localStorage.setItem("isAuthenticated", false);
        navigate("/login");
        window.location.reload();
      })
      .catch((error) => {
        setError(error.message || "Logout failed");
      });
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  return (
    <header className="bg-musify-dark text-white flex items-center justify-between px-4 py-2 shadow-lg fixed top-0 left-0 w-full z-50 md:hidden">
      <div className="flex items-center ">
        <HiOutlineMenu
          size={25}
          className="cursor-pointer sm:hidden"
          onClick={toggleDropdown}
        />
        <img src={Logo} alt="Logo" className="w-20 ml-2" />
      </div>
      <div className="hidden sm:flex space-x-3">
        <NavLink to="/" className="hover:underline sm:text-xs">
          Home
        </NavLink>
        <NavLink to="/search" className="hover:underline sm:text-xs">
          Search
        </NavLink>
        <NavLink to="/favorite" className="hover:underline sm:text-xs">
          Favorite
        </NavLink>
        <NavLink to="/playlist" className="hover:underline sm:text-xs">
          Playlists
        </NavLink>
        <NavLink to="/listen-later" className="hover:underline sm:text-xs">
          Listen Later
        </NavLink>
        <NavLink to="/concerts" className="hover:underline sm:text-xs">
          Live Concerts
        </NavLink>
        <NavLink to="/radio" className="hover:underline sm:text-xs">
          Radio
        </NavLink>
      </div>
      <div className="flex items-center">
        {getUser && (
          <div className="relative flex items-center">
            <NavLink to="/user" className="flex items-center">
              <img
                src={
                  getUser.avatar ||
                  "https://avatars.githubusercontent.com/u/149575885?v=4"
                }
                alt="User Avatar"
                className="w-5 h-5 rounded-full object-cover mr-2"
              />
              <span className="hidden sm:block sm:text-xs">
                {getUser.fullName.split(" ")[0]}
              </span>
            </NavLink>
            <HiOutlineLogout
              size={18}
              className="cursor-pointer ml-2"
              onClick={handleLogout}
            />
          </div>
        )}
      </div>
      {dropdownVisible && (
        <div className="absolute top-12 left-0 w-full bg-musify-dark text-white shadow-lg sm:hidden">
          <NavLink to="/" className="block px-4 py-2 hover:bg-gray-700">
            Home
          </NavLink>
          <NavLink to="/search" className="block px-4 py-2 hover:bg-gray-700">
            Search
          </NavLink>
          <NavLink to="/favorite" className="block px-4 py-2 hover:bg-gray-700">
            Favorite
          </NavLink>
          <NavLink to="/playlist" className="block px-4 py-2 hover:bg-gray-700">
            Playlists
          </NavLink>
          <NavLink
            to="/listen-later"
            className="block px-4 py-2 hover:bg-gray-700"
          >
            Listen Later
          </NavLink>
          <NavLink to="/concerts" className="block px-4 py-2 hover:bg-gray-700">
            Live Concerts
          </NavLink>
          <NavLink to="/radio" className="block px-4 py-2 hover:bg-gray-700">
            Radio
          </NavLink>
        </div>
      )}
    </header>
  );
};

export default TopBar;
