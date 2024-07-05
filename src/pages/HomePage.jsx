import React, { useEffect, useState } from "react";
import { getAllSongs } from "../API/songAPI";
import Songs from "../components/Songs";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import musicIcon1 from "../assets/images/musicIcon1.png";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();
  const [songs, setSongs] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Track if more songs are available

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const data = await getAllSongs(page);
        if (data.data.length === 0) {
          setHasMore(false);
          return;
        }

        const newSongs = data.data.filter(
          (newSong) => !songs.some((song) => song._id === newSong._id)
        );

        setSongs((prevSongs) => [...prevSongs, ...newSongs]);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchSongs();
  }, [page]);

  const loadMoreSongs = () => {
    setPage((prevPage) => prevPage + 1);
  };
  if (error == "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div className="flex flex-col flex-1 ">
      <div className="hero-section text-white py-16 px-4 text-center">
        <h2 className="font-bold text-6xl mb-4">Your Music Playground</h2>
        <p className="text-lg">Discover and enjoy the latest music tracks.</p>
      </div>
      <h1 className="text-2xl text-white font-semibold pt-10 pl-10 ">
        Trending Now
      </h1>
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
          />
        ))}
      </div>
      <div className="flex justify-center my-4">
        {hasMore && (
          <button
            onClick={loadMoreSongs}
            className="flex items-center text-blue-200 hover:text-white hover:font-bold"
          >
            <span>Load More</span>
            <HiOutlineArrowSmRight className="ml-2" />
          </button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
