import React from "react";

export default function DeniedAccess() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-white">
      <h1 className="text-5xl font-bold mb-4">403 Access Denied</h1>
      <p className="text-xl mb-8">
        Sorry, you dont have access to this Concert.
      </p>
      <a href="/concerts" className="text-blue-500 hover:text-blue-700 text-lg">
        explore more concerts
      </a>
    </div>
  );
}
