import { useEffect, useState } from "react";
import { getAllListenLaterSong } from "../API/listenLaterAPI";
import ListenLaterGroup from "../assets/images/ListenLaterGroup.svg";
import NotFound from "../assets/images/NotFound.png";
import { useNavigate } from "react-router-dom";

export default function ListenLater() {
  const navigate = useNavigate();
  const [listenLaterSongs, setListenLaterSongs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAllListenLaterSong()
      .then((data) => {
        setListenLaterSongs(data.data);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, []);

  if (error == "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className="mt-28 ml-16 text-white">
      <div className="flex">
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
          <div className="grid grid-cols-1 gap-4">
            {listenLaterSongs.flat().map((song) => (
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
                  {
                    // <button
                    //   onClick={() => toggleLike(song._id)}
                    //   className="ml-4 text-red-500"
                    // >
                    //   {likeStaus ? <FaHeart /> : <FaRegHeart />}
                    // </button>
                  }
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
