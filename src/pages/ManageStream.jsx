import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StreamPlayer from "../components/liveStream/StreamPlayer";
import { getStreamById, stopStream, createStream } from "../API/streamAPI";
import { useDropzone } from "react-dropzone";

export default function ManageStream() {
  const location = useLocation();
  const userInfo = location.state;
  const id = userInfo._id;
  const [stream, setStream] = useState(null);
  const navigate = useNavigate();
  const [clearBtnText, setClearBtnText] = useState("Clear");
  const [buttonText, setButtonText] = useState("Save");
  const [expectsTickets, setExpectsTickets] = useState(false);
  const [entryFee, setEntryFee] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStream = async () => {
      try {
        const response = await getStreamById(id);
        setStream(response.data);
      } catch (error) {
        console.error("Failed to fetch stream:", error.message);
        if (error.message === "payment required") {
          console.log("Error: payment required for this stream");
          navigate(`/stream/accessdenied`);
        } else if (error.message === "Login required") {
          navigate("/login");
        } else if (error.message === "Stream Not Found") {
          navigate("/resultNotFound");
        } else {
          console.error("Unexpected error:", error);
        }
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

  const onDropThumbnail = (acceptedFiles) => {
    setFormData({ ...formData, thumbnail: acceptedFiles[0] });
  };

  const {
    getRootProps: getRootPropsThumbnail,
    getInputProps: getInputPropsThumbnail,
  } = useDropzone({ onDrop: onDropThumbnail });

  const [formData, setFormData] = useState({
    title: `${userInfo.username}'s Live Concert`,
    description: `Hey, I am ${userInfo.username} and I am going to perform live in this concert. Join me and enjoy the music.`,
    thumbnail: null,
  });

  const handleGoLive = async (e) => {
    e.preventDefault();
    setButtonText("updating ..");
    const streamData = {
      ...formData,
      expectsTickets,
      entryFee: expectsTickets ? entryFee : 0,
    };

    try {
      await createStream(streamData);
      setButtonText("saved");
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const handleEntryFeeChange = (e) => {
    const value = e.target.value;
    if (value <= 0) {
      setError("Entry fee must be greater than 0.");
    } else {
      setError("");
    }
    setEntryFee(value);
  };
  console.log(stream);

  return (
    <div className="bg-gray-950">
      <div className="flex flex-col lg:flex-row bg-gray-950">
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
            Streaming software after that click on the stop stream button below
            to completely end your stream.
          </p>
          <button
            className="text-white p-2 m-2 bg-red-900 h-14 rounded"
            onClick={() => handleStopStream(id)}
          >
            Stop Stream
          </button>
        </div>
      </div>
      {stream && (
        <form className="mt-10 p-2 md:px-10">
          <p className="text-white text-2xl py-5">Update Your Concert Info</p>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col lg:w-1/2">
              <label htmlFor="stream-name" className="p-1 text-gray-300">
                Concert Name
              </label>
              <input
                type="text"
                id="stream-name"
                className="p-2 w-full rounded bg-gray-900 text-gray-300 my-2"
                defaultValue={stream.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
              <label
                htmlFor="expectsTickets"
                className="p-1 mt-2 text-gray-300"
              >
                Do you expect attendees to purchase tickets for this concert?
              </label>
              <div className="my-2 text-gray-400">
                <label className="mr-2">
                  <input
                    type="radio"
                    name="expectsTickets"
                    value="yes"
                    checked={expectsTickets === true}
                    onChange={() => setExpectsTickets(true)}
                  />
                  Yes
                </label>
                <label className="ml-4">
                  <input
                    type="radio"
                    name="expectsTickets"
                    value="no"
                    checked={expectsTickets === false}
                    onChange={() => setExpectsTickets(false)}
                  />
                  No
                </label>
              </div>
              {expectsTickets && (
                <div className="mt-2 text-gray-300">
                  <p>
                    Before you start a new stream, clear the cache data to
                    expect fresh payment.
                    <br />{" "}
                    <p className="pt-3 text-gray-400">
                      Note: if you want to charge existing particient again then
                      click on clear else No need to clear.
                    </p>
                  </p>
                  <button
                    className="p-1 px-5 rounded m-2 mx-0 bg-red-950"
                    onClick={(e) => handleStopStream(e, userInfo._id)}
                  >
                    {clearBtnText}
                  </button>
                  <br />
                  <label htmlFor="entryFee" className="p-1">
                    Entry Fee (in INR)
                  </label>
                  {error && <p className="text-red-500">{error}</p>}
                  <input
                    type="number"
                    id="entryFee"
                    className="p-2 w-full rounded bg-gray-900 text-gray-300 my-2"
                    value={entryFee}
                    onChange={handleEntryFeeChange}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-col lg:w-1/2">
              <label htmlFor="description" className="p-1 text-gray-300">
                Description
              </label>
              <textarea
                id="description"
                className="p-2 w-full rounded bg-gray-900 text-gray-300 my-2"
                rows="3"
                defaultValue={stream.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              ></textarea>
              <label
                htmlFor="concert-thumbnail"
                className="p-1 mt-2 text-gray-300"
              >
                Concert Thumbnail
              </label>
              <div
                {...getRootPropsThumbnail()}
                className="flex items-center justify-center h-16 w-full lg:w-auto p-3 rounded-md bg-neutral-950 text-white border border-gray-700 focus:outline-none focus:border-teal-500 text-center cursor-pointer"
              >
                <input
                  {...getInputPropsThumbnail({
                    accept: "image/*",
                    name: "thumbnail",
                  })}
                />
                {formData?.thumbnail ? (
                  <p>{formData?.thumbnail.name}</p>
                ) : (
                  <p>
                    Drag & drop a thumbnail image here, or click to select an
                    image
                  </p>
                )}
              </div>
            </div>
          </div>
          <button
            className="bg-teal-600 text-white mt-10 mb-20 px-10 py-2 rounded-md"
            onClick={handleGoLive}
          >
            {buttonText}
          </button>
        </form>
      )}
    </div>
  );
}
