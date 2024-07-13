import React, { useEffect, useState } from "react";
import { getAllSongs, getSongById } from "../API/songAPI";
import Songs from "../components/Songs";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import { category } from "../assets/constant";
import SongDescription from "../components/SongDescription";
import { getAllLikedSong } from "../API/favoriteAPI";
import Logo from "../assets/images/Logo.svg";

const HomePage = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showDescriptionOfSong, setShowDescriptionOfSong] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setLoading] = useState(true); // State to track loading state

  /* Fetch all songs */
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs(page);
        setSongs(data.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchSongs();
  }, [page]);

  /* Fetch all liked songs */
  useEffect(() => {
    getAllLikedSong()
      .then((data) => {
        setLikedSongs(data.data);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, [showDescriptionOfSong]);

  const handleSuccessMessage = (message) => {
    setSuccessMessage(message);
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

  const handleLikeSong = async (songId) => {
    try {
      await toggleLikeSong(songId);
      const updatedSongs = songs.map((song) =>
        song._id === songId ? { ...song, isLiked: !song.isLiked } : song
      );
      setSongs(updatedSongs);
    } catch (error) {
      console.log(error.message);
    }
  };

  const isLiked = (songId) => {
    return likedSongs.some((likedArray) =>
      likedArray.some((likedSong) => likedSong._id === songId)
    );
  };

  if (error === "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  setTimeout(() => {
    setSuccessMessage(null);
  }, 5000);

  return (
    <div className="flex flex-col flex-1 relative">
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

      {successMessage && (
        <div className="progress-bar-wrapper text-center bg-green-500 brightness-75">
          <h1 className="text-neutral-900">{successMessage}</h1>
          <div className="progress-bar" />
        </div>
      )}

      {/* Hero section */}
      <div className="hero-section text-white py-16 px-4 text-center">
        <h2 className="font-bold text-6xl mb-4">Your Music Playground</h2>
        <p className="text-lg">Discover and enjoy the latest music tracks.</p>
      </div>

      {/* Song category */}
      <div className="flex m-10 mt-20">
        {category.map((items) => (
          <div
            key={items.name}
            className="text-white border border-yellow-800 rounded flex m-2 p-2 px-4"
          >
            <a href={`#${items.name}`}>
              <p>{items.name}</p>
            </a>
          </div>
        ))}
      </div>

      <h1 className="Trending text-2xl text-white font-semibold pt-10 pl-10">
        Most Popular
      </h1>

      {/* Songs */}
      <div className="flex flex-wrap sm:justify-start justify-center p-3">
        {songs.map((song) => (
          <Songs
            key={song._id}
            id={song._id}
            songName={song.title}
            thumbnail={song.ThumbnailUrl}
            artist={song.artist}
            uploadedBy={song.owner}
            likes={song.likesCount}
            url={song.songUrl}
            handleShowDescriptionOfSong={() =>
              handleShowDescriptionOfSong(song._id)
            }
            isLiked={isLiked(song._id)}
            handleLikeSong={() => handleLikeSong(song._id)}
          />
        ))}
      </div>

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
            onSuccess={handleSuccessMessage}
            isLiked={isLiked(currentSong._id)}
            handleLikeSong={() => handleLikeSong(currentSong._id)}
          />
        </div>
      )}
    </div>
  );
};

export default HomePage;
