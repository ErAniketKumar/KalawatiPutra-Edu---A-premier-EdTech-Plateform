import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardCheck, Search, AlertCircle, Calendar, Code } from 'lucide-react';

const WorkshopList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const VITE_API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');

  useEffect(() => {
    fetchWorkshops();
  }, []);

  const fetchWorkshops = async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in as an admin. <a href="/login" class="underline text-emerald-400">Log in</a>');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${VITE_API_URL}/admin/workshop/list`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWorkshops(response.data);
    } catch (error) {
      console.error('Fetch workshops error:', error.response?.data, error.response?.status);
      const message = error.response?.data?.msg || error.response?.data?.message || 'Failed to fetch workshops.';
      setError(message);
    } finally {
      setTimeout(() => setLoading(false), 800);
    }
  };

  const filteredWorkshops = workshops.filter(
    workshop => 
      workshop.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      workshop.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric'
    }).format(date);
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ClipboardCheck className="text-emerald-400 h-6 w-6" />
              <h3 className="text-xl font-bold text-white">Workshop List</h3>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search workshops..."
                className="pl-9 pr-4 py-2 rounded-full bg-gray-800/50 text-gray-300 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-52 transition-all duration-300"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                className="mb-4 p-4 rounded-lg bg-red-900/20 border border-red-500/20"
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

            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-gray-800/50 h-16 rounded-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-full w-full bg-gradient-to-r from-gray-800/0 via-gray-700/20 to-gray-800/0 animate-pulse" />
                  </motion.div>
                ))}
              </div>
            ) : workshops.length === 0 ? (
              <motion.div 
                className="text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-gray-800/50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <ClipboardCheck className="h-8 w-8 text-emerald-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-300">No workshops found</h4>
                <p className="text-gray-500 mt-1">Create a new workshop to get started</p>
              </motion.div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Title</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Created At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    <AnimatePresence>
                      {filteredWorkshops.map((workshop, index) => (
                        <motion.tr
                          key={workshop._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group hover:bg-gray-800/50 transition-colors duration-200"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-300 group-hover:text-emerald-400 transition-colors duration-200">
                              {workshop.title}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2">
                              <Code className="h-4 w-4 text-gray-500 group-hover:text-emerald-400 transition-colors duration-200" />
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-800 text-gray-300 group-hover:bg-emerald-900/20 group-hover:text-emerald-400 transition-colors duration-200">
                                {workshop.code}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-2 text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                              <Calendar className="h-4 w-4" />
                              <span>{formatDate(workshop.createdAt)}</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
                
                {filteredWorkshops.length === 0 && searchTerm && (
                  <motion.div 
                    className="text-center py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-500">No results found for "{searchTerm}"</p>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkshopList;