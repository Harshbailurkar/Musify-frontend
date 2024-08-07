import React, { useState, useRef } from "react";
import { IoCopyOutline, IoCopy } from "react-icons/io5";
import { useLocation } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { createStream, createIngress, stopStream } from "../API/streamAPI";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

export default function GoLive() {
  const [buttonText, setButtonText] = useState("Save");
  const [instruction, setInstruction] = useState(null);
  const [instruction2, setInstruction2] = useState(null);
  const [isUrlCopied, setIsUrlCopied] = useState(false);
  const [isKeyCopied, setIsKeyCopied] = useState(false);
  const [streamUrl, setStreamUrl] = useState(
    localStorage.getItem("streamUrl") || ""
  );
  const [streamKey, setStreamKey] = useState(
    localStorage.getItem("streamKey") || ""
  );
  const [expectsTickets, setExpectsTickets] = useState(false);
  const [entryFee, setEntryFee] = useState("");
  const [error, setError] = useState("");
  const urlRef = useRef(null);
  const keyRef = useRef(null);
  const location = useLocation();
  const userInfo = location.state;
  const [streamUrlKeyGenBtnText, setStreamUrlKeyGenBtnText] = useState(
    "Generate Stream URL and Key"
  );
  const [clearBtnText, setClearBtnText] = useState("Clear");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: `${userInfo.username}'s Live Concert`,
    description: `Hey, I am ${userInfo.username} and I am going to perform live in this concert. Join me and enjoy the music.`,
    thumbnail: null,
  });

  const handleGoLive = async (e) => {
    e.preventDefault();
    setButtonText("getting ready please wait ..");
    const streamData = {
      ...formData,
      expectsTickets,
      entryFee: expectsTickets ? entryFee : 0, // Ensure entryFee is included only if expectsTickets is true
    };
    console.log(streamData);

    await createStream(streamData)
      .then((data) => {
        setButtonText("You are almost there");
        setInstruction(
          "Now generate your stream URL and key, add it to your streaming software, and start streaming."
        );
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      });
  };

  const generateIngress = async (e) => {
    e.preventDefault();
    setStreamUrlKeyGenBtnText("Generating...");
    await createIngress()
      .then((data) => {
        setStreamUrlKeyGenBtnText("Regenerate");
        setInstruction(null);
        setInstruction2(
          "Your stream URL and key have been generated successfully. Copy them and add them to your streaming software, then start streaming."
        );
        setStreamUrl(data.url);
        setStreamKey(data.streamKey);

        localStorage.setItem("streamUrl", data.url);
        localStorage.setItem("streamKey", data.streamKey);
      })
      .catch((error) => setError(error.message));
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

  const copyText = (text, setCopiedState, e) => {
    e.preventDefault();
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedState(true);
        setTimeout(() => {
          setCopiedState(false);
        }, 1000);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  const onDropThumbnail = (acceptedFiles) => {
    setFormData({ ...formData, thumbnail: acceptedFiles[0] });
  };

  const {
    getRootProps: getRootPropsThumbnail,
    getInputProps: getInputPropsThumbnail,
  } = useDropzone({ onDrop: onDropThumbnail });

  const handleStopStream = (e, id) => {
    e.preventDefault();
    setClearBtnText("Clearing...");
    stopStream(id)
      .then(() => {
        setClearBtnText("Cleared");
      })
      .catch((error) => {
        alert("Failed to stop stream: " + error.message);
      });
  };
  if (error === "Login required") {
    navigate("/login");
  } else if (error) {
    return (
      <div className="error text-red-500 text-4xl text-center">{error}</div>
    );
  }
  if (!userInfo) {
    return (
      <div className="text-white align-middle text-center flex flex-col justify-center items-center my-32">
        <h1 className="text-4xl">This Page Cannot be accessed from here!</h1>
        <p className="py-5">
          Go to{" "}
          <a href="/user" className="font-bold text-blue-500">
            {" "}
            user profile
          </a>{" "}
          and then start your concert
        </p>
      </div>
    );
  }

  return (
    <div className="bg-black relative p-10 pt-16 md:pt-10 border border-gray-700 rounded min-h-full text-white">
      <button onClick={() => navigate("/user")}>
        <FaArrowLeftLong className="text-xl text-white" />
      </button>
      <div>
        <h1 className="text-3xl">
          Organize Your Concert for Free! In just 2 steps
        </h1>

        <form className="mt-10">
          <p className="text-gray-200 text-lg">
            Step 1: add your Concert details
          </p>
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex flex-col lg:w-1/2">
              <label htmlFor="stream-name" className="p-1 text-gray-300">
                Concert Name
              </label>
              <input
                type="text"
                id="stream-name"
                className="p-2 w-full rounded bg-gray-900 text-gray-300 my-2"
                defaultValue={`${userInfo.username}'s Live Concert`}
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
                  <label htmlFor="entryFee" className="p-1">
                    Entry Fee (in INR)
                  </label>
                  {error && <p className="text-red-500">{error}</p>}
                  <input
                    type="number"
                    id="entryFee"
                    className="p-2 w-full rounded bg-gray-900 text-gray-300 my-2"
                    value={entryFee}
                    onChange={(e) => handleEntryFeeChange(e)}
                  />
                  <p>
                    before you start new stream let clear the cache data to
                    except fresh payment
                  </p>
                  <button
                    className="p-1 rounded m-2 mx-0 bg-red-950 "
                    onClick={(e) => handleStopStream(e, userInfo._id)}
                  >
                    {clearBtnText}
                  </button>
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
                defaultValue={`Hey, I am ${userInfo.username} and I am going to perform live in this concert. Join me and enjoy the music.`}
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
                    Drag & drop a thumbnail image here, or click to select one
                  </p>
                )}
              </div>
            </div>
          </div>

          <button
            className="bg-purple-950 hover:bg-purple-900 p-2 rounded my-2"
            onClick={handleGoLive}
          >
            {buttonText}
          </button>
          {instruction && <p className="text-gray-400 my-2">{instruction}</p>}
        </form>
        <p className="text-gray-200 text-lg mt-6">
          Step 2: Generate your stream URL and key
        </p>
        <button
          className="bg-purple-950 hover:bg-purple-900 p-2 rounded my-2"
          onClick={generateIngress}
        >
          {streamUrlKeyGenBtnText}
        </button>
        {instruction2 && <p className="text-gray-400 my-2">{instruction2}</p>}
        {streamUrl && streamKey && (
          <div>
            <div className="my-4 flex items-center">
              <input
                type="text"
                readOnly
                value={streamUrl}
                className="flex-grow bg-gray-900 text-gray-300 p-2 rounded-l border border-gray-700"
                ref={urlRef}
                onFocus={(e) => e.target.select()}
              />
              <button
                className="p-2 text-gray-500 border border-gray-700"
                onClick={(e) => copyText(streamUrl, setIsUrlCopied, e)}
              >
                {isUrlCopied ? (
                  <IoCopy className="text-2xl" />
                ) : (
                  <IoCopyOutline className="text-2xl" />
                )}
              </button>
            </div>
            <div className="my-4 flex items-center">
              <input
                type="password"
                readOnly
                value={streamKey}
                className="flex-grow bg-gray-900 text-gray-300 p-2 rounded-l border border-gray-700"
                ref={keyRef}
                onFocus={(e) => e.target.select()}
              />
              <button
                className="p-2 text-gray-500 border border-gray-700"
                onClick={(e) => copyText(streamKey, setIsKeyCopied, e)}
              >
                {isKeyCopied ? (
                  <IoCopy className="text-2xl" />
                ) : (
                  <IoCopyOutline className="text-2xl" />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
      <button
        className="text-white rounded p-2 border border-gray-700 mt-5 bg-blue-950 hover:bg-blue-900"
        onClick={() => navigate("/manageStream", { state: userInfo })}
      >
        Manage Your Stream
      </button>
    </div>
  );
}
