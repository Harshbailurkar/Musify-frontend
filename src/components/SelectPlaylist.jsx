import React from "react";
import { getFirstThreePlaylist, addSongToPlaylist } from "../API/playlistAPI";

export default function SearchPlaylist({ songId, close, success }) {
  const [playlists, setPlaylists] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    getFirstThreePlaylist()
      .then((data) => {
        setPlaylists(data.data);
      })
      .catch((error) => {
        setError(error.message);
      });
  }, []);

  const handleAddSongToPlaylist = (playlistId, songId) => {
    console.log("Playlist Id " + playlistId + " . songId: " + songId);
    try {
      addSongToPlaylist(playlistId, songId)
        .then(() => {
          close();
          success("Song added to Playlist");
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error) {
      console.log("error found " + error.message);
      setError(error.message);
    }
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
      <h1 className="mt-2 mb-2">Search Playlist</h1>
      <input
        type="search"
        className="w-full mb-2 p-1 rounded bg-musify-dark text-white border border-gray-700 text-sm"
      />
      <button className="bg-blue-500 text-white py-1 px-2 rounded">
        Search
      </button>
      {error && <button>Create Playlist</button>}
      {playlists &&
        playlists.map((playlist) => (
          <div
            key={playlist._id}
            className="flex p-1 items-center justify-between"
          >
            <p>{playlist.name}</p>
            <button
              className="bg-blue-500 text-white py-1 px-2 rounded"
              onClick={() => handleAddSongToPlaylist(playlist._id, songId)}
            >
              Add
            </button>
          </div>
        ))}
    </div>
  );
}
