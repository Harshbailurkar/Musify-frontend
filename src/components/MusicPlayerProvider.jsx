import React, { useState, useContext, useEffect } from "react";

// Create a context for the music player
const MusicPlayerContext = React.createContext();

export const useMusicPlayer = () => {
  return useContext(MusicPlayerContext);
};

export const MusicPlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const savedSong = JSON.parse(localStorage.getItem("currentSong"));
    const savedIsPlaying = JSON.parse(localStorage.getItem("isPlaying"));
    if (savedSong) setCurrentSong(savedSong);
    if (savedIsPlaying) setIsPlaying(savedIsPlaying);
  }, []);

  useEffect(() => {
    localStorage.setItem("currentSong", JSON.stringify(currentSong));
    localStorage.setItem("isPlaying", JSON.stringify(isPlaying));
  }, [currentSong, isPlaying]);

  const handleSongClick = (song) => {
    setCurrentSong(song);
    setIsPlaying(true);
  };

  return (
    <MusicPlayerContext.Provider
      value={{ currentSong, isPlaying, setIsPlaying, handleSongClick }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
};
