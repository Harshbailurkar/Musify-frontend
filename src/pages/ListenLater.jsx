import { useEffect, useState } from "react";
import {
  getAllListenLaterSong,
  removeSongToListenLater,
} from "../API/listenLaterAPI";
import { getSongById } from "../API/songAPI";
import ListenLaterGroup from "../assets/images/ListenLaterGroup.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";
import { CiSquareRemove } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
import { toast } from "react-toastify";
import SongDescription from "../components/SongDescription";

export default function ListenLater() {
  const navigate = useNavigate();
  const [listenLaterSongs, setListenLaterSongs] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showDescriptionOfSong, setShowDescriptionOfSong] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const dispatch = useDispatch();
  const customId = "custom-id-yes";

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

  const handleRemoveSong = async (e, songId) => {
    e.stopPropagation();
    try {
      await removeSongToListenLater(songId).then(() => {
        setSuccessMessage("Song removed from Listen Later");
        getSongs();
      });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleShowDescriptionOfSong = (songId) => {
    getSongById(songId)
      .then((data) => {
        setCurrentSong(data.data);
        setShowDescriptionOfSong(true);
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail }));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        toastId: customId,
      });
      setSuccessMessage(null);
    }
  }, [successMessage]);
  if (error == "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className="text-white relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <img
            src={Logo}
            alt="Logo"
            className="animate-pulse max-w-3/4"
            style={{ width: "50%", height: "auto" }}
            draggable="false"
          />
        </div>
      )}
      {error && error !== "No Songs are availabe" && (
        <h1 className="text-red-500">{error}</h1>
      )}

      {/* Listen Later Hero*/}
      <div className="mt-10 md:mt-20 ml-0 md:ml-16 flex justify-center md:justify-start">
        <img
          src={ListenLaterGroup}
          alt=""
          className="w-28 md:w-44"
          draggable="false"
        />
        <span className="flex flex-col">
          <h1 className="text-2xl md:text-6xl pl-10 md:pl-20 font-bold">
            Listen Later
          </h1>
          <h3 className="text-lg pl-10 md:pl-20 pt-3">Auto playlist</h3>
          <h3 className="text-lg pl-10 md:pl-20 pt-3">
            {listenLaterSongs.flat().length} songs
          </h3>
        </span>
      </div>
      {listenLaterSongs.flat().length === 0 ? (
        <span className="flex justify-center flex-col items-center mt-20">
          <img src={NotFound} alt="" className="w-36 h-36" draggable="false" />
          <h1 className="text-xl pt-4">Your Listen Later list is empty!</h1>
        </span>
      ) : (
        <div className="pt-14 ml-0 md:ml-16">
          <div className="grid grid-cols-1 gap-2">
            {listenLaterSongs.flat().map((song) => (
              <div
                key={song._id}
                className="border border-gray-700 p-2 md:p-4 flex items-center justify-between rounded shadow-md relative"
                onClick={() => {
                  handleShowDescriptionOfSong(song._id);
                  handlePlaySong(
                    song.songUrl,
                    song.title,
                    song.owner,
                    song.ThumbnailUrl
                  );
                }}
              >
                <div className="flex items-center">
                  <img
                    src={song.ThumbnailUrl || logo}
                    alt=""
                    className="w-10 h-10 rounded-md mx-2"
                  />
                  <h3 className="text-lg font-semibold pl-5 md:pl-10">
                    {song.title}
                  </h3>
                </div>
                <button
                  className="ml-4 text-red-500 mr-10"
                  onClick={(e) => {
                    handleRemoveSong(e, song._id);
                  }}
                >
                  <CiSquareRemove size={22} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Song description */}
      {currentSong && showDescriptionOfSong && (
        <div className="fixed bottom-5 right-3">
          <SongDescription
            close={() => setShowDescriptionOfSong(false)}
            id={currentSong._id}
            title={currentSong.title}
            thumbnail={currentSong.ThumbnailUrl}
            artist={currentSong.artist}
            album={currentSong.album}
            uploadedBy={currentSong.owner}
            likes={currentSong.likesCount}
            songUrl={currentSong.songUrl}
            onSuccess={setSuccessMessage}
            isLiked={currentSong.isLiked}
          />
        </div>
      )}
    </div>
  );
}
