import React from "react";
import logo from "../../music player images/Logo.svg";
import logo2 from "../../music player images/logo.png";
import homeimg from "../../music player images/Home.png";
import feedimg from "../../music player images/feed.png";
import concertimg from "../../music player images/concert.png";
import playlistimg from "../../music player images/playlist.png";
import favimg from "../../music player images/favorite.png";
import podcastimg from "../../music player images/menuPodcast.png";
import listenimg from "../../music player images/time-regular-24.png";
import radioimg from "../../music player images/radio.png";
import { GiHamburgerMenu } from "react-icons/gi";
import { NavLink, Link } from "react-router-dom";

export default function Navbar() {
  return (
    <div className="bgblue h-full text-white">
      {
        <nav className="navbar">
          <ul className="p-3">
            <Link to="/">
              <li className="navBar pr-6 flex items-center p-1">
                <img src={logo} alt="" />
              </li>
            </Link>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-10 flex items-center p-4 m-2">
                <img src={homeimg} alt="" className="w-6" />
                <h2>Home</h2>
              </li>
            </NavLink>
            <NavLink
              to="feed"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-12 flex items-center p-4 m-2">
                <img src={feedimg} alt="" className="w-6" />
                <h2>Feed</h2>
              </li>
            </NavLink>
            <NavLink
              to="concerts"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-7 flex items-center p-4 m-2">
                <img src={concertimg} alt="" className="w-6" />
                <h2>Concerts</h2>
              </li>
            </NavLink>
            <NavLink
              to="playlist"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-10 flex items-center p-4 m-2">
                <img src={playlistimg} alt="" className="w-6" />
                <h2>Playlist</h2>
              </li>
            </NavLink>
            <NavLink
              to="favorites"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-10 flex items-center p-4 m-2">
                <img src={favimg} alt="" className="w-6" />
                <h2>Favorites</h2>
              </li>
            </NavLink>
            <NavLink
              to="podcast"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-10 flex items-center p-4 m-2">
                <img src={podcastimg} alt="" className="w-6" />
                <h2>Podcast</h2>
              </li>
            </NavLink>
            <NavLink
              to="listen-later"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-4 flex items-center p-4 m-2">
                <img src={listenimg} alt="" className="w-6" />
                <h2> Listen Later</h2>
              </li>
            </NavLink>
            <NavLink
              to="radio"
              className={({ isActive }) =>
                isActive ? " font-bold underline underline-offset-8" : null
              }
            >
              <li className="navBar pr-14 flex items-center p-4 m-2">
                <img src={radioimg} alt="" className="w-6" />
                <h2>Radio</h2>
              </li>
            </NavLink>
          </ul>
        </nav>
      }
    </div>
  );
}
