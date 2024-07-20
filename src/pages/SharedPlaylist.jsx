import React from "react";
import { getPlaylistById } from "../API/playlistAPI";
import { useParams } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setMusicData } from "../Redux/Slices/musicData";
import { useNavigate } from "react-router-dom";

export default function SharedPlaylist() {
  const navigate = useNavigate();
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = React.useState(null);
  const [playlistThumbnail, setPlaylistThumbnail] = React.useState(null);
  const [error, setError] = React.useState(null);
  const dispatch = useDispatch();

  React.useEffect(() => {
    getPlaylistById(playlistId)
      .then((data) => {
        setPlaylist(data.data);
        if (data.data.songs && data.data.songs.length > 0) {
          setPlaylistThumbnail(data.data.songs[0].ThumbnailUrl || logo);
        } else {
          setPlaylistThumbnail(logo); // Set default logo if there are no songs
        }
      })
      .catch((error) => {
        setError(error.message || "Failed to fetch playlist");
      });
  }, [playlistId]);

  React.useEffect(() => {
    if (error === "Login Required") {
      sessionStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
    }
  }, [error, navigate]);

  const handlePlayPlaylist = () => {
    dispatch(setMusicData(playlist.songs));
  };

  const handlePlaySong = (id, url, songName, uploadedBy, thumbnail) => {
    dispatch(setMusicData({ id, url, songName, uploadedBy, thumbnail }));
  };

  return (
    <div className="text-white">
      <div className="bg-slate-900 p-5">
        <div className="flex items-center">
          <img src={playlistThumbnail || logo} alt="" className="w-28" />
          <span className="mx-5">
            <h1 className="text-5xl p-2 font-bold">{playlist?.name}</h1>
            <h2 className="p-2"> {playlist?.owner?.username}</h2>
            <button
              className="bg-green-500 text-black mx-5 mt-5 p-4 rounded-full"
              onClick={handlePlayPlaylist}
            >
              <FaPlay />
            </button>
          </span>
        </div>
      </div>
      <div className="pt-14">
        <div className="grid grid-cols-1 gap-2 items-center">
          {playlist?.songs && playlist?.songs.length > 0 ? (
            playlist.songs.map((song) => (
              <div
                key={song._id}
                className="flex p-2 items-center border border-gray-700"
                onClick={() =>
                  handlePlaySong(
                    song._id,
                    song.songUrl,
                    song.title,
                    song.owner,
                    song.ThumbnailUrl || logo
                  )
                }
              >
                <img
                  src={song.ThumbnailUrl || logo}
                  alt={song.title}
                  className="w-14 h-14 rounded"
                />
                <p className="mx-3">{song.title}</p>
                <p className="mx-3">by {song.artist}</p>
              </div>
            ))
          ) : (
            <p>No songs in this playlist.</p>
          )}
        </div>
      </div>
    </div>
  );
}
