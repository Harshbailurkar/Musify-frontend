import React, { useState, useEffect, useRef } from "react";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";
import { useSelector } from "react-redux";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const MusicPlayer = () => {
  const songData = useSelector((state) => state.musicData);
  const [currentSongs, setCurrentSongs] = useState(
    Array.isArray(songData) ? songData : [songData]
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeSong, setActiveSong] = useState(currentSongs[0]);
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
  const [showPlayer, setShowPlayer] = useState(true);
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
    setCurrentSongs(Array.isArray(songData) ? songData : [songData]);
    setCurrentIndex(0);
    setActiveSong(Array.isArray(songData) ? songData[0] : songData);
    setIsActive(true);
    setIsPlaying(true); // Start playing the new song
  }, [songData]);

  const getSongUrl = (song) => {
    if (song && (song.url || song.songUrl)) {
      return song.url || song.songUrl;
    }
    return "";
  };

  useEffect(() => {
    if (audioRef.current) {
      const songUrl = getSongUrl(activeSong);
      audioRef.current.src = songUrl;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((error) => {});
      }
    }
  }, [activeSong]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch((error) => {});
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!isActive) return;

    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    if (currentIndex === currentSongs.length - 1) {
      // If the current song is the last one, stop playing
      setIsPlaying(false);
    } else {
      const nextIndex = shuffle
        ? Math.floor(Math.random() * currentSongs.length)
        : (currentIndex + 1) % currentSongs.length;
      setIsPlaying(false);

      setTimeout(() => {
        setCurrentIndex(nextIndex);
        setActiveSong(currentSongs[nextIndex]);
        setIsPlaying(true);
      }, 1000);
    }
  };

  const handlePrevSong = () => {
    if (currentIndex === 0) {
      setCurrentIndex(currentSongs.length - 1);
    } else if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * currentSongs.length));
    } else {
      setCurrentIndex(currentIndex - 1);
    }
    setIsPlaying(false);

    setTimeout(() => {
      setActiveSong(currentSongs[currentIndex]);
      setIsPlaying(true);
    }, 1000);
  };

  return (
    <div
      className={`fixed bottom-0 right-0 left-auto ${
        isSidebarCollapsed ? "w-11/12" : "w-10/12"
      } z-50 bg-gray-950 text-white p-3 border-t border-gray-800`}
    >
      <div
        className={`relative sm:px-12 px-8 w-full flex items-center justify-between ${
          !showPlayer ? "hidden" : ""
        }`}
      >
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
        <div className="ml-20" onClick={() => setShowPlayer(false)}>
          <FaChevronDown />
        </div>
      </div>

      {!showPlayer && (
        <div
          className="flex justify-center absolute right-14 bottom-1"
          onClick={() => setShowPlayer(true)}
        >
          <FaChevronUp />
        </div>
      )}
    </div>
  );
};

export default MusicPlayer;
