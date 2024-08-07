import React, { useEffect, useState } from "react";
import ConcertHero from "../assets/images/ConcertHero.svg";
import { getLiveStreams, getUserPaidStreams } from "../API/streamAPI";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { checkoutSession } from "../API/checkoutAPI";
import PaymentModal from "../components/PaymentModal";

export default function LiveConcert() {
  const [streams, setStreams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paidStreams, setPaidStreams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStream, setSelectedStream] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLiveStreams = async () => {
      try {
        const response = await getLiveStreams();
        setStreams(response.data || []);
        const paidStreamsResponse = await getUserPaidStreams();
        setPaidStreams(paidStreamsResponse.data || []);
      } catch (error) {
        setError(error.message);
        console.error("Failed to fetch live streams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStreams();
  }, []);

  const handlePayment = async (price, title, id, streamId) => {
    if (price > 0) {
      try {
        const response = await checkoutSession(title, price, id, streamId);
        const { url } = response.data;
        window.location.href = url;
      } catch (error) {
        console.error(
          "Error during checkout session:",
          error.response ? error.response.data : error.message
        );
      }
    }
  };

  const handleStreamPlay = (id) => {
    navigate(`/stream/${id}`);
  };

  const handleStreamClick = (price, title, id, streamId) => {
    const isPaid = paidStreams.some((item) => item.userId === id);
    if (price <= 0) {
      handleStreamPlay(id);
    } else if (isPaid) {
      handleStreamPlay(id);
    } else {
      setSelectedStream({ price, title, id, streamId });
      setIsModalOpen(true);
    }
  };

  const handleProceedToPay = () => {
    const { price, title, id, streamId } = selectedStream;
    handlePayment(price, title, id, streamId);
    setIsModalOpen(false);
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
      {/* Hero Section */}
      <div
        className="w-full pt-20 p-4 md:pt-0 min-h-screen m-0  bg-no-repeat bg-cover"
        style={{ backgroundImage: `url(${ConcertHero})` }}
      >
        <div className=" md:ml-20 md:pt-32">
          <h1 className="text-white text-4xl md:text-6xl font-extrabold">
            Experience Live Music
          </h1>
          <h1 className="text-white text-4xl md:text-6xl font-extrabold">
            Live Never Before
          </h1>
          <p className="text-white text-sm md:text-lg pt-5 md:pt-10 md:w-1/2">
            Transport Yourself to the Front Row! Experience Live Concerts from
            the Comfort of Your Home!
          </p>
          <div className="text-white p-2 md:p-4 bg-slate-900 rounded border mt-10 border-gray-600 w-24 md:w-28 hover:bg-slate-950">
            <a href="#liveStreams">Book Now</a>
          </div>
          <h1 className="text-gray-100 text-2xl md:text-3xl p-4 w-auto mt-16 md:mt-32 font-bold">
            Live Concerts
          </h1>
        </div>
      </div>
      {/* Live Streams Section */}
      <div id="liveStreams" className="flex flex-wrap gap-6 ml-4 md:mt-6">
        {loading ? (
          <div className="flex flex-wrap gap-6 ml-4 md:mt-6 items-center justify-center">
            <h1 className="text-2xl font-bold text-white">Loading...</h1>
          </div>
        ) : streams.length ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {streams.map((stream) => (
              <li
                key={stream._id}
                className="relative border border-gray-900 p-3 rounded"
                onClick={() =>
                  handleStreamClick(
                    stream.ticketPrice,
                    stream.title,
                    stream.userId._id,
                    stream._id
                  )
                }
              >
                <div className="cursor-pointer border border-gray-700 rounded-lg">
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
      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
        price={selectedStream?.price}
        onProceedToPay={handleProceedToPay}
      />
    </div>
  );
}
