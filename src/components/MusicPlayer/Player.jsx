import React, { useEffect } from "react";

const Player = ({
  audioRef,
  activeSong,
  volume,
  isPlaying,
  seekTime,
  repeat,
  onEnded,
  onTimeUpdate,
  onLoadedData,
}) => {
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      if (isPlaying) {
        audioRef.current.play().catch((error) => {
          console.error("Error playing audio:", error);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [volume, isPlaying, activeSong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  }, [seekTime]);

  // Utility function to get the correct URL
  const getSongUrl = (song) => {
    if (song && (song.url || song.songUrl)) {
      return song.url || song.songUrl;
    }
    return "";
  };

  const songUrl = getSongUrl(activeSong);

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src={songUrl}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
        onLoadedData={onLoadedData}
        loop={repeat}
      />
      <button onClick={handlePlay}>Play</button>
    </div>
  );
};

export default Player;
