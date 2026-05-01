import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return (
        <div className="bg-gradient-to-b from-[#121212] to-[#1E1E1E] text-white min-h-screen flex items-center justify-center py-8 px-4">
            <div className="bg-[#2A2A2A] rounded-lg p-8 max-w-lg w-full text-center animate-fade-in shadow-xl">
                {/* Decorative SVG Icon */}
                <svg
                    className="w-24 h-24 mx-auto mb-6 text-[#4CAF50]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>

                {/* Headline */}
                <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">
                    404 - <span className="text-[#4CAF50]">Page Not Found</span>
                </h1>

                {/* Subtext */}
                <p className="text-lg md:text-xl text-gray-400 mb-8">
                    Oops! Looks like you’re lost in cyberspace. Don’t worry, let’s get you back to exploring Kalawati-putra Edu’s amazing services!
                </p>

                {/* Back to Home Button */}
                <Link
                    to="/"
                    className="inline-block bg-[#4CAF50] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#388E3C] transition-transform transform hover:scale-105"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
};

// CSS for animations (should already be in src/App.css from Services.jsx)
const styles = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in {
        animation: fadeIn 1s ease-in;
    }
    .custom-scrollbar {
        scrollbar-width: thin;
        scrollbar-color: #4CAF50 #2A2A2A;
    }
    .custom-scrollbar::-webkit-scrollbar {
        width: 8px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: #2A2A2A;
        border-radius: 4px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #4CAF50;
        border-radius: 4px;
        border: 2px solid #2A2A2A;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background-color: #388E3C;
    }
`;
// Ensure the above styles are in src/App.css or index.css
export default NotFound;
