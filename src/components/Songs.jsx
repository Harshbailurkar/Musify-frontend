import React from "react";
import { HiOutlineHeart } from "react-icons/hi";
import { FaPlay } from "react-icons/fa";

const Song = ({ songName, thumbnail, artist, uploadedBy, likes }) => {
  const [showDesState, setShowDesState] = React.useState(false);
  if (songName.length > 20) {
    songName = songName.substring(0, 14) + "...";
  }

  function ShowDes() {
    setShowDesState(true);
    console.log("ShowDesState: ", showDesState);
  }

  return (
    <div
      className="group w-40 max-w-sm flex flex-col items-center rounded overflow-hidden shadow-lg bg-musify-dark text-white m-4 transition transform hover:scale-105 hover:shadow-xl"
      onClick={ShowDes}
    >
      <div className="relative w-32 h-32 flex items-center justify-center mt-4">
        <img
          className="w-full h-full object-cover"
          src={thumbnail}
          alt={songName}
        />
        <button className="absolute bottom-0 right-0  w-12 h-12 m-2 bg-green-500 text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <FaPlay />
        </button>
      </div>
      <div className="w-full px-4">
        <div className="font-bold mt-4">{songName}</div>
      </div>
      <div className="w-full flex justify-between items-center px-4 py-2">
        <span className="text-gray-300 text-sm">{uploadedBy}</span>
        <div className="text-gray-300 text-base flex items-center">
          <HiOutlineHeart className="mr-1" />
          {likes}
        </div>
      </div>
    </div>
  );
};

export default Song;
