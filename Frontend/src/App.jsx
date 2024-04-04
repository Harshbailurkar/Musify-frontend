import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Pages/Home";
import Layout from "./components/Layout";
import Feed from "./components/Pages/Feed";
import Concerts from "./components/Pages/Concerts";
import Playlist from "./components/Pages/Playlist";
import Radio from "./components/Pages/Radio";
import { SongProvider } from "./components/SongContext";

function App() {
  return (
    <Router>
      <SongProvider>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="feed" element={<Feed />} />
            <Route path="concerts" element={<Concerts />} />
            <Route path="playlist" element={<Playlist />} />
            <Route path="radio" element={<Radio />} />
            <Route path="*" element={"404 Not Found"} />
          </Route>
        </Routes>
      </SongProvider>
    </Router>
  );
}

export default App;
