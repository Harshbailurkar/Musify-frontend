import React from "react";
import { ConnectionState, Track } from "livekit-client";
import {
  useConnectionState,
  useRemoteParticipant,
  useTracks,
} from "@livekit/components-react";
import LiveVideo from "./LiveVideo";
import { ClipLoader } from "react-spinners";
import { HiStatusOffline } from "react-icons/hi";

export default function Video({ hostName, hostIdentity }) {
  const connectionState = useConnectionState();
  const participent = useRemoteParticipant(hostIdentity);

  const tracks = useTracks([
    Track.Source.Camera,
    Track.Source.Microphone,
  ]).filter((track) => track.participant.identity === hostIdentity);

  let content;
  if (!participent && connectionState === ConnectionState.Connected) {
    content = (
      <div className="flex flex-col items-center justify-center h-full">
        <HiStatusOffline size={60} />
        <p className="text-4xl p-10">Host is offline</p>
      </div>
    );
  } else if (!participent && tracks.length === 0) {
    content = (
      <div className="flex items-center justify-center h-full">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );
  } else {
    content = <LiveVideo participant={participent} />;
  }
  return <div className="aspect-video border-b group relative">{content}</div>;
}
