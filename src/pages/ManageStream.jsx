import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreamPlayer from "../components/liveStream/StreamPlayer";
import { getStreamById } from "../API/streamAPI";
import { stopStream } from "../API/streamAPI";

export default function ManageStream() {
  const location = useLocation();
  const getUser = location.state;
  const id = getUser._id;
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await getStreamById(id);
        setStream(response.data);
      } catch (error) {
        if (error.message === "payment required") {
          console.log("Error: payment required for this stream");
          navigate(`/stream/accessdenied`);
        } else if (error.message === "Login required") {
          navigate("/login");
        } else if (error.message === "Stream Not Found") {
          navigate("/resultNotFound");
        }
        console.error("Failed to fetch stream:", error);
      }
    };
    fetchStream();
  }, [id, navigate]);

  const handleStopStream = (id) => {
    stopStream(id)
      .then(() => navigate("/user"))
      .catch((error) => {
        alert("Failed to stop stream: " + error.message);
      });
  };
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-950">
      <div className="flex flex-col w-full lg:w-1/2 h-full p-4">
        <h1 className="text-white mb-4 text-3xl font-bold">Your Stream</h1>
        <div className="flex-1 border border-gray-700 rounded">
          {stream ? (
            <StreamPlayer stream={stream} sid={id} />
          ) : (
            <p className="text-white">Loading stream...</p>
          )}
        </div>
      </div>
      <div className="flex flex-col w-full lg:w-1/2 p-4 pt-14">
        <p className="text-white p-2 mb-4">
          Note: To end Your Stream, You have to stop streaming from Your
          Streaming software after that click on the stop stream button below to
          completely end your stream.
        </p>
        <button
          className="text-white p-2 m-2 bg-red-900 h-14 rounded"
          onClick={() => handleStopStream(id)}
        >
          Stop Stream
        </button>
      </div>
    </div>
  );
}
