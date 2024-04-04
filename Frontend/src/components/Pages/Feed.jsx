import SearchBar from "../SearchBar";
import Microphone from "../../../music player images/Microphone.svg";

export default function Feed() {
  return (
    <div className=" content">
      <div className="FeedHero">
        <SearchBar />
        <div className="pt-16 pb-44 ml-16">
          <div className="ml-10 w-1/2">
            <div className="flex flex-row">
              <h1 className="text-6xl font-extrabold">
                Let Music be Your Story
              </h1>
              <img
                src={Microphone}
                alt=""
                className="w-20 h-20 p-3 m-5 ml-10 "
              />
            </div>

            <h2 className="text-xl mt-10 font-medium">Play, Share, Repeat</h2>
          </div>
        </div>
        <h1 className="text-2xl p-5 pl-16 pt-0 font-medium">
          Your Favorite Artist
        </h1>
      </div>
      <div></div>
    </div>
  );
}
