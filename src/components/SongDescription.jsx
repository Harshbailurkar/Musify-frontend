import React, { useState, useEffect, useRef } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { FaPlay, FaPause } from "react-icons/fa";
import { toggleLikeSong } from "../API/favoriteAPI";
import { MdOutlineWatchLater, MdOutlinePlaylistAdd } from "react-icons/md";
import { addSongToListenLater } from "../API/listenLaterAPI";
import SearchPlaylist from "./SelectPlaylist";

const SongDescription = ({
  id,
  close,
  title,
  thumbnail,
  artist,
  uploadedBy,
  likes,
  album,
  isLiked,
  handleLikeSong,
  songUrl,
  onSuccess,
}) => {
  const isLongTitle = title.length + artist.length > 15;
  const isLongArtist = artist.length > 15;
  const [liked, setLiked] = useState(isLiked);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(new Audio(songUrl));
  const [error, setError] = useState(null);
  const [showAddToPlaylistOption, setShowAddToPlaylistOption] = useState(false);

  useEffect(() => {
    setLiked(isLiked);
  }, [title, artist, uploadedBy, isLiked]);

  const toggleLike = async () => {
    try {
      await toggleLikeSong(id); // Toggle like status via API
      setLiked((prevLiked) => !prevLiked); // Toggle liked state locally
      handleLikeSong(id); // Update liked status in parent component
    } catch (error) {
      console.log(error.message);
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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

  setTimeout(() => {
    setError(null);
  }, 4000);

  return (
    <div className="flex h-full">
      <div className="bg-musify-dark text-white flex flex-col rounded-xl items-center p-6 pb-10 relative">
        {/* Header */}
        <div className="flex items-center">
          <div className={`sliding-container ${isLongTitle ? "sliding" : ""}`}>
            <div className="sliding-text">
              {title} by {artist}
            </div>
          </div>
          <HiOutlineDotsHorizontal className="text-2xl mx-2" />
          <button
            onClick={close}
            className="absolute top-2 right-2 text-white hover:text-gray-300 focus:outline-none text-2xl pt-1"
          >
            &times;
          </button>
        </div>
        {/* Image */}
        <div className="w-64 h-64 flex-col items-center justify-center mt-4">
          <img
            className="w-full h-full object-cover rounded-lg"
            src={thumbnail}
            alt={title}
          />
        </div>
        {/* Song details */}
        <div className="w-64">
          <h1 className="text-2xl font-bold mt-4 pb-3">{title}</h1>
          <span className="flex items-center">
            <div
              className={`sliding-container ${isLongArtist ? "sliding" : ""}`}
            >
              <div className="sliding-text flex">
                <p className="text-lg text-gray-300">Artist: {artist}</p>
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
          <p className="text-lg text-gray-300">Album: {album}</p>
          <p className="text-lg text-gray-300">Uploaded by: {uploadedBy}</p>
          <p className="text-lg text-gray-300">Likes: {likes}</p>
          {error && error !== "No Songs are available" && (
            <h1 className="text-red-500">{error}</h1>
          )}
          <button
            className="flex items-center mt-4"
            onClick={() => {
              AddSongToListenLater(id);
            }}
          >
            <MdOutlineWatchLater size={20} />
            <span className="ml-2 text-gray-300 hover:text-white">
              Add to Listen Later
            </span>
          </button>
          <div className="relative mt-4">
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
              <div className="absolute top-full mt-2 w-full  left-[-250px]">
                <SearchPlaylist
                  songId={id}
                  close={handleCloseSelectPlaylist}
                  success={onSuccess}
                />
              </div>
            )}
          </div>
          <button
            onClick={togglePlayPause}
            className="mt-4 flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
            <span className="ml-2">{isPlaying ? "Pause" : "Play"}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SongDescription;
