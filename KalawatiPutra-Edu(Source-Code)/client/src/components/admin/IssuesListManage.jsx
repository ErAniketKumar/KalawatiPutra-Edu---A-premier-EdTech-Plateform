import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const IssuesListManage = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${VITE_API_URL}/issues`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIssues(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch issues. Please try again.');
        setLoading(false);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusChange = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `${VITE_API_URL}/issues/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIssues(issues.map((issue) =>
        issue._id === id ? response.data.issue : issue
      ));
    } catch (err) {
      setError('Failed to update status. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this issue?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${VITE_API_URL}/issues/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIssues(issues.filter((issue) => issue._id !== id));
    } catch (err) {
      setError('Failed to delete issue. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold text-center mb-8 text-emerald-400"
      >
        Issues List Table
      </motion.h1>

      {/* Issues Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-gray-800 p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto custom-scrollbar"
      >
        <h2 className="text-2xl font-semibold mb-4 text-emerald-300">Reported Issues</h2>
        {loading ? (
          <p className="text-gray-400">Loading issues...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : issues.length === 0 ? (
          <p className="text-gray-400">No issues reported yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-700">
                  <th className="p-3 text-emerald-300">Issue Type</th>
                  <th className="p-3 text-emerald-300">Full Name</th>
                  <th className="p-3 text-emerald-300">Email</th>
                  <th className="p-3 text-emerald-300">Description</th>
                  <th className="p-3 text-emerald-300">Status</th>
                  <th className="p-3 text-emerald-300">Date</th>
                  <th className="p-3 text-emerald-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {issues.map((issue) => (
                    <motion.tr
                      key={issue._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-gray-700 hover:bg-gray-600"
                    >
                      <td className="p-3 capitalize">{issue.issueType}</td>
                      <td className="p-3">{issue.fullName}</td>
                      <td className="p-3">{issue.email}</td>
                      <td className="p-3 max-w-xs truncate">{issue.description}</td>
                      <td className="p-3">
                        <motion.select
                          whileHover={{ scale: 1.05 }}
                          value={issue.status}
                          onChange={(e) => handleStatusChange(issue._id, e.target.value)}
                          className="bg-gray-700 text-white border border-gray-600 rounded-md p-1 focus:ring-2 focus:ring-emerald-400"
                        >
                          {['to-do', 'in-progress', 'resolved'].map((status) => (
                            <option key={status} value={status} className="capitalize">
                              {status}
                            </option>
                          ))}
                        </motion.select>
                      </td>
                      <td className="p-3">{new Date(issue.createdAt).toLocaleDateString()}</td>
                      <td className="p-3">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(issue._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700"
                        >
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default IssuesListManage;