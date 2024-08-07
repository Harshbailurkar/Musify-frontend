import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import { toggleLikeSong } from "../API/favoriteAPI";
import { MdOutlineWatchLater, MdOutlinePlaylistAdd } from "react-icons/md";
import { addSongToListenLater } from "../API/listenLaterAPI";
import SearchPlaylist from "./SelectPlaylist";
import { IoShareOutline } from "react-icons/io5";
import { TbUserShare } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import ShareToolTip from "./ShareToolTip";

const SongDescriptionForMobile = ({
  id,
  close,
  title,
  thumbnail,
  artist,
  uploadedBy,
  likes,
  album,
  isLiked,
  songUrl,
  onSuccess,
}) => {
  const isLongTitle = title.length + artist.length > 15;
  const isLongArtist = artist.length > 15;
  const isTitleLong = title.length > 55;
  const isAlbumLong = album.length > 15;
  const [liked, setLiked] = useState(isLiked);
  const [error, setError] = useState(null);
  const [showAddToPlaylistOption, setShowAddToPlaylistOption] = useState(false);
  const [showOtherOptions, setShowOtherOptions] = useState(false);
  const [link, setLink] = useState(null);
  const [showShareToolTip, setShowShareToolTip] = useState(false);
  const searchPlaylistRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLiked(isLiked);
  }, [title, artist, uploadedBy, isLiked]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchPlaylistRef.current &&
        !searchPlaylistRef.current.contains(event.target)
      ) {
        setShowAddToPlaylistOption(false);
        setShowOtherOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const toggleLike = async () => {
    try {
      await toggleLikeSong(id);
      setLiked((prevLiked) => !prevLiked);
    } catch (error) {
      console.log(error.message);
    }
  };

  const AddSongToListenLater = async (id) => {
    try {
      await addSongToListenLater(id).then(() => {
        onSuccess("Song added to Listen Later");
        close();
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleToggleAddToPlaylist = () => {
    setShowAddToPlaylistOption((prev) => !prev);
  };

  const handleCloseSelectPlaylist = () => {
    setShowAddToPlaylistOption(false);
  };

  const goToUserProfile = (username) => {
    navigate(`/c/${username}`);
  };
  const handleShareSong = () => {
    const link = `${window.location.origin}/songid/${id}`;
    setLink(link);
  };

  return (
    <div className="fixed  md:hidden w-11/12 ">
      <div className="bg-musify-dark text-white flex flex-col rounded-xl items-center p-6 pb-10 relative max-h-full min-h-0 border border-gray-800 shadow-inner shadow-gray-700">
        {/* Header */}
        <div className="flex items-center">
          <div className={`sliding-container ${isLongTitle ? "sliding" : ""}`}>
            <div className="sliding-text">
              {title} by {artist}
            </div>
            x
          </div>
          <HiOutlineDotsHorizontal
            className="text-2xl mx-2"
            onClick={() => setShowOtherOptions((prev) => !prev)}
          />
          {showOtherOptions && (
            <div className="absolute top-10 right-2 bg-musify-dark text-white p-2 rounded-lg border border-gray-700">
              <button
                className="flex items-center text-gray-300 hover:text-white"
                onClick={() => goToUserProfile(uploadedBy)}
              >
                <TbUserShare size={20} className="mx-1" />
                Go to {uploadedBy}
              </button>
              <button
                className="flex items-center mt-2 text-gray-300 hover:text-white"
                onClick={() => {
                  handleShareSong();
                  setShowShareToolTip(true);
                }}
              >
                <IoShareOutline size={20} className="mx-1" />
                Share
              </button>
            </div>
          )}
          <button
            onClick={close}
            className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none text-2xl pt-1"
          >
            &times;
          </button>
        </div>
        {/* Image */}
        <div className="w-64 h-64 flex-col items-center justify-center mt-2">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={thumbnail ? thumbnail : Logo}
            alt={title}
            draggable="false"
          />
        </div>
        {/* Song details */}
        <div className="w-64">
          <div
            className={`title-sliding-container ${
              isTitleLong ? "sliding" : ""
            }`}
          >
            <div className={`${isTitleLong ? "title-sliding-text" : "flex"} `}>
              <h1 className="text-xl font-bold mt-2 pb-3">{title}</h1>
            </div>
          </div>

          <span className="flex items-center">
            <div
              className={`sliding-container ${isLongArtist ? "sliding" : ""}`}
            >
              <div
                className={`${isLongArtist ? "title-sliding-text" : "flex"} `}
              >
                <p className=" text-gray-300">Artist: {artist}</p>
              </div>
            </div>
            <div onClick={toggleLike} className="ml-2">
              {liked ? (
                <FaHeart className="text-red-600" size={20} />
              ) : (
                <FaRegHeart size={20} />
              )}
            </div>
          </span>
          <div className={`sliding-container ${isAlbumLong ? "sliding" : ""}`}>
            <div className={`${isAlbumLong ? "title-sliding-text" : "flex"} `}>
              <p className=" text-gray-300">Album: {album}</p>
            </div>
          </div>
          <p className=" text-gray-300">Uploaded by: {uploadedBy}</p>
          <p className=" text-gray-300">Likes: {likes}</p>
          {error && error !== "No Songs are available" && (
            <h1 className="text-red-500">{error}</h1>
          )}
          <button
            className="flex items-center mt-2 md:mt-4"
            onClick={() => {
              AddSongToListenLater(id);
            }}
          >
            <MdOutlineWatchLater size={20} />
            <span className="ml-2 text-gray-300 hover:text-white">
              Add to Listen Later
            </span>
          </button>
          <div className="relative mt-2 md:mt-4">
            <button
              className="flex items-center"
              onClick={handleToggleAddToPlaylist}
            >
              <MdOutlinePlaylistAdd size={20} />
              <span className="ml-2 text-gray-300 hover:text-white">
                Add to Playlist
              </span>
            </button>
            {showAddToPlaylistOption && (
              <div className="absolute top-1 mt-2 w-full">
                <div ref={searchPlaylistRef}>
                  <SearchPlaylist
                    songId={id}
                    close={handleCloseSelectPlaylist}
                    success={onSuccess}
                  />
                </div>
              </div>
            )}
            {showShareToolTip && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 md:ml-24">
                <ShareToolTip
                  link={link}
                  Close={() => setShowShareToolTip((prev) => !prev)}
                  className="fixed md:top-1/2 left-1/2 mb-4 mr-4"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SongDescriptionForMobile;
