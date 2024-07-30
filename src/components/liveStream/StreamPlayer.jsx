import React from "react";
import { useParams } from "react-router-dom";
import { useViewerToken } from "../../hooks/useViewerToken";
import Video from "./Video";
import { LiveKitRoom } from "@livekit/components-react";
import { ClipLoader } from "react-spinners";
import "@livekit/components-styles";

export default function StreamPlayer({ stream }) {
  const { id } = useParams();
  const { token, identity, loading, error } = useViewerToken(id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    ); // Display loading state with spinner
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        Error loading stream
      </div>
    ); // Display error if exists
  }

  if (!token || !identity) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cannot watch the stream
      </div>
    );
  }

  return (
    <div>
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="container"
      >
        <div className="space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10">
          <Video
            hostName={stream.userId.username}
            hostIdentity={stream.userId._id}
          />
        </div>
      </LiveKitRoom>
    </div>
  );
}
