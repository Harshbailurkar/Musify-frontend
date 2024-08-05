import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Channel from "../components/Channel";
import { getFollowedAccounts } from "../API/userAPI.js";
import { searchQuery, getSongById } from "../API/songAPI.js";
import SongDescription from "../components/SongDescription.jsx";
import { getAllLikedSong } from "../API/favoriteAPI";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import TopArtist from "../components/TopArtist.jsx";
import Logo from "../assets/images/Logo.svg";
import logo from "../assets/images/logo.png";
import { toast } from "react-toastify";
const SearchPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [channels, setChannels] = useState([]);
  const [followedChannels, setFollowedChannels] = useState([]);
  const [showDescriptionOfSong, setShowDescriptionOfSong] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);
  const [isPageLoading, setPageLoading] = useState(true);
  const dispatch = useDispatch();
  const customId = "custom-id-yes";
  const fetchFollowedChannels = async () => {
    try {
      const response = await getFollowedAccounts();
      setFollowedChannels(response.followedUsers);
      setPageLoading(false);
    } catch (error) {
      setPageLoading(false);
      console.error("Error fetching followed channels", error);
    }
  };
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

  useEffect(() => {
    if (!query) {
      fetchFollowedChannels();
    }
  }, [query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) {
      setError("Please enter a search term.");
      return;
    }
    setResults(null);
    setChannels([]);
    setLoading(true);
    setError(null);
    try {
      const response = await searchQuery(query);
      const data = response.data;

      if (data.songs.length > 0 || data.channels.length > 0) {
        const exactUsernameMatch = [];
        const otherChannels = [];

        data.channels.forEach((channel) => {
          if (channel.username.toLowerCase() === query.toLowerCase()) {
            exactUsernameMatch.push(channel);
          } else {
            otherChannels.push(channel);
          }
        });

        exactUsernameMatch.sort((a, b) => b.followerCount - a.followerCount);
        let sortedChannels = [...exactUsernameMatch, ...otherChannels];

        if (exactUsernameMatch.length === 0) {
          sortedChannels = otherChannels.slice(0, 3);
        }

        setResults(data.songs);
        setChannels(sortedChannels);
      } else {
        setError("No results found.");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError("Login required");
      } else if (error.response && error.response.status === 404) {
        setError("No results found.");
      } else {
        setError("Error fetching songs");
      }
    } finally {
      setLoading(false);
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
  const handleSuccessMessage = (message) => {
    setSuccessMessage(message);
  };
  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail }));
  };

  if (error === "Login required") {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 text-white relative custome-bg">
      {isPageLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
          <img
            src={Logo}
            alt="Logo"
            className="animate-pulse max-w-3/4"
            style={{ width: "50%", height: "auto" }}
          />
        </div>
      )}
      <div className="flex flex-col md:flex-row">
        {/* Left Section */}
        <div className="w-full md:w-3/4 pr-4">
          <h1 className="text-5xl font-bold mb-4 mt-10">Search Your Track</h1>
          <form onSubmit={handleSearch} className="mb-4 mt-14">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, artist, album, genre, or language"
              className="border border-gray-500 p-2 rounded-l text-white bg-musify-dark w-3/4 focus:ring-blue-950"
            />
            <button
              type="submit"
              className="bg-neutral-950 text-white p-2 border border-gray-400 rounded-r"
            >
              Search
            </button>
          </form>
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          <div>
            {query && channels.length > 0 && (
              <div className="flex flex-col">
                <h2 className="text-2xl font-bold">Artist Profiles</h2>
                <div className="channels mb-4 gap-10 pt-5 flex flex-wrap">
                  {channels.map((profile, index) => (
                    <Channel
                      userId={profile._id}
                      avatar={profile.avatar}
                      ChannelName={profile.fullName}
                      username={profile.username}
                      followers={profile.followerCount}
                      isFollowed={profile.isfollowed}
                      key={index}
                    />
                  ))}
                </div>
              </div>
            )}
            {!query && followedChannels.length > 0 && (
              <span className="flex flex-col">
                <h2 className="text-2xl font-bold mt-10">Followed Artist</h2>
                <div className="followed-channels mb-4 flex mt-12 gap-10 ">
                  {followedChannels.map((profile, index) => (
                    <Channel
                      userId={profile._id}
                      avatar={profile.avatar}
                      ChannelName={profile.fullName}
                      username={profile.username}
                      isFollowed={true}
                      key={index}
                    />
                  ))}
                </div>
              </span>
            )}
            {!query && followedChannels.length == 0 && (
              <span className="flex flex-col">
                <h2 className="text-2xl font-bold mt-10">Followed Artist</h2>
                <div className="followed-channels mb-4 flex mt-12 gap-10 ">
                  <p className="text-white p-10">No followed artist found</p>
                </div>
              </span>
            )}
            {results && (
              <ul>
                {results.length > 0 &&
                  results.map((result) => (
                    <li
                      key={result._id}
                      className="border-b border-gray-700 p-2 flex items-center"
                      onClick={() => {
                        handlePlaySong(
                          result.songUrl,
                          result.title,
                          result.owner,
                          result.ThumbnailUrl || logo
                        );
                        handleShowDescriptionOfSong(result._id);
                      }}
                    >
                      <img
                        src={result.ThumbnailUrl || logo}
                        alt={result.title}
                        className="w-10 h-10"
                      />
                      <p className="p-2 pl-4">{result.title}</p> by{" "}
                      {result.artist}
                    </li>
                  ))}
              </ul>
            )}
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
        {
          /* Right Section */
          !showDescriptionOfSong && (
            <div className="w-full md:w-1/4">
              <TopArtist />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default SearchPage;
