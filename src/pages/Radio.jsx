import radioData from "../assets/radioData";
import { useState, useRef } from "react";
import { FaPlay, FaPause } from "react-icons/fa";

export default function Radio() {
  const [songUrl, setSongUrl] = useState("");
  const [isAutoplay, setIsAutoplay] = useState(false);
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const audioRef = useRef(null);

  function playsong(url, id) {
    setSongUrl(url);
    setIsLoading(true);
    setIsAutoplay(true);
    setCurrentSongId(id);
    setIsError(false);

    if (audioRef.current) {
      audioRef.current.load(); // Reset the audio element to load the new song

      audioRef.current.play().catch((error) => {
        console.error("Failed to start playback:", error);
        setIsLoading(false);
        setIsError(true);
      });
    }
  }

  function togglePlayPause() {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsAutoplay(true);
    } else {
      audioRef.current.pause();
      setIsAutoplay(false);
    }
  }

  function CustomeControllerChange(event) {
    const progress = event.target.value;
    audioRef.current.currentTime = progress;
  }

  function handleLoadStart() {
    setIsLoading(true);
  }

  function handleLoadedData() {
    setIsLoading(false);
  }

  function handleError() {
    console.error("Failed to load the audio");
    setIsLoading(false);
    setIsError(true);
    setTimeout(() => {
      setIsError(false);
    }, 5000); // Hide the error message after 5 seconds
  }

  return (
    <div className="content text-white">
      <div className="PlaylistsHero">
        <div className="pt-2 pb-44 ml-16">
          <div className="ml-4 w-3/4 pt-10">
            <h1 className="text-4xl font-extrabold">
              Online Live radio from India
            </h1>
            <br />
            <div>
              {radioData.map((radio) => {
                return (
                  <div
                    key={radio.id}
                    className={`flex flex-row items-center justify-between p-4 ${
                      currentSongId === radio.id ? "bg-blue-900" : ""
                    }`}
                    onClick={() => playsong(radio.url, radio.id)}
                  >
                    <div className="flex flex-row items-center">
                      <img
                        src={radio.image}
                        alt={radio.title}
                        className="w-16 h-16 rounded-md"
                      />
                      <div className="ml-4">
                        <h2 className="text-xl font-semibold">{radio.title}</h2>
                      </div>
                    </div>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                      <FaPlay />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="audio-player">
          {songUrl && (
            <div>
              <audio
                controls={false} // Hide default controls
                autoPlay={isAutoplay}
                onEnded={() => {
                  setIsAutoplay(false);
                  setIsError(false);
                }}
                ref={audioRef}
                onLoadedData={handleLoadedData}
                onLoadStart={handleLoadStart}
                onError={handleError}
              >
                <source src={songUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <div className="custom-controls flex flex-col align-middle items-start">
                <button
                  onClick={togglePlayPause}
                  className="custom-play-pause-btn"
                >
                  {isAutoplay ? <FaPause /> : <FaPlay />}
                </button>

                {audioRef.current && (
                  <input
                    type="range"
                    min="0"
                    max={
                      isNaN(audioRef.current.duration)
                        ? "0"
                        : audioRef.current.duration.toString()
                    }
                    step="1"
                    value={audioRef.current.currentTime}
                    onChange={CustomeControllerChange}
                    id="progress"
                  />
                )}
              </div>
              <div
                className="red-progress-bar"
                style={{ width: `${isLoading ? "100%" : "0"}` }}
              ></div>
              {isError && (
                <div className="error-message text-center pr-48">
                  <h1 className="text-xl text-red-600">
                    Unable to reach the Radio Station. Please try again later.
                  </h1>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
