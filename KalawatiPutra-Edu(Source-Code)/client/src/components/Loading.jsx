import React from "react";
import "../App.css"

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div className="absolute w-24 h-24 border-t-4 border-b-4 border-[#4CAF50] rounded-full animate-spin"></div>
        {/* Animated dots */}
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-[#4CAF50] rounded-full animate-bounce"
            style={{
              transform: `rotate(${index * 45}deg) translateX(60px)`,
              animationDelay: `${index * 0.1}s`,
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Loading;