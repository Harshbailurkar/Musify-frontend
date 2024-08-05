import React, { useState, useEffect } from "react";
import { getMostFollowedChannels } from "../API/userAPI";
import { useNavigate } from "react-router-dom";
export default function TopArtist() {
  const [topArtist, setTopArtist] = useState([]);

  useEffect(() => {
    getMostFollowedChannels()
      .then((data) => {
        setTopArtist(data.data);
      })
      .catch((error) => {
        console.error("Error fetching top artist", error);
      });
  }, []);
  const navigate = useNavigate();
  const handleVisiteArtist = (channelName) => {
    navigate(`/c/${channelName}`);
  };

  return (
    <div className="bg-glass-effect mt-10">
      <div className="bg-white bg-opacity-5 backdrop-blur-lg rounded-lg shadow-lg flex flex-col items-center p-1 pt-5">
        <h1 className="text-xl text-black font-bold mb-4 bg-white p-1 w-1/2 text-center rounded-lg">
          Top Artist
        </h1>
        <div className="flex flex-wrap justify-center">
          {topArtist.map((artist) => (
            <div
              key={artist.channelId}
              className=" p-1 m-2 flex flex-col items-center"
              onClick={() => handleVisiteArtist(artist.channelUsername)}
            >
              <img
                src={
                  artist.channelAvatar ||
                  "https://avatars.githubusercontent.com/u/149575885?v=4"
                }
                alt=""
                className="w-16 h-16 rounded-full object-cover border-fuchsia-600"
                style={{ border: "3px solid #a16207" }}
              />
              <h2 className="text-white font-bold mt-2">
                {artist.channelName}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
