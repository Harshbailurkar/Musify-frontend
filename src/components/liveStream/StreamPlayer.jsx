import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useViewerToken } from "../../hooks/useViewerToken";
import Video from "./Video";
import { LiveKitRoom } from "@livekit/components-react";
import { ClipLoader } from "react-spinners";
import "@livekit/components-styles";
import { getChannel, followUser, unfollowUser } from "../../API/userAPI";
import Chat from "./Chat";

export default function StreamPlayer({ stream, sid, isManaging }) {
  const { id: paramId } = useParams();
  const id = paramId || sid;
  const { token, identity, loading, error } = useViewerToken(id);
  const [channel, setChannel] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    getChannel(stream.userId.username)
      .then((res) => {
        setChannel(res.data);
        setIsFollowing(res.data.isFollowed || false);
      })
      .catch((err) => console.log(err));
  }, [stream.userId.username]);

  const handleFollowToggle = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(channel._id);
      } else {
        await followUser(channel._id);
      }
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error("Failed to toggle follow:", error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4 pt-10">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        Error loading stream
      </div>
    );
  }

  if (!token || !identity) {
    return (
      <div className="flex items-center justify-center h-full">
        Cannot watch the stream
      </div>
    );
  }

  return (
    <div>
      <div>
        <LiveKitRoom
          token={token}
          serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          className="w-full h-full"
        >
          <div className="w-full h-full flex flex-col md:flex-row">
            <Video
              hostName={stream.userId.username}
              hostIdentity={stream.userId._id}
            />
            <Chat
              hostName={stream.userId.username}
              hostIdentity={stream.userId._id}
            />
          </div>
        </LiveKitRoom>
      </div>
      {!isManaging && (
        <div className="flex m-4 items-center">
          <div className="relative inline-block">
            <img
              src={channel?.avatar}
              alt="channel avatar"
              className="w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-red-600"
            />
            <p className="absolute bottom-0 right-1 md:right-5 border-2 border-gray-900 bg-red-600 text-white text-xs md:text-sm font-bold px-2  rounded-lg shadow-md">
              Live
            </p>
          </div>
          <div className="flex flex-col justify-center ml-4">
            <h1 className="text-white text-2xl">{channel?.fullName}</h1>
            <p className="text-white text-sm p-2">
              Followers: {channel?.followerCount}
            </p>
          </div>
          <button
            className={`p-2 ml-10 text-white text-sm sm:text-base ${
              isFollowing
                ? "bg-gray-600 hover:bg-gray-700"
                : "bg-purple-600 hover:bg-purple-500"
            } md:h-1/2 rounded transition ease-in-out duration-200`}
            onClick={handleFollowToggle}
            aria-label={isFollowing ? "Unfollow channel" : "Follow channel"}
          >
            <h2>{isFollowing ? "Unfollow" : "Follow"}</h2>
          </button>
        </div>
      )}
    </div>
  );
}
