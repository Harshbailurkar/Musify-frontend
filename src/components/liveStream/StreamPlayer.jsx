import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { useViewerToken } from "../../hooks/useViewerToken";
import Video from "./Video";
import { LiveKitRoom } from "@livekit/components-react";
import { ClipLoader } from "react-spinners";
import "@livekit/components-styles";
import { MdFullscreen } from "react-icons/md";

export default function StreamPlayer({ stream, sid }) {
  const { id: paramId } = useParams();
  const id = paramId || sid;
  const { token, identity, loading, error } = useViewerToken(id);
  const playerRef = useRef(null);

  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      // Exit fullscreen mode
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        // Firefox
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        // Chrome, Safari and Opera
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        // IE/Edge
        document.msExitFullscreen();
      }

      // Remove fullscreen class
      document.body.classList.remove("fullscreen-landscape");
      document.body.style.overflow = "";
      document.body.style.position = "";
    } else {
      // Enter fullscreen mode
      if (playerRef.current) {
        if (playerRef.current.requestFullscreen) {
          playerRef.current.requestFullscreen();
        } else if (playerRef.current.mozRequestFullScreen) {
          // Firefox
          playerRef.current.mozRequestFullScreen();
        } else if (playerRef.current.webkitRequestFullscreen) {
          // Chrome, Safari and Opera
          playerRef.current.webkitRequestFullscreen();
        } else if (playerRef.current.msRequestFullscreen) {
          // IE/Edge
          playerRef.current.msRequestFullscreen();
        }

        // Apply fullscreen class
        document.body.classList.add("fullscreen-landscape");
        document.body.style.overflow = "hidden";
        document.body.style.position = "fixed";
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-4 pt-10">
        <ClipLoader size={50} color={"#123abc"} loading={loading} />
      </div>
    ); // Display loading state with spinner
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        Error loading stream
      </div>
    ); // Display error if exists
  }

  if (!token || !identity) {
    return (
      <div className="flex items-center justify-center h-full">
        Cannot watch the stream
      </div>
    );
  }

  return (
    <div ref={playerRef} className="w-full h-full relative">
      <LiveKitRoom
        token={token}
        serverUrl={import.meta.env.VITE_PUBLIC_LIVEKIT_URL}
        data-lk-theme="default"
        className="w-full h-full"
      >
        <div className="w-full h-full">
          <Video
            hostName={stream.userId.username}
            hostIdentity={stream.userId._id}
          />
        </div>
      </LiveKitRoom>
      <button
        onClick={handleFullscreen}
        className="absolute top-2 right-2 bg-gray-900 text-white p-1 rounded"
      >
        <MdFullscreen size={28} />
      </button>
    </div>
  );
}
