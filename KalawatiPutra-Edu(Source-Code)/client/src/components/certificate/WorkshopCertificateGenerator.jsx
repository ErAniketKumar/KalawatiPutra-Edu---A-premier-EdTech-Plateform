// File: client/src/components/WorkshopCertificateGenerator.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Check, FileDown, Lock, Award, Loader } from 'lucide-react';

const WorkshopCertificateGenerator = () => {
  const [code, setCode] = useState('');
  const [workshopId, setWorkshopId] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const VITE_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to verify the code. <a href="/login" class="underline text-emerald-400">Log in</a>');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${VITE_API_URL}/workshop-certificates/verify-code`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWorkshopId(response.data.workshopId);
      setTitle(response.data.title);

      // Animate transition
      setAnimateIn(false);
      setTimeout(() => {
        setIsVerified(true);
        setAnimateIn(true);
      }, 300);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCertificate = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(
        `${VITE_API_URL}/workshop-certificates/generate?workshopId=${workshopId}`,
        {
          responseType: 'blob',
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'workshop_certificate.pdf');
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
            <h2 className="text-2xl font-bold text-white">Certificate Generator</h2>
          </div>
          <p className="text-emerald-200 text-sm max-w-xs mx-auto">
            Verify your workshop code to unlock your personalized certificate
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border-l-4 border-red-500 rounded-lg">
              <p className="text-red-400 text-sm" dangerouslySetInnerHTML={{ __html: error }}></p>
            </div>
          )}

          {!isVerified ? (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div className="relative">
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2">
                  Workshop Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-emerald-400 group-hover:text-emerald-300 transition-colors" />
                  </div>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 group-hover:bg-gray-800/70"
                    placeholder="Enter workshop code"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-300 transform hover:scale-105 ${
                  loading ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <Loader className="animate-spin h-5 w-5 mr-2" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    Verify Code
                  </span>
                )}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 w-16 h-16 flex items-center justify-center bg-emerald-500/20 rounded-full group-hover:bg-emerald-500/30 transition-colors">
                <Check className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Workshop Verified</h3>
              <p className="mb-6 text-gray-300 max-w-xs">{title}</p>
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
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-800/50 text-center text-xs text-gray-400 border-t border-gray-700/50">
          Enter your workshop code to generate your personalized certificate
        </div>
      </div>
    </div>
  );
};

export default WorkshopCertificateGenerator;
