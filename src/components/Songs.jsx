import React from "react";
import { FaPlay } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import Logo from "../assets/images/logo.png";
const formatLikes = (likes) => {
  if (likes >= 1000000000) {
    return (likes / 1000000000).toFixed(1) + "B";
  } else if (likes >= 1000000) {
    return (likes / 1000000).toFixed(1) + "M";
  } else if (likes >= 1000) {
    return (likes / 1000).toFixed(1) + "k";
  } else {
    return likes.toString();
  }
};

const Song = ({
  id,
  songName,
  thumbnail,
  url,
  uploadedBy,
  likes,
  handleShowDescriptionOfSong,
  showDescriptionOfSongForMobile,
  isLiked,
  screenSize,
}) => {
  if (songName.length > 20) {
    songName = songName.substring(0, 14) + "...";
  }

  const dispatch = useDispatch();
  const handleClickSongCard = (id) => {
    if (screenSize) {
      handleShowDescriptionOfSong();
    } else {
      showDescriptionOfSongForMobile();
    }
  };
  const handlePlayButton = (e, id, url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ id, url, songName, uploadedBy, thumbnail }));
  };

  return (
    <div
      className="group w-24 md:w-40 max-w-sm flex flex-col items-center rounded overflow-hidden shadow-lg hover:bg-musify-dark text-white m-2 transition transform hover:scale-105 hover:shadow-xl border border-gray-950 md:border-none"
      onClick={() => handleClickSongCard(id)}
    >
      <div className="relative w-20 h-20 md:w-32 md:h-32 flex items-center justify-center mt-4">
        <img
          className="w-full h-full object-cover rounded-lg"
          src={thumbnail ? thumbnail : Logo}
          alt={songName}
          draggable="false"
        />
        <button
          className="absolute bottom-0 right-0  w-12 h-12 m-2 bg-green-500 text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) =>
            handlePlayButton(
              e,
              id,
              url,
              songName,
              uploadedBy,
              thumbnail || Logo
            )
          }
        >
          <FaPlay />
        </button>
      </div>
      <div className="w-full px-4">
        <div className="font-bold text-sm md:text-base mt-4">{songName}</div>
      </div>
      <div className="w-full flex justify-between items-center px-4 py-2">
        <span className="text-gray-300 text-xs md:text-sm">{uploadedBy}</span>
        <div className="text-gray-300 text-base flex items-center hidden md:block">
          {isLiked ? (
            <FaHeart className="mx-1" />
          ) : (
            <FaRegHeart className="mx-1" />
          )}
          <div>{formatLikes(likes)}</div>
        </div>
      </div>
    </div>
  );
};

export default Song;
