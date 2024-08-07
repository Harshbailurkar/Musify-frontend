import { useEffect, useState } from "react";
import { getAllLikedSong, toggleLikeSong } from "../API/favoriteAPI";
import { getSongById } from "../API/songAPI";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LikedSongs from "../assets/images/LikedSongs.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
import SongDescription from "../components/SongDescription";

export default function Favorite() {
  const [songs, setSongs] = useState([]);
  const [likeStatus, setLikeStatus] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [showDescriptionOfSong, setShowDescriptionOfSong] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllLikedSong()
      .then((data) => {
        setLoading(false);
        setSongs(data.data);
        setLikeStatus(true);
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, [likeStatus]);

  function toggleLike(e, id) {
    e.stopPropagation();
    toggleLikeSong(id)
      .then(() => {
        setLikeStatus((prev) => !prev);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }

  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail }));
  };

  useEffect(() => {
    if (error === "Login required") {
      navigate("/login");
    }
  }, [error, navigate]);

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

  if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className="text-white relative p-4 pt-10 md:pt-0">
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
      <div className="mt-10 md:mt-20 ml-0 md:ml-16 flex justify-center md:justify-start">
        <img
          src={LikedSongs}
          alt=""
          draggable="false"
          className="w-28 md:w-44"
        />
        <span className="flex flex-col">
          <h1 className=" text-2xl md:text-6xl pl-10 md:pl-20 font-bold">
            Liked Music
          </h1>
          <h3 className="text-lg pl-10 md:pl-20 pt-3">Auto playlist</h3>
          <h3 className="text-lg pl-10 md:pl-20 pt-3">
            {songs.flat().length} songs
          </h3>
        </span>
      </div>
      {songs.flat().length === 0 ? (
        <div className="flex justify-center flex-col items-center pt-14">
          <img
            src={NotFound}
            alt=""
            className="w-20 mt-20 md:mt-10 md:w-36 h-20 md:h-36"
          />
          <h1 className="text-xl pt-4">Your liked list is empty!</h1>
        </div>
      ) : (
        <div className="pt-14 ml-0 md:ml-16">
          <div className="grid grid-cols-1 gap-2">
            {songs.flat().map((song) => (
              <div
                key={song._id}
                className="p-2 md:p-4 flex rounded shadow-md items-center justify-between relative border border-gray-700 cursor-pointer"
                onClick={() => {
                  handleShowDescriptionOfSong(song._id);
                  handlePlaySong(
                    song.songUrl,
                    song.title,
                    song.owner,
                    song.ThumbnailUrl || logo
                  );
                }}
              >
                <div className="flex items-center">
                  <img
                    src={song.ThumbnailUrl || logo}
                    alt=""
                    className="w-10 h-10 rounded-md mx-2"
                    draggable="false"
                  />
                  <h3 className="text-lg font-semibold pl-2">{song.title}</h3>
                </div>
                <button
                  onClick={(e) => toggleLike(e, song._id)}
                  className="mr-16 text-red-500"
                >
                  {likeStatus ? (
                    <FaHeart size={20} />
                  ) : (
                    <FaRegHeart size={20} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
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
            isLiked={currentSong.isLiked}
          />
        </div>
      )}
    </div>
  );
}
