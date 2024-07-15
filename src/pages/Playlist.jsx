import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiChevronDown,
  HiChevronUp,
  HiOutlineDotsHorizontal,
  HiOutlineSortAscending,
  HiOutlineSortDescending,
} from "react-icons/hi";
import { IoIosShareAlt } from "react-icons/io";
import swal from "sweetalert";
import {
  getAllPlaylist,
  createPlaylist,
  deletePlaylist,
  updatePlaylist,
  removeSongFromPlaylist,
  moveSongToTopInPlaylist,
  moveSongToBottomInPlaylist,
} from "../API/playlistAPI";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import logo from "../assets/images/logo.png";
import Logo from "../assets/images/Logo.svg";
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
  const [showEditTooltip, setShowEditTooltip] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchPlaylists = async () => {
    try {
      getAllPlaylist()
        .then((data) => {
          setLoading(false);
          setPlaylists(data.data);
        })
        .catch((error) => {
          setLoading(false);
          setError(error.message);
        });
    } catch (err) {
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
                  innerHTML: `<div style="padding: 10px; font-size: larger">
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
    alert(`http://localhost:8000/api/v1/playlists/user/${playlistId}`);
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
  const handlePlayListSongOptions = (songId) => {
    setShowEditTooltip(showEditTooltip === songId ? null : songId);
  };
  const handleRemoveSongFromPlaylist = (PlaylistId, SongId) => {
    try {
      removeSongFromPlaylist(PlaylistId, SongId).then((response) => {
        if (response.statusCode === 200) {
          fetchPlaylists();
        }
      });
    } catch (err) {
      alert(error);
    }
  };
  const moveSongToTop = async (playlistId, songId) => {
    try {
      const response = await moveSongToTopInPlaylist(playlistId, songId);
      if (response.statusCode === 200) {
        fetchPlaylists();
      } else {
        console.error("Failed to move song to top:", response.error);
      }
    } catch (err) {
      console.error("Failed to move song to top:", err);
    }
  };

  const moveSongToBottom = async (playlistId, songId) => {
    try {
      const response = await moveSongToBottomInPlaylist(playlistId, songId);
      if (response.statusCode === 200) {
        // Song moved to bottom successfully, update playlists
        fetchPlaylists();
      } else {
        console.error("Failed to move song to bottom:", response.error);
      }
    } catch (err) {
      console.error("Failed to move song to bottom:", err);
    }
  };
  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail })); // corrected parameter name id to title
  };
  const handlePlayPlaylist = (index) => {
    dispatch(setMusicData(playlists[index].songs));
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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <img
            src={Logo}
            alt="Logo"
            className="animate-pulse max-w-3/4"
            style={{ width: "50%", height: "auto" }}
          />
        </div>
      )}
      {/* playlist creation*/}
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
          {playlists.map((playlist, index) => (
            <div
              key={playlist._id}
              className="text-white px-10 p-5 border border-gray-700 rounded mb-2 cursor-pointer"
            >
              <span
                className="flex items-center justify-between"
                onClick={() => handlePlaylistClick(playlist._id, index)}
              >
                <span className="text-lg flex items-center">
                  <span className="pr-4">
                    {expandedPlaylist === playlist._id ? (
                      <HiChevronUp />
                    ) : (
                      <HiChevronDown />
                    )}
                  </span>

                  {playlist.name}
                  <button
                    className="bg-green-800 hover:bg-green-600 rounded text-white p-1 mx-2 text-sm"
                    onClick={(e) => {
                      handlePlayPlaylist(index);
                      e.stopPropagation();
                    }}
                  >
                    play
                  </button>
                </span>

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
                      <div className="flex flex-col">
                        <div
                          key={song._id}
                          className="flex items-center justify-between relative "
                          onClick={() =>
                            handlePlaySong(
                              song.songUrl,
                              song.title,
                              song.owner,
                              song.ThumbnailUrl || logo
                            )
                          }
                        >
                          <span className="flex items-center  ">
                            <img
                              src={song.ThumbnailUrl || logo}
                              alt={song.title}
                              className="w-12 h-12 mr-4"
                            />
                            <span>{song.title}</span>
                          </span>
                          <div
                            className="mr-10"
                            onClick={() => handlePlayListSongOptions(song._id)}
                          >
                            <HiOutlineDotsHorizontal size={20} />
                            {showEditTooltip === song._id && (
                              <div className="absolute top-10 right-0 mt-2 w-40 bg-musify-dark text-white p-2 rounded shadow-lg z-10 border border-gray-600 ">
                                <button
                                  className="w-full text-left p-1 border hover:bg-neutral-950  border-b-gray-600 border-x-0 border-t-0"
                                  onClick={() =>
                                    handleRemoveSongFromPlaylist(
                                      playlist._id,
                                      song._id
                                    )
                                  }
                                >
                                  <span className="flex items-center">
                                    <HiOutlineTrash
                                      size={20}
                                      className="mx-2"
                                    />
                                    <p> Remove</p>
                                  </span>
                                </button>
                                <button
                                  className="w-full text-left p-1 hover:bg-neutral-950  border border-b-gray-600 border-x-0 border-t-0"
                                  onClick={() =>
                                    moveSongToTop(playlist._id, song._id)
                                  }
                                >
                                  <span className="flex items-center">
                                    <HiOutlineSortAscending
                                      className="mx-2"
                                      size={20}
                                    />
                                    <p>Move to top</p>
                                  </span>
                                </button>
                                <button
                                  className="w-full text-left p-1 hover:bg-neutral-950 border border-b-gray-600 border-x-0 border-t-0"
                                  onClick={() =>
                                    moveSongToBottom(playlist._id, song._id)
                                  }
                                >
                                  <span className="flex items-center">
                                    <HiOutlineSortDescending
                                      className="mx-2"
                                      size={20}
                                    />
                                    <p> Move to Last</p>
                                  </span>
                                </button>
                                <button
                                  className="w-full text-center p-1 hover:bg-neutral-950 "
                                  onClick={() => setShowEditTooltip(false)}
                                >
                                  close
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="border-b border-b-slate-600 w-full my-2"></div>
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
