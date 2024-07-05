import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import swal from "sweetalert";
import {
  getAllPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
} from "../API/playlistAPI";

export default function Playlist() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPlaylistCreationForm, setShowPlaylistCreationForm] =
    useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [formError, setFormError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);
  const [updatePlaylistName, setUpdatePlaylistName] = useState("");
  const [showPlayListUpdateForm, setShowPlayListUpdateForm] = useState(false);
  const [currentPlaylistId, setCurrentPlaylistId] = useState(null);

  const fetchPlaylists = async () => {
    try {
      const response = await getAllPlaylist();
      if (response.statusCode === 200) {
        setPlaylists(response.data); // Assuming response.data is an array of playlists
      } else {
        setError("Failed to fetch playlists");
      }
    } catch (err) {
      console.error("Failed to fetch playlists:", err);
      setError("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handlePlaylistCreationForm = () => {
    setShowPlaylistCreationForm(true);
    setFormError("");
  };

  const handleCreatePlaylist = async () => {
    if (playlistName.trim() === "") {
      setFormError("Playlist name is required.");
      return;
    }

    try {
      const response = await createPlaylist(playlistName);

      if (response.statusCode === 200) {
        await fetchPlaylists();
        setShowPlaylistCreationForm(false);
        setPlaylistName("");
      }
    } catch (error) {
      console.log(error.message);
      if (error.message === "Playlist with name already exists") {
        setFormError("Playlist with this name already exists.");
      } else {
        setFormError("Failed to create playlist. Please try again later.");
      }
    }
  };

  const handlePlaylistClick = (playlistId) => {
    setExpandedPlaylist(expandedPlaylist === playlistId ? null : playlistId);
  };

  const handleDeletePlaylist = async (playlistId) => {
    swal({
      icon: "warning",
      buttons: true,
      dangerMode: true,
      content: {
        element: "div",
        attributes: {
          innerHTML: `<div style="background-color: rgb(21, 21, 21); color: white; padding: 10px; font-size: larger;">
                      Are you sure?
                      <br>
                      Once deleted, you will not be able to recover this playlist!
                    </div>`,
        },
      },
      className: "sweetAlert",
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          const response = await deletePlaylist(playlistId);
          if (response.statusCode === 200) {
            await fetchPlaylists();
            swal({
              icon: "success",
              content: {
                element: "div",
                attributes: {
                  innerHTML: `<div style="background-color: rgb(21, 21, 21); color: white; padding: 10px; font-size: larger">
                              Poof! Your playlist has been deleted!
                            </div>`,
                },
              },
              className: "sweetAlert",
            });
          } else {
            swal({
              icon: "error",
              content: {
                element: "div",
                attributes: {
                  innerHTML: `<div style="background-color: rgb(21, 21, 21); color: white; padding: 10px; font-size: larger">
                              Error deleting playlist
                            </div>`,
                },
              },
              className: "sweetAlert",
            });
          }
        } catch (err) {
          swal({
            icon: "error",
            content: {
              element: "div",
              attributes: {
                innerHTML: `<div style="background-color: rgb(21, 21, 21); color: white; padding: 10px; font-size: larger">
                            Error deleting playlist
                          </div>`,
              },
            },
            className: "sweetAlert",
          });
        }
      } else {
        swal({
          content: {
            element: "div",
            attributes: {
              innerHTML: `<div style="background-color: rgb(21, 21, 21); color: white; padding: 10px; font-size: larger">
                          Your playlist is safe!
                        </div>`,
            },
          },
          className: "sweetAlert",
        });
      }
    });
  };

  const handlePlaylistUpdateForm = (playlistId, playlistName) => {
    setCurrentPlaylistId(playlistId);
    setUpdatePlaylistName(playlistName);
    setShowPlayListUpdateForm(true);
    setFormError("");
  };

  const handleSharePlaylist = (playlistId) => {
    alert("http://localhost:8000/api/v1/playlists/user/" + playlistId);
  };

  const handleUpdatePlaylist = async (playlistId) => {
    if (updatePlaylistName.trim() === "") {
      setFormError("Playlist name is required.");
      return;
    }
    try {
      const response = await updatePlaylist(playlistId, updatePlaylistName);

      if (response.statusCode === 200) {
        await fetchPlaylists();
        setShowPlayListUpdateForm(false);
        setUpdatePlaylistName("");
      }
    } catch (error) {
      console.log(error.message);
      if (error.message === "Playlist with name already exists") {
        setFormError("Playlist with this name already exists.");
      } else if (error.message === "Playlist Name is required") {
        setFormError("Playlist Name is required.");
      } else {
        setFormError("Failed to update playlist. Please try again later.");
      }
    }
  };

  if (error === "Login required") {
    navigate("/login");
    return null;
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className="relative">
      <div
        className={`main-content ${showPlaylistCreationForm ? "blur-sm" : ""}`}
      >
        <div className="flex items-center justify-between p-24 mr-44">
          <span>
            <h2 className="text-5xl text-white font-bold p-1">
              Your Playlists
            </h2>
          </span>
          <button
            className="text-white rainbow-border p-4 flex items-center font-semibold rounded border-2 border-blue-500"
            onClick={handlePlaylistCreationForm}
          >
            Create Playlist <HiOutlinePlus className="ml-1" />
          </button>
        </div>
      </div>
      {showPlaylistCreationForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-musify-dark text-white border border-gray-800 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-700 text-white bg-neutral-950 rounded"
              placeholder="Playlist Name"
              value={playlistName}
              onChange={(e) => {
                setPlaylistName(e.target.value);
                setFormError("");
              }}
              required
              name="name"
            />
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={handleCreatePlaylist}
              >
                Create
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowPlaylistCreationForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-white text-xl p-10">
        <pre>Playlists</pre>
      </h2>
      {playlists.length === 0 ? (
        <span className="text-white px-10">No playlists found.</span>
      ) : (
        <div>
          {playlists.map((playlist) => (
            <div
              key={playlist._id}
              className="text-white px-10 p-5 border border-gray-700 rounded mb-2 cursor-pointer"
              onClick={() => handlePlaylistClick(playlist._id)}
            >
              <span className="flex items-center justify-between">
                <span>{playlist.name}</span>
                <div className="flex space-x-2">
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600  text-gray-400 hover:text-white"
                    onClick={() =>
                      handlePlaylistUpdateForm(playlist._id, playlist.name)
                    }
                  >
                    <HiOutlinePencil
                      className="mx-2 cursor-pointer"
                      size={20}
                    />
                  </span>
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600 text-gray-400 hover:text-white"
                    onClick={() => handleSharePlaylist(playlist._id)}
                  >
                    <IoIosShareAlt className="mx-2 cursor-pointer" size={20} />
                  </span>
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600  text-gray-400 hover:text-red-500"
                    onClick={() => handleDeletePlaylist(playlist._id)}
                  >
                    <HiOutlineTrash className="mx-2 cursor-pointer" size={20} />
                  </span>
                </div>
              </span>
              {expandedPlaylist === playlist._id && (
                <div className="mt-4">
                  {playlist.songs.length === 0 ? (
                    <span>
                      <div className="text-white">
                        No Songs added to this playlist
                      </div>
                      <button
                        className="p-2 border border-gray-600 rounded mt-3 flex items-center "
                        onClick={() => navigate("/")}
                      >
                        add songs <HiOutlinePlus className="mx-1" />
                      </button>
                    </span>
                  ) : (
                    playlist.songs.map((song) => (
                      <div key={song._id} className="flex items-center mb-2">
                        <img
                          src={song.ThumbnailUrl}
                          alt={song.title}
                          className="w-12 h-12 mr-4"
                        />
                        <span>{song.title}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {showPlayListUpdateForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="p-8 bg-musify-dark text-white border border-gray-800 rounded shadow-lg w-1/3">
            <h2 className="text-2xl font-bold mb-4">Update Playlist</h2>
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-700 text-white bg-neutral-950 rounded"
              placeholder="Playlist Name"
              value={updatePlaylistName}
              onChange={(e) => {
                setUpdatePlaylistName(e.target.value);
                setFormError("");
              }}
              required
              name="name"
            />
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <div className="flex justify-end">
              <button
                className="bg-blue-500 text-white p-2 rounded mr-2"
                onClick={() => handleUpdatePlaylist(currentPlaylistId)}
              >
                Update
              </button>
              <button
                className="bg-gray-500 text-white p-2 rounded"
                onClick={() => setShowPlayListUpdateForm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
