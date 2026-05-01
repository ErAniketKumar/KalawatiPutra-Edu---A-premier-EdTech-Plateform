
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Award, FileDown, Loader, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

const WelcomeCertificateGenerator = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const VITE_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setAnimateIn(true);
  }, []);

  const handleGenerateCertificate = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${VITE_API_URL}/welcome-certificates/generate`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'welcome_certificate.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      setError('Failed to generate certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Generate random orbs for background
  const orbs = Array.from({ length: 8 }).map((_, i) => (
    <div
      key={i}
      className="absolute rounded-full"
      style={{
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 6 + 2}px`,
        height: `${Math.random() * 6 + 2}px`,
        backgroundColor: `rgba(16, 185, 129, ${Math.random() * 0.3})`,
        animation: `float ${Math.random() * 10 + 10}s linear infinite`,
        animationDelay: `${Math.random() * 5}s`,
      }}
    />
  ));

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4 overflow-hidden">
      {/* Background Orbs and Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      {orbs}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-emerald-500/10 blur-[80px]"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full bg-emerald-600/10 blur-[80px]"></div>

      {/* Main Card */}
      <div
        className={`relative w-full max-w-md bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-500/20 overflow-hidden transition-all duration-1000 transform ${
          animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 p-2 text-center">
          <div className="flex items-center justify-center">
            <Award className="h-10 w-10 mr-2 text-emerald-200" />
            <h2 className="text-2xl font-bold text-white">Welcome Certificate</h2>
          </div>
          <p className="text-emerald-200 text-sm max-w-xs mx-auto">
            Celebrate joining the KalawatiPutra Edu community with your personalized certificate
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-400 text-sm" dangerouslySetInnerHTML={{ __html: error }}></p>
            </div>
          )}

          {isAuthenticated ? (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center bg-emerald-500/20 rounded-full group-hover:bg-emerald-500/30 transition-colors">
                <Award className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Welcome Aboard!</h3>
              <p className="mb-6 text-gray-300 max-w-xs">
                Thank you for joining KalawatiPutra Edu. Generate your welcome certificate now!
              </p>
              <button
                onClick={handleGenerateCertificate}
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <FileDown className="h-5 w-5 mr-2" />
                    Generate Certificate
                  </span>
                )}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center bg-emerald-500/20 rounded-full group-hover:bg-emerald-500/30 transition-colors">
                <LogIn className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Please Log In</h3>
              <p className="mb-6 text-gray-300 max-w-xs">
                Sign up or log in to generate your welcome certificate.
              </p>
              <Link
                to="/login"
                className="w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105"
              >
                <span className="flex items-center justify-center">
                  <LogIn className="h-5 w-5 mr-2" />
                  Log In / Sign Up
                </span>
              </Link>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 text-center text-xs text-gray-400 border-t border-gray-700/50">
          Join KalawatiPutra Edu and get your personalized welcome certificate
        </div>
      </div>
    </div>
  );
};

export default WelcomeCertificateGenerator;