import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Channel from "../components/Channel";
import { getFollowedAccounts } from "../API/userAPI.js";
import { searchQuery } from "../API/songAPI.js";
const SearchPage = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [channels, setChannels] = useState([]);
  const [followedChannels, setFollowedChannels] = useState([]);

  const fetchFollowedChannels = async () => {
    try {
      const response = await getFollowedAccounts();
      setFollowedChannels(response.followedUsers);
    } catch (error) {
      console.error("Error fetching followed channels", error);
    }
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

  if (error === "Login required") {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-4 text-white">
      <h1 className="text-5xl font-bold mb-4 mt-10">Search Your Track</h1>
      <form onSubmit={handleSearch} className="mb-4 mt-14">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, artist, album, genre, or language"
          className="border border-gray-500 p-2 rounded-l text-white bg-musify-dark w-1/2 focus:ring-blue-950"
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
          <div className="channels mb-4 flex gap-10 pt-5">
            <h2 className="text-2xl font-bold">Artist Profiles</h2>
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
        )}
        {!query && followedChannels.length > 0 && (
          <span>
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
          <span>
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
                <li key={result._id} className="border-b p-2 flex items-center">
                  <img
                    src={result.ThumbnailUrl}
                    alt={result.title}
                    className="w-10 h-10"
                  />
                  <p className="p-2 pl-4">{result.title}</p> by {result.artist}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
