import React, { useState, useEffect, useRef } from "react";
import Controls from "./Controls";
import Player from "./Player";
import Seekbar from "./Seekbar";
import Track from "./Track";
import VolumeBar from "./VolumeBar";

// Dummy data for testing purposes
const dummySongs = [
  {
    id: 1,
    title: "Song 1",
    subtitle: "Artist 1",
    uri: "http://res.cloudinary.com/dya4fdqnr/video/upload/v1719423201/wj6uxlkxjoh68qcpdahr.mp4",
    coverart:
      "https://res.cloudinary.com/dya4fdqnr/image/upload/v1719423202/lxzjhd7ulvxftax6ouir.jpg",
  },
  {
    id: 2,
    title: "Song 2",
    subtitle: "Artist 2",
    uri: "http://res.cloudinary.com/dya4fdqnr/video/upload/v1719423201/wj6uxlkxjoh68qcpdahr.mp4",
    coverart:
      "https://res.cloudinary.com/dya4fdqnr/image/upload/v1719423202/lxzjhd7ulvxftax6ouir.jpg",
  },
  // Add more songs as needed
];

const MusicPlayer = () => {
  const [currentSongs, setCurrentSongs] = useState(dummySongs);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeSong, setActiveSong] = useState(dummySongs[0]);
  const [duration, setDuration] = useState(0);
  const [seekTime, setSeekTime] = useState(0);
  const [appTime, setAppTime] = useState(0);
  const [volume, setVolume] = useState(0.3);
  const [repeat, setRepeat] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  useEffect(() => {
    if (currentSongs.length) setIsActive(true);
  }, [currentIndex]);

  const handlePlayPause = () => {
    if (!isActive) return;

    setIsPlaying(!isPlaying);
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
          appTime={appTime}
        />
        <Player
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
  );
};

export default MusicPlayer;
