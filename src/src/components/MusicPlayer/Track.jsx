import React from "react";
import logo from "../../assets/images/logo.png";
const Track = ({ isPlaying, isActive, activeSong }) => {
  const getThumbnailUrl = (song) => {
    if (song?.thumbnail) {
      return song.thumbnail;
    } else if (song?.ThumbnailUrl) {
      return song.ThumbnailUrl;
    }
    return "";
  };

  const getSongName = (song) => {
    if (song?.songName) {
      return song.songName;
    } else if (song?.title) {
      return song.title;
    }
    return "No active Song";
  };

  const getUploadedBy = (song) => {
    if (song?.uploadedBy) {
      return song.uploadedBy;
    } else if (song?.owner) {
      return song.owner;
    }
    return "No active Song";
  };

  return (
    <div className="flex-1 flex items-center justify-start">
      <div
        className={`${
          isPlaying && isActive ? "animate-[spin_3s_linear_infinite]" : ""
        } hidden sm:block h-16 w-16 mr-4`}
      >
        {getThumbnailUrl(activeSong) && (
          <img
            src={getThumbnailUrl(activeSong) || logo}
            alt=""
            className="rounded-full"
          />
        )}
      </div>
      <div className="w-[50%]">
        <p className="truncate text-white font-bold text-lg">
          {getSongName(activeSong)}
        </p>
        <p className="truncate text-gray-300">{getUploadedBy(activeSong)}</p>
      </div>
    </div>
  );
};

export default Track;
