import React from "react";
import { useNavigate } from "react-router-dom";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    
    <div className="h-screen w-full relative flex items-center justify-center text-center bg-cover bg-center opacity-70" 
         style={{ backgroundImage: "url('/src/assets/image/welcomeimg.png')" }}>

      <div className="relative w-full h-screen">
      {/* Travel Story Logo at Top-Left */}
        <div className="absolute top-4 left-4 bg-white p-2 shadow-md rounded-md ">
         <img src="/src/assets/image/logo.svg" alt="Travel Story Logo" className="h-20  w-auto" />
        </div>
      
      {/* Overlay for better readability */}
      <div className="absolute inset-0 "></div>

      {/* Content on top of the background */}
      <div className="absolute right-16 top-1/3 text-center">
      <div className="bg-pink-50  p-6 rounded-lg shadow-lg">
        <h1 className="text-5xl font-semibold mb-6 bg-gradient-to-r from-blue-400 to-pink-500 bg-clip-text text-transparent drop-shadow-lg">
          Welcome to Travel Stories
        </h1>
        <p className="text-lg font-medium max-w-lg mx-auto bg-gradient-to-r from-orange-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-md">
        This is your personal journey vault, where you can cherish and preserve all your travel memories—from childhood trips to your granny’s house to your adventures in Greece. Capture those sweet, funny moments and keep your memories fresh and beautiful forever.
        </p>
        </div>
        {/* Buttons */}
        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 bg-pink-400 text-white font-semibold rounded-lg shadow-md hover:bg-pink-500 transition-all"
          >
            Sign Up
          </button>
        </div>
      </div>

      {/* Creator Details */}
      <div className="absolute bottom-4 text-pink-400 text-sm">
        <p>Created with ❤️ by <span className="font-semibold">Deepali</span></p>
      </div>

      </div>
    </div>
  );
};

export default Welcome;
