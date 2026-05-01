import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { Toaster, toast } from 'sonner';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ReportProblemForm = () => {
  const [formData, setFormData] = useState({
    issueType: '',
    fullName: '',
    email: '',
    description: '',
  });
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.issueType) newErrors.issueType = 'Please select an issue type';
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.description) newErrors.description = 'Description is required';
    else if (formData.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form', {
        position: 'top-right',
        duration: 3000,
        style: { background: '#EF4444', color: '#fff', border: 'none' },
        icon: <AlertCircle className="h-4 w-4" />,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${VITE_API_URL}/issues/submit`, formData);
      setShowModal(true);
      setFormData({ issueType: '', fullName: '', email: '', description: '' });
      toast.success('Issue submitted successfully!', {
        position: 'top-right',
        duration: 3000,
        style: { background: '#10B981', color: '#fff', border: 'none' },
        icon: <CheckCircle className="h-4 w-4" />,
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ form: 'Failed to submit issue. Please try again.' });
      toast.error('Failed to submit issue. Please try again.', {
        position: 'top-right',
        duration: 3000,
        style: { background: '#EF4444', color: '#fff', border: 'none' },
        icon: <AlertCircle className="h-4 w-4" />,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <Toaster richColors position="top-right" />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="bg-gray-800/80 backdrop-blur-md border border-emerald-700/30 rounded-2xl shadow-xl shadow-emerald-900/20 p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-emerald-400 mb-6 text-center">
          Report a Problem
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Issue Type Radio Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Issue Type
            </label>
            <div className="flex flex-wrap gap-4">
              {['major', 'minor', 'feature'].map((type) => (
                <label
                  key={type}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="issueType"
                    value={type}
                    checked={formData.issueType === type}
                    onChange={handleChange}
                    className="appearance-none h-4 w-4 border-2 border-emerald-600 rounded-full checked:bg-emerald-500 checked:border-emerald-500 focus:ring-2 focus:ring-emerald-400"
                  />
                  <span className="text-gray-300 capitalize">
                    {type === 'major' ? 'Major Issue/Bug' : type === 'minor' ? 'Minor Issue' : 'Feature Idea'}
                  </span>
                </label>
              ))}
            </div>
            {errors.issueType && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.issueType}
              </p>
            )}
          </div>

          {/* Full Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Full Name
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="Enter your full name"
            />
            {errors.fullName && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.fullName}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <motion.input
              whileFocus={{ scale: 1.02 }}
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.email}
              </p>
            )}
          </div>

          {/* Description Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Description
            </label>
            <motion.textarea
              whileFocus={{ scale: 1.02 }}
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              className="mt-1 w-full p-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              placeholder="Describe the issue or feature in detail"
            />
            {errors.description && (
              <p className="text-red-400 text-sm mt-2 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {errors.description}
              </p>
            )}
          </div>

          {/* Form Error */}
          {errors.form && (
            <p className="text-red-400 text-sm flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> {errors.form}
            </p>
          )}

          {/* Submit Button */}
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(16, 185, 129, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl font-semibold text-lg shadow-lg shadow-emerald-800/20 hover:from-emerald-700 hover:to-emerald-800 transition-all duration-300 focus:ring-4 focus:ring-emerald-400/50 focus:outline-none ${isSubmitting ? 'opacity-50 cursor-not-allowed bg-gradient-to-r from-gray-600 to-gray-700' : ''
              }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 11-16 0z"
                  ></path>
                </svg>
                Submitting...
              </span>
            ) : (
              'Submit Issue'
            )}
          </motion.button>
        </form>
      </motion.div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-gray-800/90 backdrop-blur-md border border-emerald-700/30 rounded-2xl p-8 max-w-md w-full shadow-xl shadow-emerald-900/20"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-emerald-400">
                  Thank You!
                </h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-emerald-400 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-gray-300 mb-6">
                Thank you for raising your complaint. Our team will connect with you soon or resolve it promptly.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={closeModal}
                className="w-full py-3 px-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportProblemForm;