import React, { useState, useRef, useEffect } from "react";
import {
  getCurrentUser,
  getChannel,
  logoutUser,
  updateCoverImage,
} from "../API/userAPI";
import { getSongByOwner, deleteSong } from "../API/songAPI";
import NotFound from "../assets/images/NotFound.png";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import SearchBar from "../components/Searchbar";
import { useNavigate } from "react-router-dom";
import EditProfile from "../components/EditProfile";
import UploadSong from "../components/songs/UploadSong";
import EditSongInfo from "../components/songs/EditSongInfo";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
import { getUserStream } from "../API/streamAPI";
import { toast } from "react-toastify";

export default function UserPage() {
  const [getUser, setGetUser] = useState("");
  const [error, setError] = useState(null);
  const [getChannelDetails, setGetChannelDetails] = useState(null);
  const [getSongList, setGetSongList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const [showEditTooltip, setShowEditTooltip] = useState(null);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [showUploadSongModal, setShowUploadSongModal] = useState(false);
  const [showEditSongForm, setShowEditSongForm] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [yourStreamStatus, setYourStreamStatus] = useState(null);
  const navigate = useNavigate();
  const logoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const customId = "custom-id-yes";

  useEffect(() => {
    getCurrentUser()
      .then((data) => {
        setGetUser(data.data);
        getUserStream(data.data._id).then((data) => {
          setYourStreamStatus(data.data?.isLive);
        });

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message || "Login failed");
      });
  }, [successMessage]);
  setTimeout(() => {
    setSuccessMessage(null);
    setError(null);
  }, 5000);
  useEffect(() => {
    if (getUser && getUser.username) {
      getChannel(getUser.username)
        .then((data) => {
          setGetChannelDetails(data.data);
        })
        .catch((error) => {
          setError(error.message || "Login failed");
        });
    }
  }, [getUser, successMessage]);
  useEffect(() => {
    if (getUser && getUser.username) {
      getSongByOwner(getUser.username)
        .then((data) => {
          setGetSongList(data.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    }
  }, [getUser, showEditSongForm]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoutRef.current && !logoutRef.current.contains(event.target)) {
        setShowLogoutTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    setShowLogoutTooltip(false);
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handleIconClick = () => {
    setShowLogoutTooltip(!showLogoutTooltip);
  };
  const handleEditClick = (id) => {
    setSelectedSongId(id);
    setShowEditSongForm(true);
    setShowEditTooltip(null);
  };
  const handleEditIconClick = (songId) => {
    setShowEditTooltip(showEditTooltip === songId ? null : songId);
  };
  const filteredSongs = getSongList.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const handleEditModal = () => {
    setShowEditProfileModal(true);
  };
  const closeEditProfileModal = () => {
    setShowEditProfileModal(false);
  };
  const handleSuccessMessage = (message) => {
    setSuccessMessage(message);
    closeEditProfileModal();
  };
  const handleUploadSong = () => {
    setShowUploadSongModal((prev) => !prev);
  };
  const handleDeleteSong = (songId) => {
    try {
      deleteSong(songId);
      setSuccessMessage("Song deleted successfully!");
      setShowEditTooltip(false);
      getSongByOwner(getUser.username)
        .then((data) => {
          setGetSongList(data.data);
        })
        .catch((error) => {
          setError(error.message);
        });
    } catch (error) {
      setError(error.message || "Error while deleting song");
    }
  };
  const handleAddCoverPhoto = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = (event) => {
    const file = event.target?.files[0];

    if (file) {
      updateCoverImage(file)
        .then((response) => {
          if (response.success) {
            setSuccessMessage("CoverImage updated successfully");
          } else {
            setError(response.message);
          }
        })
        .catch((error) =>
          setError("Error updating cover Image: " + error.message)
        )
        .finally(() => setLoading(false));
    }
  };
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        toastId: customId,
      });
      setSuccessMessage(null); // Clear success message to prevent multiple toasts
    }
  }, [successMessage]);
  if (error === "Login required") {
    navigate("/login");
  }

  return (
    <div className="text-white relative p-4">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <img
            src={Logo}
            alt="Logo"
            className="animate-pulse max-w-3/4"
            style={{ width: "50%", height: "auto" }}
          />
        </div>
      )}
      {error && error !== "No Songs are availabe" && (
        <h1 className="text-red-500">{error}</h1>
      )}
      <div className="w-full mt-10 md:mt-0 h-32 md:h-52 ">
        <div className="bg-gray-800 w-auto h-full md:mx-10 rounded-lg ">
          {getUser.coverPhoto ? (
            <div className="flex w-full h-full justify-center items-center">
              <img
                src={getUser.coverPhoto}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                className="absolute md:text-xl font-bold p-1 md:p-2 border rounded"
                onClick={handleAddCoverPhoto}
              >
                Edit Cover
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
                name="coverPhoto"
              />
            </div>
          ) : (
            <div className="flex w-full h-full justify-center items-center">
              <button
                className="text-2xl text-center p-2 rounded border-gray-600 border hover:border-gray-500"
                onClick={handleAddCoverPhoto}
              >
                Add a cover Photo
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                accept="image/*"
                name="coverPhoto"
              />
            </div>
          )}
        </div>
      </div>
      {/* User Profile*/}
      <div className="flex pt-5 md:pl-32 justify-center md:justify-start">
        <div className=" w-16 md:w-32 h-auto md:h-32">
          <img
            src={
              getUser.avatar
                ? getUser.avatar
                : "https://avatars.githubusercontent.com/u/149575885?v=4"
            }
            alt=""
            className="rounded-full object-cover mt-5 md:mt-0 w-16 md:w-32 h-auto md:h-32"
            draggable="false"
          />
        </div>

        <div className=" ml-5 md:ml-10">
          <h1 className=" text-xl md:text-5xl p-2 font-bold">
            {getUser.fullName}
          </h1>
          <span className="flex items-center justify-between">
            <h4 className="pl-2">@{getUser.username}</h4>
            <div className="relative" ref={logoutRef}>
              <HiOutlineDotsHorizontal
                onClick={handleIconClick}
                className="cursor-pointer ml-2"
                size={22}
              />
              {showLogoutTooltip && (
                <div className="absolute bg-musify-dark text-white hover:bg-neutral-950 border p-2 rounded shadow-lg z-10 right-0 top-full mt-2">
                  <button className="w-full text-left " onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </span>
          {/* Followers and following count */}
          <span className="flex pt-1 text-sm md:text-xl">
            <h4 className="pl-2 pt-1 px-6">
              Followers:{" "}
              {getChannelDetails
                ? getChannelDetails.followerCount
                : "loading..."}
            </h4>
            <h4 className="pl-2 pt-1">
              Following:{" "}
              {getChannelDetails
                ? getChannelDetails.followingCount
                : "loading..."}
            </h4>
          </span>
        </div>
      </div>
      {/* Edit profile and upload song buttons */}
      <div className="pt-5 md:pt-10 md:pl-32 flex text-sm">
        <button
          className="btn bg-musify-dark hover:bg-neutral-950 md:p-3 px-1 mx-4 rounded border border-gray-500 shadow-sm shadow-gray-700"
          onClick={handleEditModal}
        >
          Edit Profile
        </button>
        <button
          className="btn bg-musify-dark hover:bg-neutral-950 p-1 md:p-3 rounded border border-gray-500 shadow-sm shadow-gray-700"
          onClick={handleUploadSong}
        >
          Upload Song
        </button>
        {getChannelDetails &&
          !yourStreamStatus &&
          getChannelDetails.followerCount > 3 && (
            <button
              className="btn mx-4 bg-musify-dark hover:bg-red-950 p-1 md:p-3 rounded border border-gray-500 shadow-sm shadow-gray-700"
              onClick={() => {
                navigate("/live", { state: getUser });
              }}
            >
              start concert
            </button>
          )}
        {getChannelDetails &&
          yourStreamStatus &&
          getChannelDetails.followerCount > 3 && (
            <button
              className="btn mx-4 bg-musify-dark hover:bg-red-950 p-1 md:p-3 rounded border border-gray-500 shadow-sm shadow-gray-700"
              onClick={() => {
                navigate("/manageStream", { state: getUser });
              }}
            >
              Manage Concert
            </button>
          )}
      </div>

      {/* Modals */}
      {showUploadSongModal && (
        <UploadSong
          onClose={() => setShowUploadSongModal(false)}
          user={getUser}
          onSuccess={handleSuccessMessage}
        />
      )}
      {showEditProfileModal && (
        <EditProfile
          onClose={closeEditProfileModal}
          user={getUser}
          onSuccess={handleSuccessMessage}
        />
      )}

      {/* songs uploaded by the user */}
      <div className="pl-5 md:pl-20 pt-16">
        <h3 className="text-2xl font-semibold">Your songs</h3>
        {(error && error === "No Songs are available") ||
        getSongList.length === 0 ? (
          <span className="flex justify-center flex-col items-center">
            <img
              src={NotFound}
              alt=""
              className="w-20 mt-20 md:mt-10 md:w-36 h-20 md:h-36"
              draggable="false"
            />
            <h1 className="text-xl pt-4">
              {error ? error : "You haven't uploaded any songs yet!"}
            </h1>
          </span>
        ) : null}

        {/* Display songs uploaded by the user */}
        {getSongList.length > 0 && (
          <div className="pt-5">
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
            <div className="flex flex-wrap gap-4 pt-10">
              {filteredSongs.map((song) => (
                <div
                  className="bg-musify-dark w-32 md:w-52 p-4 flex flex-col flex-wrap rounded shadow-md   relative"
                  key={song._id}
                >
                  {/* Edit and delete icons */}
                  <div>
                    <HiOutlineDotsHorizontal
                      onClick={() => handleEditIconClick(song._id)}
                      className="cursor-pointer m-1"
                      size={22}
                    />
                    {showEditTooltip === song._id && (
                      <div className="absolute top-0 right-0 mt-2 w-16 md:w-32 bg-musify-dark text-white p-2 rounded shadow-lg z-10 border border-gray-600">
                        <button
                          className="w-full text-left p-1 hover:bg-neutral-950"
                          onClick={() => handleEditClick(song._id)}
                        >
                          Edit
                        </button>
                        <button
                          className="w-full text-left p-1 hover:bg-neutral-950"
                          onClick={() => handleDeleteSong(song._id)}
                        >
                          Delete
                        </button>

                        <button
                          className="w-full text-left p-1 hover:bg-neutral-950"
                          onClick={() => setShowEditTooltip(false)}
                        >
                          close
                        </button>
                      </div>
                    )}
                    {showEditSongForm && (
                      <EditSongInfo
                        onClose={() => {
                          setShowEditSongForm(false);
                          setSelectedSongId(null);
                        }}
                        songId={selectedSongId}
                      />
                    )}
                  </div>
                  <div className="flex flex-col ">
                    <img
                      src={song.ThumbnailUrl || logo}
                      alt=""
                      className="w-full h-22 md:h-44 rounded-md "
                    />
                    <h3 className="text-base md:text-lg font-medium md:pt-2 text-left">
                      {song.title}
                    </h3>
                    <h3 className="text-sm font-medium md:pt-2 text-left">
                      from {song.album}
                    </h3>
                    <h3 className="text-sm font-medium md:pt-2 text-left">
                      Likes :{" " + song.likesCount}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
