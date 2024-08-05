import React from "react";

export default function SearchBar({ searchQuery, handleSearch }) {
  return (
    <div className="p-2 flex flex-row justify-between align-middle ">
      <div className="w-full md:w-1/2 gradient">
        <input
          type="search"
          placeholder="Search a Song Title"
          className="p-2 md:pl-10 w-full md:ml-24 rounded search border border-gray-600 border-gradient border-gradient-green focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-musify-dark text-white"
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>
    </div>
  );
}
