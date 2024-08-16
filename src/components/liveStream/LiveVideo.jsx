import React, { useRef } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

export default function LiveVideo({ participant, count }) {
  const videoRef = useRef(null);
  const wrapperRef = useRef(null);

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((track) => track.participant.identity === participant.identity)
    .forEach((track) => {
      if (videoRef.current) {
        track.publication.track?.attach(videoRef.current);
      }
    });
  return (
    <div className="relative h-full w-full" ref={wrapperRef}>
      <video className="w-full h-full object-cover" ref={videoRef} />
      <div className="absolute bottom-4 right-4 text-white bg-black bg-opacity-50 px-2 py-1 rounded">
        Live: {count}
      </div>
    </div>
  );
}
