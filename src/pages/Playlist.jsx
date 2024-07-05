import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlinePlus, HiOutlineTrash, HiOutlinePencil } from "react-icons/hi";
import {
  getAllPlaylist,
  createPlaylist,
  deletePlaylist,
} from "../API/playlistAPI";
import swal from "sweetalert";
import { IoIosShareAlt } from "react-icons/io";

export default function Playlist() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [showPlaylistCreationForm, setShowPlaylistCreationForm] =
    useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [formError, setFormError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [expandedPlaylist, setExpandedPlaylist] = useState(null);

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

  const handleSharePlaylist = (playlistId) => {
    alert("http://localhost:8000/api/v1/playlists/user/" + playlistId);
  };
  const handleEditPlaylist = (playlistId) => {};
  if (error === "Login required") {
    navigate("/login");
    return null; // Render nothing while redirecting
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
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold pr-10 ">
                  {playlist.name}
                  <span className="text-sm  pl-10  ">
                    {playlist.songs.length} songs
                  </span>
                </span>
                <div className="flex">
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600"
                    onClick={() => handleEditPlaylist(playlist._id)}
                  >
                    <HiOutlinePencil size={20} className="mx-2 " />
                  </span>
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600"
                    onClick={() => handleSharePlaylist(playlist._id)}
                  >
                    <IoIosShareAlt size={20} className="mx-2 " />
                  </span>
                  <span
                    className="hover:bg-musify-dark py-2 rounded cursor-pointer hover:border hover:border-gray-600"
                    onClick={() => handleDeletePlaylist(playlist._id)}
                  >
                    <HiOutlineTrash size={20} className="mx-2 " />
                  </span>
                </div>
              </div>
              {expandedPlaylist === playlist._id && (
                <div className="mt-4">
                  {playlist.songs.length === 0 ? (
                    <span>
                      <div className="text-white">
                        No Songs added to this playlist
                      </div>
                      <button className="p-2 border border-gray-600 rounded mt-3 flex items-center ">
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
    </div>
  );
}
