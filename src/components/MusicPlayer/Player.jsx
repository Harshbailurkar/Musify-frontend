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
        audioRef.current.play();
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

  return (
    <audio
      ref={audioRef}
      src={activeSong.url}
      onEnded={onEnded}
      onTimeUpdate={onTimeUpdate}
      onLoadedData={onLoadedData}
      loop={repeat}
    />
  );
};

export default Player;
