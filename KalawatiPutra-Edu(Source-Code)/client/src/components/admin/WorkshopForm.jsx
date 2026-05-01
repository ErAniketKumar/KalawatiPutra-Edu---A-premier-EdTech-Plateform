import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusCircle, AlertCircle, Loader2, BookOpen, Hash } from 'lucide-react';

const WorkshopForm = ({ onWorkshopCreated }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const VITE_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in as an admin. <a href="/login" class="underline text-emerald-400">Log in</a>');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${VITE_API_URL}/admin/workshop/create`,
        { title, code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onWorkshopCreated(response.data.workshop);
      setTitle('');
      setCode('');
    } catch (error) {
      console.error('Create workshop error:', error.response?.data, error.response?.status);
      const message = error.response?.data?.msg || error.response?.data?.message || 'Failed to create workshop. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="relative bg-gray-900/80 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl blur opacity-30"></div>
      <div className="relative">
        <div className="bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 p-6">
          <div className="flex items-center space-x-3">
            <PlusCircle className="text-emerald-400 h-6 w-6" />
            <h3 className="text-xl font-bold text-white">Create New Workshop</h3>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="mb-6 p-4 rounded-lg bg-red-900/20 border border-red-500/20"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-400" dangerouslySetInnerHTML={{ __html: error }}></p>
                </div>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-emerald-400" />
                  <span>Certificate Title</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 placeholder-gray-500 text-gray-300"
                  placeholder="e.g., Successfully Completed Python Workshop"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-2 flex items-center space-x-2">
                  <Hash className="h-4 w-4 text-emerald-400" />
                  <span>Workshop Code</span>
                </label>
                <input
                  type="text"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200 placeholder-gray-500 text-gray-300"
                  placeholder="e.g., PY2025"
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={loading}
                className={`w-full py-2.5 px-4 rounded-lg text-white font-medium flex items-center justify-center space-x-2 ${
                  loading 
                    ? 'bg-gray-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700'
                }`}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                transition={{ duration: 0.2 }}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5" />
                    <span>Create Workshop</span>
                  </>
                )}
              </motion.button>
            </form>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkshopForm;