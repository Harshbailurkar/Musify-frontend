// CustomPlayer.js
import React, { useContext } from "react";
import { SongContext } from "../SongContext";

const CustomPlayer = () => {
  const { selectedTrack, setSelectedTrack } = useContext(SongContext);

  const playSong = (songUrl) => {
    setSelectedTrack(songUrl);
  };

  const pauseSong = () => {
    setSelectedTrack(null);
  };

  return (
    <div className="player">
      {/* Your player UI */}
      <button onClick={() => playSong("song-url.mp3")}>Play</button>
      <button onClick={pauseSong}>Pause</button>
    </div>
  );
};

export default CustomPlayer;
