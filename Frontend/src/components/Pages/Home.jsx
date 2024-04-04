import React, { useContext, useState, useEffect, useMemo } from "react";
import SearchBar from "../SearchBar";
import musicIcon1 from "../../../music player images/musicIcon1.png";
import buttonList from "./homepageFilters";
import { SongContext } from "../SongContext";

export default function Home() {
  const { selectedTrack, setSelectedTrack } = useContext(SongContext);

  const [categoryData, setCategoryData] = useState([]);

  useEffect(() => {
    const apiEndpoint = "http://127.0.0.1:8000/home/api/tracks/";

    const fetchData = async () => {
      const promises = buttonList.map((button) =>
        fetch(`${apiEndpoint}${encodeURIComponent(button.name)}/`).then(
          (response) => response.json()
        )
      );
      const results = await Promise.all(promises);
      setCategoryData(results);
    };

    fetchData();
  }, []);

  const memoizedCategoryData = useMemo(() => categoryData, [categoryData]);

  return (
    <div className="content">
      <div className="Hero">
        <SearchBar />
        <div className="pt-16 pb-44 ml-16">
          <div className="ml-10 w-1/3">
            <div className="flex flex-row">
              <h1 className="text-6xl font-extrabold">Your Music Playground</h1>
              <img
                src={musicIcon1}
                alt=""
                className="w-20 h-20 p-3 m-5 ml-16 rotate-12"
              />
            </div>
            <h2 className="text-xl mt-10 font-medium">
              Where Every Click Hits a Right note
            </h2>
          </div>
        </div>
        <div className="pl-10">
          <h2 className="text-2xl p-5 pt-0 font-medium">Category</h2>
          <div className="flex flex-row items-center flex-wrap align-middle rounded">
            {buttonList.map((button) => {
              return (
                <a
                  href={`#${button.id}`}
                  key={button.id}
                  className="text-white p-2 m-2 rounded-lg filterBtn text-center"
                >
                  {button.name}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="Songs p-14" id="songs">
        {memoizedCategoryData.map((category, index) => (
          <div key={index} className="pt-10">
            <h2
              className="text-2xl p-5 pt-0 font-medium"
              id={buttonList[index].id}
            >
              {buttonList[index].name}
            </h2>
            <div className="flex flex-row items-center flex-wrap align-middle rounded">
              {category.map((song) => (
                <div
                  key={song.id}
                  className="text-white p-2 m-2 rounded-lg filterBtn text-center flex flex-col items-center hover:bg-gray-900 w-32 h-44"
                  onClick={() => {
                    setSelectedTrack(song.url);
                  }}
                >
                  <img
                    src={song.thumbnail_url}
                    alt={song.title}
                    className="w-24 h-24 pb-2"
                  />
                  <div>{song.title}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Audio Player */}
      {selectedTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-gray-900 p-4 text-white text-center">
          <audio controls autoPlay src={selectedTrack}>
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}
