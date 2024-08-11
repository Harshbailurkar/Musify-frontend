import React, { useState, useEffect } from "react";
import {
  getFirstThreePlaylist,
  addSongToPlaylist,
  searchPlaylist,
} from "../../API/playlistAPI";
import { HiOutlinePlus, HiSearch } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const SearchPlaylist = ({ songId, close, success }) => {
  const [playlists, setPlaylists] = useState([]);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getFirstThreePlaylist()
      .then((data) => {
        setPlaylists(data.data);
      })
      .catch((error) => {
        console.error("Error fetching playlists:", error.message);
        setError("Failed to fetch playlists.");
      });
  }, []);

  const handleAddSongToPlaylist = (playlistId, songId) => {
    addSongToPlaylist(playlistId, songId)
      .then(() => {
        close();
        success("Song added to Playlist");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handleSearch = () => {
    if (searchQuery.trim() === "") {
      return;
    }
    searchPlaylist(searchQuery)
      .then((data) => {
        setPlaylists(data.data); // Update playlists based on search results
      })
      .catch((error) => {
        setError("Failed to search playlists.");
      });
  };

  return (
    <div className="w-52 bg-gray-900 border border-gray-700 text-white p-2 rounded-lg shadow-lg transform -translate-y-full">
      <button
        onClick={close}
        className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none text-2xl pt-1"
      >
        &times;
      </button>
      {error && (
        <div className="error text-red-500 text-sm text-center">{error}</div>
      )}
      {playlists.length === 0 && (
        <>
          <p>You don't have any playlists yet!</p>
          <button
            className="border border-gray-600 flex items-center m-5 p-2 rounded bg-musify-dark"
            onClick={() => navigate("/playlist")}
          >
            Create Playlist <HiOutlinePlus />
          </button>
        </>
      )}
      {playlists.length > 0 && (
        <>
          <h1 className="mt-2 mb-2">Search Playlist</h1>
          <div className="flex mb-2">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-1 rounded bg-musify-dark text-white border border-gray-700 text-sm"
            />
            <button
              className="bg-blue-950 hover:bg-blue-900 text-white py-1 px-2 rounded ml-2"
              onClick={handleSearch}
            >
              <HiSearch />
            </button>
          </div>
        </>
      )}

      {playlists.map((playlist) => (
        <div
          key={playlist._id}
          className="flex p-1 pt-2 items-center justify-between"
        >
          <p>{playlist.name}</p>
          <button
            className="bg-green-950 hover:bg-green-900 text-white py-1 px-2 rounded"
            onClick={() => handleAddSongToPlaylist(playlist._id, songId)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default SearchPlaylist;
