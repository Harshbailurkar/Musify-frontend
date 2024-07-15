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
import SongDescription from "../components/SongDescription";
import logo from "../assets/images/logo.png";

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
  const dispatch = useDispatch();

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
    <div className="text-white relative">
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
      {error && error !== "No Songs are availabe" && (
        <h1 className="text-red-500">{error}</h1>
      )}
      {channel && (
        <div className="flex pt-20 justify-around items-center">
          <div className="flex">
            {/* Channel Avatar */}
            <div className="w-32 h-32">
              <img
                src={
                  channel?.avatar
                    ? channel?.avatar
                    : "https://avatars.githubusercontent.com/u/149575885?v=4"
                }
                alt=""
                className="rounded-full object-cover w-32 h-32"
              />
            </div>

            <div className="ml-10">
              <h1 className="text-5xl p-2 font-bold">{channel.fullName}</h1>
              <span className="flex items-center justify-between">
                <h4 className="pl-2">@{channel.username}</h4>
              </span>
              {/* Followers and following count */}

              <span className="flex pt-1 text-xl">
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
              className="p-2  bg-purple-600 hover:bg-purple-500 h-12 w-28 rounded"
              onClick={handleFollowToggle}
            >
              <h2>Follow</h2>
            </button>
          ) : (
            <button
              className="p-2  bg-gray-600 hover:bg-gray-700 h-12 w-28 rounded"
              onClick={handleFollowToggle}
            >
              <h2>Unfollow</h2>
            </button>
          )}
        </div>
      )}
      {/* songs uploaded by the Artist */}
      <div className="pl-32 pt-16">
        <h3 className="text-2xl font-semibold">Your songs</h3>
        {(error && error === "No Songs are available") ||
        getSongList.length === 0 ? (
          <span className="flex justify-center flex-col items-center">
            <img src={NotFound} alt="" className="w-36 h-36" />
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
                  className="bg-musify-dark w-48 p-4 flex flex-col flex-wrap rounded shadow-md   relative"
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
                      className="w-full h-40 rounded-md "
                    />
                    <h3 className="text-lg font-medium pt-2 text-left">
                      {song.title}
                    </h3>
                    <h3 className="text-sm font-medium pt-2 text-left">
                      from {song.album}
                    </h3>
                    <h3 className="text-sm font-medium pt-2 text-left">
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
