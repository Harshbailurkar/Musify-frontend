import React, { useState, useEffect } from "react";

const Header = () => {
  const [currentUser, setCurrentUser] = useState(null); // State to hold current user data

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // Example: Fetch user data from an API or local storage
        const userData = await fetchUserData(); // Replace with your actual function
        setCurrentUser(userData); // Set current user state
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchCurrentUser();
  }, []);
  const fetchUserData = () => {
    return new Promise((resolve) => {
      // Simulate fetching user data
      setTimeout(() => {
        const mockUserData = {
          name: "John Doe", // Replace with actual user name
          avatarUrl: "https://example.com/avatar.jpg", // Replace with actual
        };
        resolve(mockUserData);
      }, 1000); // Simulating API delay with setTimeout
    });
  };

  return (
    <header className=" text-white py-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        {currentUser ? (
          <div className="flex items-center">
            <img
              className="w-8 h-8 rounded-full mr-2"
              src={currentUser.avatarUrl}
              alt={currentUser.name}
            />
            <span className="text-sm">{currentUser.name}</span>
          </div>
        ) : (
          <span className="text-sm">Loading...</span>
        )}
      </div>
    </header>
  );
};

export default Header;
