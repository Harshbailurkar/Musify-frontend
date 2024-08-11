import React from "react";
import { useParams } from "react-router-dom";
import { getChannel, getFollowedAccounts } from "../API/userAPI";
import { followUser, unfollowUser } from "../API/userAPI.js";
import NotFound from "../assets/images/NotFound.png";
import { getSongByOwner, getSongById } from "../API/songAPI.js";
import { getAllLikedSong } from "../API/favoriteAPI";
import SearchBar from "../components/Searchbar";
import Logo from "../assets/images/Logo.svg";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import SongDescription from "../components/songs/SongDescription.jsx";
import logo from "../assets/images/logo.png";
import { toast } from "react-toastify";

export default function ArtistProfile() {
  const { username } = useParams();
  const [channel, setChannel] = React.useState(null);
  const [error, setError] = React.useState(null);
  const [isFollowing, setIsFollowing] = React.useState(false);
  const [followedChannels, setFollowedChannels] = React.useState([]);
  const [getSongList, setSongList] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isLoading, setLoading] = React.useState(true);
  const [showDescriptionOfSong, setShowDescriptionOfSong] =
    React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(null);
  const [likedSongs, setLikedSongs] = React.useState([]);
  const [currentSong, setCurrentSong] = React.useState(null);
  const customId = "custom-id-yes";

  const dispatch = useDispatch();
  React.useEffect(() => {
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
  React.useEffect(() => {
    getChannel(username)
      .then((data) => {
        setLoading(false);
        setChannel(data.data);
      })
      .catch((err) => setError(err.message));
  }, [followedChannels]);
  React.useEffect(() => {
    getFollowedAccounts()
      .then((data) => {
        setLoading(false);
        setFollowedChannels(data.followedUsers);
        if (data.followedUsers.some((user) => user.username === username)) {
          setIsFollowing(true);
        }
      })
      .catch((err) => console.error(err));
  }, [isFollowing]);
  React.useEffect(() => {
    getSongByOwner(username)
      .then((data) => {
        setSongList(data.data);
      })
      .catch((err) => setError(err.message));
  }, [channel]);
  React.useEffect(() => {
    getAllLikedSong()
      .then((data) => {
        setLikedSongs(data.data);
      })
      .catch((error) => {
        setError(error.message);
        console.log("Error from our side! Please refresh.");
      });
  }, [showDescriptionOfSong]);
  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(channel._id).then(() =>
          setIsFollowing(!isFollowing)
        );
      } else {
        await followUser(channel._id).then(() => setIsFollowing(!isFollowing));
      }
    } catch (error) {
      console.log(error);
      console.error("Failed to toggle follow:", error.message);
      // Handle error gracefully (e.g., show error message to user)
    }
  };
  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  const handlePlaySong = (url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ url, songName, uploadedBy, thumbnail }));
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
  const isLiked = (songId) => {
    return likedSongs.some((likedArray) =>
      likedArray.some((likedSong) => likedSong._id === songId)
    );
  };

  const filteredSongs = getSongList.filter((song) =>
    song.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="text-white relative p-4 mt-10 md:mt-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50">
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
      {
        <div className="w-full h-32 md:h-52 ">
          <div className="bg-gray-800 w-auto h-full md:mx-10 rounded-lg">
            {channel?.coverPhoto && (
              <img
                src={channel.coverPhoto}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            )}
          </div>
        </div>
      }
      {channel && (
        <div className="flex pt-5 justify-around items-center">
          <div className="flex">
            {/* Channel Avatar */}
            <div className="w-16 md:w-32 h-auto md:h-32">
              <img
                src={
                  channel?.avatar
                    ? channel?.avatar
                    : "https://avatars.githubusercontent.com/u/149575885?v=4"
                }
                alt=""
                className="rounded-full object-cover mt-5 md:mt-0 w-16 md:w-32 h-auto md:h-32"
              />
            </div>

            <div className="ml-5 md:ml-10">
              <h1 className="text-xl md:text-5xl p-2 font-bold">
                {channel.fullName}
              </h1>
              <span className="flex items-center justify-between">
                <h4 className="pl-2">@{channel.username}</h4>
              </span>
              {/* Followers and following count */}

              <span className="flex pt-1 text-sm md:text-xl">
                <h4 className="pl-2 pt-1 px-6">
                  Followers: {channel ? channel.followerCount : "loading..."}
                </h4>
                <h4 className="pl-2 pt-1">
                  Following: {channel ? channel.followingCount : "loading..."}
                </h4>
              </span>
            </div>
          </div>
          {!isFollowing ? (
            <button
              className="p-1 md:p-2 text-sm sm:text-base bg-purple-600 hover:bg-purple-500 md:h-12 md:w-28 rounded"
              onClick={handleFollowToggle}
            >
              <h2>Follow</h2>
            </button>
          ) : (
            <button
              className="p-1 md:p-2 text-sm sm:text-base bg-gray-600 hover:bg-gray-700 md:h-12 md:w-28 rounded"
              onClick={handleFollowToggle}
            >
              <h2>Unfollow</h2>
            </button>
          )}
        </div>
      )}
      {/* songs uploaded by the Artist */}
      <div className="pt-5 md:pl-32 md:pt-16">
        <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
          Songs from {username}
        </h3>
        {(error && error === "No Songs are available") ||
        getSongList.length === 0 ? (
          <span className="flex justify-center flex-col items-center">
            <img
              src={NotFound}
              alt=""
              className="w-20 mt-20 md:mt-10 md:w-36 h-20 md:h-36"
            />
            <h1 className="text-xl pt-4">
              {error ? error : "No songs uploaded yet!"}
            </h1>
          </span>
        ) : null}

        {/* Display songs uploaded by the user */}
        {getSongList.length > 0 && (
          <div className="pt-5">
            <SearchBar searchQuery={searchQuery} handleSearch={handleSearch} />
            <div className="flex flex-wrap gap-4 pt-10">
              {filteredSongs.map((song) => (
                <div
                  className="bg-musify-dark w-32 md:w-52 p-4 flex flex-col flex-wrap rounded shadow-md   relative"
                  key={song._id}
                  onClick={() => {
                    handlePlaySong(
                      song.songUrl,
                      song.title,
                      song.owner,
                      song.ThumbnailUrl
                    );
                    handleShowDescriptionOfSong(song._id);
                  }}
                >
                  <div className="flex flex-col ">
                    <img
                      src={song.ThumbnailUrl ? song.ThumbnailUrl : logo}
                      alt=""
                      className="w-full h-22 md:h-44 rounded-md"
                    />
                    <h3 className="text-base md:text-lg font-medium md:pt-2 text-left">
                      {song.title}
                    </h3>
                    <h3 className="text-sm font-medium md:pt-2 text-left">
                      from {song.album}
                    </h3>
                    <h3 className="text-sm font-medium md:pt-2 text-left">
                      Likes :{" " + song.likesCount}
                    </h3>
                  </div>
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
              onSuccess={handleSuccessMessage}
              isLiked={isLiked(currentSong._id)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
