import { useEffect, useState } from "react";
import {
  getAllListenLaterSong,
  removeSongToListenLater,
} from "../API/listenLaterAPI";
import ListenLaterGroup from "../assets/images/ListenLaterGroup.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";
import { CiSquareRemove } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
export default function ListenLater() {
  const navigate = useNavigate();
  const [listenLaterSongs, setListenLaterSongs] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const getSongs = () => {
    getAllListenLaterSong()
      .then((data) => {
        setLoading(false);
        setListenLaterSongs(data.data);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  };
  useEffect(() => {
    getSongs();
  }, []);

  const handleRemoveSong = async (songId) => {
    try {
      await removeSongToListenLater(songId).then(() => {
        setSuccessMessage("Song removed from Listen Later");
        getSongs();
      });
    } catch (error) {
      setError(error.message);
    }
  };
  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail })); // corrected parameter name id to title
  };

  setTimeout(() => {
    setSuccessMessage(null);
    setError(null);
  }, 4000);
  if (error == "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className=" text-white relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <img
            src={Logo}
            alt="Logo"
            className="animate-pulse max-w-3/4"
            style={{ width: "50%", height: "auto" }}
          />
        </div>
      )}
      {error && error !== "No Songs are availabe" && (
        <h1 className="text-red-500">{error}</h1>
      )}
      {successMessage && (
        <div className="progress-bar-wrapper text-center bg-green-500 brightness-75  ">
          <h1 className="text-neutral-900">{successMessage}</h1>
          <div className="progress-bar" />
        </div>
      )}
      {/* Listen Later Hero*/}
      <div className="flex mt-28 ml-16">
        <img src={ListenLaterGroup} alt="" className="w-44 h-44" />
        <span className="flex flex-col">
          <h1 className="text-6xl pl-20 font-bold">Listen Later</h1>
          <h3 className="text-lg pl-20 pt-3">Auto playlist</h3>
          <h3 className="text-lg pl-20 pt-3">
            {listenLaterSongs.flat().length} songs
          </h3>
        </span>
      </div>
      {listenLaterSongs.flat().length === 0 ? (
        <span className="flex justify-center flex-col items-center mt-20">
          <img src={NotFound} alt="" className="w-36 h-36" />
          <h1 className="text-xl pt-4">Your Listen Later list is empty!</h1>
        </span>
      ) : (
        <div className="pt-14 ml-16">
          <div className="grid grid-cols-1 gap-2">
            {listenLaterSongs.flat().map((song) => (
              <div
                key={song._id}
                className="border border-gray-700 p-4 flex items-center justify-between rounded shadow-md relative"
                onClick={() =>
                  handlePlaySong(
                    song.songUrl,
                    song.title,
                    song.owner,
                    song.ThumbnailUrl || logo
                  )
                }
              >
                <div className="flex items-center">
                  <img
                    src={song.ThumbnailUrl || logo}
                    alt=""
                    className="w-10 h-10 rounded-md mx-2"
                  />
                  <h3 className="text-lg font-semibold pl-10">{song.title}</h3>
                </div>
                <button
                  className="ml-4 text-red-500 mr-10"
                  onClick={() => {
                    handleRemoveSong(song._id);
                  }}
                >
                  <CiSquareRemove size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
