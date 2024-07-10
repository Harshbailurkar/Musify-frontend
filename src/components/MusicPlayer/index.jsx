import React, { useEffect } from "react";
import { useMusicPlayer } from "../MusicPlayerContext";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";

const MusicPlayer = () => {
  const { currentSong, isPlaying, setIsPlaying } = useMusicPlayer();

  useEffect(() => {
    if (currentSong) {
      setIsPlaying(true);
    }
  }, [currentSong]);

  const handlePlayPause = () => {
    if (!currentSong) return;
    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    // Implement next song logic
  };

  const handlePrevSong = () => {
    // Implement previous song logic
  };

  return (
    currentSong && (
      <div className="fixed bottom-0 left-0 right-0 bg-black p-4 z-50">
        <div className="flex items-center justify-between">
          <Track
            isPlaying={isPlaying}
            isActive={!!currentSong}
            activeSong={currentSong}
          />
          <div className="flex-1 flex flex-col items-center justify-center">
            <Controls
              isPlaying={isPlaying}
              isActive={!!currentSong}
              handlePlayPause={handlePlayPause}
              handlePrevSong={handlePrevSong}
              handleNextSong={handleNextSong}
            />
            <Seekbar
              value={30}
              min="0"
              max="100"
              onInput={() => {}}
              setSeekTime={() => {}}
              appTime={0}
            />
          </div>
          <VolumeBar
            value={30}
            min="0"
            max="100"
            onChange={() => {}}
            setVolume={() => {}}
          />
        </div>
      </div>
    )
  );
};

export default MusicPlayer;
