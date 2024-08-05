import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StreamPlayer from "../components/liveStream/StreamPlayer";
import { getStreamById } from "../API/streamAPI";
import { useNavigate } from "react-router-dom";
export default function StreamPage() {
  const [stream, setStream] = useState(null);
  const { id } = useParams();
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
  }, [id]); // Ensure the effect runs again if id changes

  return (
    <div>
      {stream ? <StreamPlayer stream={stream} /> : <p>Loading stream...</p>}
    </div>
  );
}
