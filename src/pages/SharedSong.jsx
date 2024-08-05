import React, { useState, useEffect } from "react";
import { getSongById } from "../API/songAPI";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import { FaPlay } from "react-icons/fa";
import logo from "../assets/images/logo.png";

export default function SharedSong() {
  const { songId } = useParams();
  const [song, setSong] = useState(null);
  const [err, setErr] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    getSongById(songId)
      .then((data) => {
        setSong(data.data);
      })
      .catch((err) => {
        setErr(err.message || "Failed to fetch song");
      });
  }, [songId]);

  useEffect(() => {
    if (err === "Login Required") {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    }
  }, [err, navigate]);

  const handlePlayButton = (id, url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ id, url, songName, uploadedBy, thumbnail }));
  };

  return (
    <div className="flex items-center justify-center pt-16">
      <div className="flex flex-col items-center justify-center h-auto bg-gray-900 text-white p-4 w-3/4 md:w-1/3 rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center px-2">
          {song?.title}
        </h1>
        <div className="relative flex items-center justify-center mt-4">
          <img
            src={song?.ThumbnailUrl || logo}
            alt="thumbnail"
            className="w-56 h-56 rounded-lg mb-4"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              className="w-16 h-16 bg-green-500 text-black rounded-full flex items-center justify-center opacity-100  transition-opacity"
              onClick={(e) =>
                handlePlayButton(
                  songId,
                  song?.songUrl,
                  song?.title,
                  song?.owner,
                  song?.ThumbnailUrl
                )
              }
            >
              <FaPlay size={22} />
            </button>
          </div>
        </div>
        <p className="text-md mb-2">Uploaded By: {song?.owner}</p>
        <p className="text-md mb-2">Artists: {song?.artist}</p>
        <p className="text-md text-gray-400">Album: {song?.album}</p>
      </div>
    </div>
  );
}
