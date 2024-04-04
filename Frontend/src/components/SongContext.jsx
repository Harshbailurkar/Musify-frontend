// SongContext.js
import React, { createContext, useState } from "react";

export const SongContext = createContext();

export const SongProvider = ({ children }) => {
  const [selectedTrack, setSelectedTrack] = useState(null);

  return (
    <SongContext.Provider value={{ selectedTrack, setSelectedTrack }}>
      {children}
    </SongContext.Provider>
  );
};
