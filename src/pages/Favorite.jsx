import { getAllLikedSong, toggleLikeSong } from "../API/favoriteAPI";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LikedSongs from "../assets/images/LikedSongs.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
export default function Favorite() {
  const [songs, setSongs] = useState([]);
  const [likeStatus, setLikeStatus] = useState(true); // corrected variable name
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getAllLikedSong()
      .then((data) => {
        setLoading(false);
        setSongs(data.data);
        setLikeStatus(true); // corrected variable name
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, [likeStatus]);

  function toggleLike(id) {
    toggleLikeSong(id)
      .then(() => {
        setLikeStatus((prev) => !prev); // corrected variable name
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }

  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail })); // corrected parameter name id to title
  };

  useEffect(() => {
    if (error === "Login required") {
      navigate("/login");
    }
  }, [error, navigate]);

  if (error) {
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
      <div className="mt-28 ml-16 flex">
        <img src={LikedSongs} alt="" draggable="false" />
        <span className="flex flex-col">
          <h1 className="text-6xl pl-20 font-bold">Liked Music</h1>
          <h3 className="text-lg pl-20 pt-3">Auto playlist</h3>
          <h3 className="text-lg pl-20 pt-3">{songs.flat().length} songs</h3>
        </span>
      </div>
      {songs.flat().length === 0 ? (
        <div className="flex justify-center flex-col items-center pt-14">
          <img src={NotFound} alt="" className="w-36 h-36" />
          <h1 className="text-xl pt-4">Your liked list is empty!</h1>
        </div>
      ) : (
        <div className="pt-14 ml-16">
          <div className="grid grid-cols-1 gap-2">
            {songs.flat().map((song) => (
              <div
                key={song._id}
                className="p-4 flex rounded shadow-md items-center justify-between relative border border-gray-700 cursor-pointer"
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
                    draggable="false"
                  />
                  <h3 className="text-lg font-semibold pl-2">{song.title}</h3>
                </div>
                <button
                  onClick={() => toggleLike(song._id)}
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
    </div>
  );
}
