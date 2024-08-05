import radioData from "../assets/radioData";
import { useState } from "react";
import { FaPlay, FaPause } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";

export default function Radio() {
  const [currentSongId, setCurrentSongId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const dispatch = useDispatch();

  function togglePlayPause(id, url, songName, uploadedBy, thumbnail) {
    if (currentSongId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setCurrentSongId(id);
      setIsPlaying(true);
      dispatch(setMusicData({ url, songName, uploadedBy, thumbnail }));
    }
  }

  return (
    <div className="content text-white">
      <div className="PlaylistsHero">
        <div className="pt-2 pb-44 ml-0 md:ml-16">
          <div className="ml:0 md:ml-4 w-full md:w-3/4 py-5 md:pt-10">
            <h1 className="text-4xl font-extrabold">
              Online Live radio from India
            </h1>
            <br />
            <div>
              {radioData.map((radio) => {
                const isCurrentSongPlaying =
                  currentSongId === radio.id && isPlaying;
                return (
                  <div
                    key={radio.id}
                    className={`flex flex-row items-center justify-between p-2 md:p-4 ${
                      currentSongId === radio.id ? "bg-blue-900" : ""
                    }`}
                    onClick={() =>
                      togglePlayPause(
                        radio.id,
                        radio.url,
                        radio.title,
                        radio.title,
                        radio.image
                      )
                    }
                  >
                    <div className="flex flex-row items-center">
                      <img
                        src={radio.image}
                        alt={radio.title}
                        className="w-10 md:w-16 h-10 md:h-16 rounded-md"
                      />
                      <div className="ml-4">
                        <h2 className=" text-sm md:text-xl font-semibold">
                          {radio.title}
                        </h2>
                      </div>
                    </div>
                    <button className="bg-blue-500 text-white px-2 md:px-4 py-1 md:py-2 rounded-md">
                      {isCurrentSongPlaying ? <FaPause /> : <FaPlay />}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
