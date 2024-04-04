import SearchBar from "../SearchBar";

export default function Concerts() {
  return (
    <div className=" content">
      <div className="ConcertsHero">
        <SearchBar />
        <div className="pt-16 pb-44 ml-16">
          <div className="ml-10 w-1/2">
            <div className="flex flex-row">
              <h1 className="text-6xl font-extrabold">
                Experience Live Music Like Never Before!
              </h1>
            </div>

            <h2 className="text-xl mt-10 font-medium">
              Transport Yourself to the Front Row! Experience Live Concerts from
              the Comfort of Your Home!
            </h2>
          </div>
        </div>
        <h1 className="text-2xl p-5 pl-16 pt-0 font-medium">
          Your Favorite Artist
        </h1>
      </div>
    </div>
  );
}
