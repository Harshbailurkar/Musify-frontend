import UserProfile from "../../music player images/UserProfile.svg";
export default function SearchBar() {
  return (
    <div className="p-8 flex flex-row justify-between align-middle ">
      <div className="w-1/2 gradient">
        <input
          type="search"
          placeholder="Search a Song , Movie or Artist"
          className="p-2 pl-10 w-full  ml-24 rounded search border border-gradient border-gradient-green focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        />
      </div>
      <img src={UserProfile} alt="" />
    </div>
  );
}
