import React, { useState, useRef, useEffect } from "react";
import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import LiveVideo from "./LiveVideo";
import { ClipLoader } from "react-spinners";
import { HiStatusOffline } from "react-icons/hi";
import { MdFullscreen } from "react-icons/md";

export default function Video({ hostName, hostIdentity }) {
  const connectionState = useConnectionState();
  const participants = useParticipants();
  const participant = useRemoteParticipant(hostIdentity);
  const participantCount = participants.length;

  const playerRef = useRef(null);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);
  const handleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else if (playerRef.current) {
      playerRef.current.requestFullscreen();
    }
  };
  useEffect(() => {
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        document.body.classList.remove("fullscreen-landscape");
        document.body.style.overflow = "";
        document.body.style.position = "";
      }
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("mozfullscreenchange", onFullscreenChange);
    document.addEventListener("MSFullscreenChange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        onFullscreenChange
      );
      document.removeEventListener("mozfullscreenchange", onFullscreenChange);
      document.removeEventListener("MSFullscreenChange", onFullscreenChange);
    };
  }, []);
  let content;

  // Host is offline or connection is lost
  if (!participant && connectionState === ConnectionState.Connected) {
    content = (
      <div className="flex flex-col items-center justify-center relative h-full">
        <HiStatusOffline size={60} />
        <p className="text-4xl p-10">Host is offline</p>
        <p className="text-red-400 absolute bottom-4 right-4 text-xs md:text-base">
          Live: {participantCount}
        </p>
      </div>
    );
  }
  // Waiting for tracks to load
  else if (!participant || tracks.length === 0) {
    content = (
      <div className="flex items-center justify-center h-full">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  }
  // Host is online and tracks are available
  else {
    content = <LiveVideo participant={participant} count={participantCount} />;
  }

  return (
    <div className="w-full md:w-2/3">
      <div ref={playerRef}>
        <div className="aspect-video border border-red-950 rounded group relative">
          {content}
        </div>
        <button
          onClick={handleFullscreen}
          className="absolute top-2 left-2 bg-gray-900 text-white p-1 rounded"
          aria-label="Toggle fullscreen"
        >
          <MdFullscreen size={28} />
        </button>
      </div>
    </div>
  );
}
