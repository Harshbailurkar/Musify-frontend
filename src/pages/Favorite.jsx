import { getAllLikedSong, toggleLikeSong } from "../API/favoriteAPI";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import LikedSongs from "../assets/images/LikedSongs.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";

export default function Favorite() {
  const [songs, setSongs] = useState([]);
  const [likeStaus, setLikedStatus] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllLikedSong()
      .then((data) => {
        setSongs(data.data);
        setLikedStatus(true);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, [likeStaus]);

  function toggleLike(id) {
    toggleLikeSong(id)
      .then(() => {
        setLikedStatus((pre) => !pre);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }
  if (error == "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }
  return (
    <div className="text-white">
      <div className="mt-28 ml-16 flex">
        <img src={LikedSongs} alt="" />
        <span className="flex flex-col">
          <h1 className="text-6xl pl-20 font-bold">Liked Music</h1>
          <h3 className="text-lg pl-20 pt-3">Auto playlist</h3>
          <h3 className="text-lg pl-20 pt-3">{songs.flat().length} songs</h3>
        </span>
      </div>
      {songs.flat().length === 0 ? (
        <span className="flex justify-center flex-col items-center pt-14">
          <img src={NotFound} alt="" className="w-36 h-36" />
          <h1 className="text-xl pt-4">Your liked list is empty!</h1>
        </span>
      ) : (
        <div className="pt-14 ml-16">
          <div className="grid grid-cols-1 gap-4">
            {songs.flat().map((song) => (
              <div
                key={song._id}
                className="bg-musify-dark p-4 flex rounded shadow-md items-center justify-between relative"
              >
                <div className="flex items-center">
                  <img
                    src={song.ThumbnailUrl}
                    alt=""
                    className="w-10 h-10 rounded-md mx-2"
                  />
                  <h3 className="text-lg font-semibold pl-10">{song.title}</h3>
                  <button
                    onClick={() => toggleLike(song._id)}
                    className="ml-4 text-red-500"
                  >
                    {likeStaus ? <FaHeart /> : <FaRegHeart />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
