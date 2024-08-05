import React, { useEffect, useState } from "react";
import { getAllSongs, getSongById } from "../API/songAPI";
import Songs from "../components/Songs";
import { useNavigate } from "react-router-dom";
import { category } from "../assets/constant";
import SongDescription from "../components/SongDescription";
import SongDescriptionForMobile from "../components/songDescriptionForMobile";
import { getAllLikedSong } from "../API/favoriteAPI";
import Logo from "../assets/images/Logo.svg";
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const HomePage = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [showDescriptionOfSong, setShowDescriptionOfSong] = useState(false);
  const [descriptionOfSongForMobile, setDescriptionOfSongForMobile] =
    useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setLoading] = useState(true); // State to track loading state
  const [totalSongs, setTotalSongs] = useState(0);
  const [largeScreen, setLargeScreen] = useState(window.innerWidth >= 768);
  const TotalNumberOfpages = Math.ceil(totalSongs / 24);
  const customId = "custom-id-yes";
  useEffect(() => {
    const handleResize = () => {
      setLargeScreen(window.innerWidth >= 768); // Adjust the width as needed
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  /* Fetch all songs */
  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs(page);
        setTotalSongs(data.message);
        setSongs(data.data);
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError(error.message);
        setLoading(false); // Set loading to false on error
      }
    };

    fetchSongs();
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const showDescriptionOfSongForMobile = (songId) => {
    getSongById(songId)
      .then((data) => {
        setCurrentSong(data.data);
        setDescriptionOfSongForMobile(true);
      })
      .catch((error) => {
        setError(error.message);
      });
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

  const renderPagination = () => {
    const pages = [];
    const showPages = 8;

    if (TotalNumberOfpages <= showPages) {
      for (let i = 1; i <= TotalNumberOfpages; i++) {
        pages.push(
          <button
            key={i}
            className={`${
              i === page
                ? "bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded m-2"
                : "bg-slate-200 hover:bg-white text-black px-4 py-2 rounded m-2"
            }`}
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          className={`${
            1 === page
              ? "bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded m-2"
              : "bg-white text-black px-4 py-2 rounded m-2"
          }`}
          onClick={() => setPage(1)}
        >
          1
        </button>
      );

      if (page > 4) {
        pages.push(
          <span key="start-ellipsis" className="px-4 py-2 m-2">
            ...
          </span>
        );
      }

      const start = Math.max(2, page - 3);
      const end = Math.min(TotalNumberOfpages - 1, page + 3);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            className={`${
              i === page
                ? "bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded"
                : "bg-white text-black px-4 py-2 rounded"
            }`}
            onClick={() => setPage(i)}
          >
            {i}
          </button>
        );
      }

      if (page < TotalNumberOfpages - 3) {
        pages.push(
          <span key="end-ellipsis" className="px-4 py-2">
            ...
          </span>
        );
      }

      pages.push(
        <button
          key={TotalNumberOfpages}
          className={`${
            TotalNumberOfpages === page
              ? "bg-yellow-500 text-white px-4 py-2 rounded"
              : "bg-white text-black px-4 py-2 rounded"
          }`}
          onClick={() => setPage(TotalNumberOfpages)}
        >
          {TotalNumberOfpages}
        </button>
      );
    }

    return pages;
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
      setSuccessMessage(null); // Clear success message to prevent multiple toasts
    }
  }, [successMessage]);

  return (
    <div className="flex flex-col flex-1 relative">
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

      {/* Hero section */}
      <div className="hero-section text-white py-16 px-4 text-center rounded">
        <h2 className="font-bold text-5xl md:text-6xl mb-4">
          Your Music Playground
        </h2>
        <p className="text-lg">Discover and enjoy the latest music tracks.</p>
      </div>

      {/* Song category */}
      <div className="flex m-3 md:m-10 md:mt-20 flex-wrap">
        {category.map((items) => (
          <div
            key={items.name}
            className="text-white border hidden md:block border-yellow-800 rounded flex m-2 p-2 px-4"
          >
            <a href={`#${items.name}`}>
              <p>{items.name}</p>
            </a>
          </div>
        ))}
      </div>

      <h1 className="Trending text-2xl text-white font-semibold md:pt-10 md:pl-10">
        Most Popular
      </h1>

      {/* Songs */}
      <div
        className="flex flex-wrap sm:justify-start justify-center p-3"
        id="songs"
      >
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
            showDescriptionOfSongForMobile={() =>
              showDescriptionOfSongForMobile(song._id)
            }
            isLiked={isLiked(song._id)}
            handleLikeSong={() => handleLikeSong(song._id)}
            screenSize={largeScreen}
          />
        ))}
      </div>

      {/* Song description */}
      {currentSong && showDescriptionOfSong && (
        <div className="fixed flex justify-center md:bottom-5 md:right-3">
          <SongDescription
            close={() => setShowDescriptionOfSong(false)}
            id={currentSong._id}
            title={currentSong.title}
            thumbnail={currentSong.ThumbnailUrl}
            artist={currentSong.artist}
            album={currentSong.album}
            uploadedBy={currentSong.owner}
            likes={currentSong.likesCount}
            onSuccess={handleSuccessMessage}
            isLiked={isLiked(currentSong._id)}
          />
        </div>
      )}
      {currentSong && descriptionOfSongForMobile && (
        <SongDescriptionForMobile
          close={() => setDescriptionOfSongForMobile(false)}
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
        />
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center mt-10">
        <button
          className="bg-yellow-700 hover:bg-yellow-500 w-10 h-10 flex justify-center items-center text-white p-2 rounded-full mr-2"
          onClick={() => setPage((prev) => prev - 1)}
          disabled={page === 1}
        >
          <HiArrowNarrowLeft />
        </button>
        {renderPagination()}
        <button
          className="bg-yellow-700 hover:bg-yellow-500 text-white px-2 py-2 rounded-full ml-2 w-10 h-10 flex justify-center items-center"
          onClick={() => {
            setPage((prev) => prev + 1);
            window.scrollTo(0, 0);
          }}
          disabled={page === TotalNumberOfpages}
        >
          <HiArrowNarrowRight />
        </button>
      </div>
    </div>
  );
};

export default HomePage;
