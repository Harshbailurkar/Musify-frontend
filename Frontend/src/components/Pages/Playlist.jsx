import SearchBar from "../SearchBar";

export default function Playlist() {
  return (
    <div className="content">
      <div className="PlaylistsHero">
        <SearchBar />
        <div className="pt-16 pb-44 ml-16">
          <div className="ml-10 w-3/4">
            <div className="flex flex-row items-center justify-between">
              <h1 className="text-6xl font-extrabold">
                Your Playlist ,<br /> Your Story
              </h1>
              <button className="w-34 h-14 createBtn font-medium ml-4 text-center items-center ">
                + Create New
              </button>
            </div>

            <h2 className="text-xl mt-14 font-medium">
              {" "}
              Discover playlists created by you. Express your musical journey
              and share your favorite tracks.
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
