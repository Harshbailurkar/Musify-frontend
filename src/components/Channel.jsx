import React, { useState } from "react";
import { HiOutlinePlus } from "react-icons/hi";
import { followUser, unfollowUser } from "../API/userAPI.js";

function Channel(props) {
  const [isFollowing, setIsFollowing] = useState(props.isFollowed);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(props.userId);
      } else {
        await followUser(props.userId);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error.message);
      // Handle error gracefully (e.g., show error message to user)
    }
  };

  return (
    <div className="rounded-lg shadow-lg p-4 mb-4 flex items-center bg-gray-800">
      <img
        src={
          props.avatar ||
          "https://avatars.githubusercontent.com/u/149575885?v=4"
        }
        alt=""
        className="w-16 h-16 rounded-full object-cover mr-4"
      />
      <div>
        <h2 className="text-xl text-white font-bold">{props.channelName}</h2>
        <h3 className="text-gray-300">@{props.username}</h3>
        {props.followers !== undefined && (
          <p className="text-gray-300">Followers: {props.followers}</p>
        )}
        <button
          className={`bg-${
            isFollowing ? "gray" : "blue"
          }-500 text-white px-4 py-1 rounded flex items-center`}
          onClick={handleFollowToggle}
        >
          {isFollowing ? "Following" : "Follow"}
          {!isFollowing && <HiOutlinePlus className="ml-1" />}
        </button>
      </div>
    </div>
  );
}

export default Channel;
