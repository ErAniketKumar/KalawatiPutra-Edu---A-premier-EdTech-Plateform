import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DsaQuestionCertificateGenerator = () => {
  const [solvedCount, setSolvedCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const VITE_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  useEffect(() => {
    let count = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('status-') && localStorage.getItem(key) === 'solved') {
        count++;
      }
    });
    setSolvedCount(count); // Your testing modification

    const persistedError = sessionStorage.getItem('certificateError');
    if (persistedError) {
      setError(persistedError);
      sessionStorage.removeItem('certificateError');
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.setItem('certificateError', 'Account not recognized. Please sign up or log in with a valid account.');
    window.location.href = '/login';
  };

  const handleGenerateCertificate = async () => {
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    const apiUrl = `${VITE_API_URL}/certificates/generate?type=DSA`; // Added type=DSA query parameter
    console.log('Requesting certificate from:', apiUrl);
    console.log('Token:', token || 'No token found');
    // Decode token for debugging
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        console.log('Decoded token payload:', decoded);
      } catch (e) {
        console.log('Failed to decode token:', e.message);
      }
    }

    if (!token) {
      setError('Please log in to generate a certificate. <a href="/login" class="underline text-blue-500">Log in</a> or <a href="/signup" class="underline text-blue-500">Sign up</a>');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(apiUrl, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${token}` },
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'kp_Edu_certificate.pdf');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating certificate:', error);
      console.log('Response status:', error.response?.status);
      let errorMessage = 'Unknown error';
      if (error.response?.data instanceof Blob) {
        const text = await error.response.data.text();
        console.log('Response data (text):', text);
        try {
          const json = JSON.parse(text);
          errorMessage = json.message || json.msg || text;
        } catch (e) {
          errorMessage = text;
        }
      } else {
        errorMessage = error.response?.data?.message || error.response?.data?.msg || 'Unknown error';
      }
      console.log('Parsed error message:', errorMessage);
      if (error.response?.status === 401 || (error.response?.status === 404 && errorMessage.includes('User not found'))) {
        setError(
          `Failed to generate certificate: ${errorMessage}. Your account may not be recognized. ` +
          'Please sign up or log in with a valid account. ' +
          '<button onclick="document.dispatchEvent(new CustomEvent(\'logout\'))" class="underline text-blue-500">Log out</button> or ' +
          '<a href="/signup" class="underline text-blue-500">Sign up</a>'
        );
      } else {
        setError(
          `Failed to generate certificate: ${errorMessage}. Please try again or contact support at support@kalawatiputra.com.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleCustomLogout = () => {
      handleLogout();
    };
    document.addEventListener('logout', handleCustomLogout);
    return () => {
      document.removeEventListener('logout', handleCustomLogout);
    };
  }, []);

  return (
    <div className="text-center">
      {error && (
        <p className="text-red-400 mb-4" dangerouslySetInnerHTML={{ __html: error }}></p>
      )}
      {solvedCount >= 100 ? (
        <button
          onClick={handleGenerateCertificate}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
            loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? 'Generating...' : 'Generate Certificate'}
        </button>
      ) : (
        <p className="text-gray-400 text-lg">
          Solve {100 - solvedCount} more question{100 - solvedCount !== 1 ? 's' : ''} to unlock certificate
        </p>
      )}
    </div>
  );
};

export default DsaQuestionCertificateGenerator;