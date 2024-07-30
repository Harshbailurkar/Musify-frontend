import React, { useEffect, useState } from "react";
import ConcertHero from "../assets/images/ConcertHero.svg";
import { getLiveStreams } from "../API/streamAPI";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function LiveConcert() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const response = await getLiveStreams();
        setStreams(response.data || []);
        console.log(response.data);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch live streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStreams();
  }, []);
  const handlePayment = (price) => {
    if (price > 0) {
      alert(`Payment of ${price} is successful`);
    }
  };

  const handleStreamPlay = (stream) => {
    console.log(stream);
    navigate(`/stream/${stream.userId._id}`, { state: { stream } });
  };
  if (error === "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }

  return (
    <div>
      {/* hero */}
      <div
        className="w-full min-h-screen m-0 p-0 bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${ConcertHero})` }}
      >
        <div className="ml-20 pt-32">
          <h1 className="text-white text-6xl font-extrabold">
            Experience Live Music
          </h1>
          <h1 className="text-white text-6xl font-extrabold">
            Live Never Before
          </h1>
          <p className="text-white text-lg pt-10 md:w-1/2">
            Transport Yourself to the Front Row! Experience Live Concerts from
            the Comfort of Your Home!
          </p>
          <div className="text-white p-4 bg-slate-900 rounded border mt-10 border-gray-600 w-28 hover:bg-slate-950">
            <a href="#liveStreams">Book Now</a>
          </div>
          <h1 className="text-gray-100 text-2xl p-4 w-auto mt-32 font-bold">
            Live Concerts
          </h1>
        </div>
      </div>
      {/* live streams */}
      <div id="liveStreams" className="flex flex-wrap gap-6 ml-4 mt-6">
        {loading ? (
          <div className="flex flex-wrap gap-6 ml-4 mt-6 items-center justify-center">
            <h1 className="text-2xl font-bold text-white">Loading...</h1>
          </div>
        ) : streams.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <li
                key={stream._id}
                className="relative border border-gray-900 p-3 rounded"
                onClick={() => handlePayment(stream.ticketPrice)}
              >
                <div
                  className="cursor-pointer border border-gray-700 rounded-lg"
                  onClick={() => handleStreamPlay(stream)}
                >
                  <img
                    src={stream.thumbnail || stream.userId.avatar || logo}
                    alt={`${stream.userId.username}'s live stream`}
                    className="w-full h-48 object-cover rounded-lg"
                  />

                  <p className="absolute bottom-2 right-2 bg-red-700 text-white text-sm px-2 py-1 rounded">
                    live
                  </p>
                </div>
                <h2 className="text-lg font-semibold mt-2 text-white">
                  {stream.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {stream.userId.username}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex flex-wrap gap-6 ml-4 mt-6 items-center justify-center">
            <h1 className="text-2xl font-bold text-white">
              No live streams available
            </h1>
          </div>
        )}
      </div>
    </div>
  );
}
