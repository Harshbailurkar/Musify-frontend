import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
function Channel(props) {
  const navigate = useNavigate();
  const handleVisiteArtist = () => {
    navigate(`/c/${props.username}`);
  };
  return (
    <div
      className="rounded-lg shadow-lg p-1 ml-5 mb-4 flex flex-col items-center"
      onClick={handleVisiteArtist}
    >
      <div>
        <img
          src={
            props.avatar ||
            "https://avatars.githubusercontent.com/u/149575885?v=4"
          }
          alt=""
          className=" w-16 md:w-20 h-16 md:h-20 rounded-full object-cover"
          style={{ border: "3px solid #a16207" }}
        />
      </div>
      <h2 className=" text-sm md:text-lg text-white font-bold">
        {props.ChannelName}
      </h2>
    </div>
  );
}

export default Channel;
