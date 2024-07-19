import React from "react";

export default function PageNotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-6xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-xl mb-8">
        Sorry, the page you are looking for does not exist.
      </p>
      <a href="/" className="text-blue-500 hover:text-blue-700 text-lg">
        Go to Homepage
      </a>
    </div>
  );
}
