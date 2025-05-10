import React from "react";

const Loading = () => {
  return (
    <main className="bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-center mb-8">4D Results</h1>
      <div className="flex flex-col items-center mt-16">
        <div className="h-12 w-12 rounded-full border-4 border-blue-500 border-t-transparent animate-spin mb-4"></div>
        <p className="text-lg font-medium">Loading results...</p>
      </div>
    </main>
  );
};

export default Loading;
