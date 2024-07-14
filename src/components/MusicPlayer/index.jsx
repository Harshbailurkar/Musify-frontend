import React, { useState, useEffect, useRef } from "react";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import { useSelector } from "react-redux";

const MusicPlayer = () => {
  const songObject = useSelector((state) => state.musicData);
  const [currentSongs, setCurrentSongs] = useState([songObject]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeSong, setActiveSong] = useState(songObject);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(
    localStorage.getItem("isSidebarCollapsed") === "true"
  );
  const audioRef = useRef(null); // Ref for the audio element

  useEffect(() => {
    const handleStorageChange = () => {
      setIsSidebarCollapsed(
        localStorage.getItem("isSidebarCollapsed") === "true"
      );
    };

    window.addEventListener("isSidebarCollapsedChange", handleStorageChange);

    return () => {
      window.removeEventListener(
        "isSidebarCollapsedChange",
        handleStorageChange
      );
    };
  }, []);

  // Effect to handle songObject change
  useEffect(() => {
    const songData = [songObject];
    setCurrentSongs(songData);
    setCurrentIndex(0);
    setActiveSong(songObject);
    setIsActive(true);
    setIsPlaying(true); // Start playing the new song
  }, [songObject]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play(); // Play the audio when isPlaying is true
    }
  }, [isPlaying, activeSong]);

  const handlePlayPause = () => {
    if (!isActive) return;

    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    setIsPlaying(false);

    if (!shuffle) {
      setCurrentIndex((currentIndex + 1) % currentSongs.length);
    } else {
      setCurrentIndex(Math.floor(Math.random() * currentSongs.length));
    }

    setActiveSong(currentSongs[currentIndex]);
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      setCurrentIndex(currentSongs.length - 1);
    } else if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * currentSongs.length));
    } else {
      setCurrentIndex(currentIndex - 1);
    }

    setActiveSong(currentSongs[currentIndex]);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 left-auto ${
        isSidebarCollapsed ? "w-11/12" : "w-10/12"
      } z-50 bg-gray-950 text-white p-3`}
    >
      <div className="relative sm:px-12 px-8 w-full flex items-center justify-between">
        <Track
          isPlaying={isPlaying}
          isActive={isActive}
          activeSong={activeSong}
        />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Controls
            isPlaying={isPlaying}
            isActive={isActive}
            repeat={repeat}
            setRepeat={setRepeat}
            shuffle={shuffle}
            setShuffle={setShuffle}
            currentSongs={currentSongs}
            handlePlayPause={handlePlayPause}
            handlePrevSong={handlePrevSong}
            handleNextSong={handleNextSong}
          />
          <Seekbar
            value={appTime}
            min="0"
            max={duration}
            onInput={(event) => setSeekTime(event.target.value)}
            setSeekTime={setSeekTime}
            appTime={setAppTime}
          />
          <Player
            audioRef={audioRef} // Pass the audioRef to the Player component
            activeSong={activeSong}
            volume={volume}
            isPlaying={isPlaying}
            seekTime={seekTime}
            repeat={repeat}
            onEnded={handleNextSong}
            onTimeUpdate={(event) => setAppTime(event.target.currentTime)}
            onLoadedData={(event) => setDuration(event.target.duration)}
          />
        </div>
        <VolumeBar
          value={volume}
          min="0"
          max="1"
          onChange={(event) => setVolume(event.target.value)}
          setVolume={setVolume}
        />
      </div>
    </div>
  );
};

export default MusicPlayer;
