import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';

const VerifyCertificate = () => {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${VITE_API_URL}/certificates/verify`, {
        certificateNumber,
      });
      setResult(response.data);
    } catch (error) {
      setResult({ valid: false, message: error.response?.data.message || 'Verification failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-['DM_Sans',sans-serif]">
      <Helmet>
        <title>Verify Certificate | KalawatiPutra Edu</title>
        <meta
          name="description"
          content="Verify your KalawatiPutra Edu certificate by entering the certificate number."
        />
        <meta name="keywords" content="verify certificate, KalawatiPutra Edu" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://kalawatiputra.com/verify-certificate" />
      </Helmet>
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300">
            Verify Certificate
          </h1>
          <p className="text-gray-400 text-lg md:text-xl mb-8 leading-relaxed">
            Enter the certificate number to verify its authenticity.
          </p>
        </div>
        <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-2xl shadow-xl border border-gray-800">
          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block mb-2 text-lg text-gray-300">
                Certificate Number
              </label>
              <input
                type="text"
                value={certificateNumber}
                onChange={(e) => setCertificateNumber(e.target.value.toUpperCase())}
                className="w-full p-3 bg-black border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                placeholder="e.g., JOHN7X9P2Q"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-200 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-md hover:shadow-lg'
              }`}
            >
              {loading ? 'Verifying...' : 'Verify Certificate'}
            </button>
          </form>
          {result && (
            <div className={`mt-6 p-4 rounded-lg border ${result.valid ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20'}`}>
              {result.valid ? (
                <>
                  <p className="text-green-400">Certificate is valid!</p>
                  <p className="text-gray-300">Name: {result.userName}</p>
                  <p className="text-gray-300">
                    Issue Date: {new Date(result.issueDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-300">Certificate Number: {result.certificateNumber}</p>
                </>
              ) : (
                <p className="text-red-400">{result.message}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;