import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Search from "./pages/Search";
import Playlist from "./pages/Playlist";
import Favorite from "./pages/Favorite";
import ListenLater from "./pages/ListenLater";
import UserPage from "./pages/UserPage";
import Radio from "./pages/Radio";
import ArtistProfile from "./pages/ArtistProfile";
import PageNotFound from "./pages/PageNotFound";
import SharedPlaylist from "./pages/SharedPlaylist";
import SharedSong from "./pages/SharedSong";
import { useEffect } from "react";

export default function App() {
  //prevent default context menu from appearing when the user right-clicks anywhere on the webpage
  useEffect(() => {
    const handleContextMenu = (event) => {
      event.preventDefault();
    };
    document.addEventListener("contextmenu", handleContextMenu);
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);
  return (
    <BrowserRouter>
      <div className="flex-1 flex flex-col bg-gradient-to-br from-black to-[#000000]">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route path="/playlist" element={<Playlist />} />
            <Route path="/listen-later" element={<ListenLater />} />
            <Route path="/radio" element={<Radio />} />
            <Route path="/user" element={<UserPage />} />
            <Route path="/c/:username" element={<ArtistProfile />} />
            <Route path="/user/:playlistId" element={<SharedPlaylist />} />
            <Route path="/songid/:songId" element={<SharedSong />} />
            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
