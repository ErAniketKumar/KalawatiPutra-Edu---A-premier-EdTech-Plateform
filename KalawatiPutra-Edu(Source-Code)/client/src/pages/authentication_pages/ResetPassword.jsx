import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';

export default function ResetPassword() {
    const navigate = useNavigate();
    const location = useLocation();
    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
    const [token, setToken] = useState('');
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        if (tokenParam) {
            setToken(tokenParam);
        } else {
            toast.error('Invalid reset link', { position: 'top-center' });
            setTimeout(() => navigate('/login'), 3000);
        }
    }, [location, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return toast.error('Passwords do not match', { position: 'top-center' });
        }
        try {
            const res = await fetch(`${VITE_API_URL}/auth/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: formData.password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.msg || 'Reset failed');
            toast.success('Password updated successfully', {
                position: 'top-center',
                autoClose: 3000,
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (err) {
            toast.error(err.message, { position: 'top-center' });
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
            <ToastContainer
                position="top-center"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                toastStyle={{
                    backgroundColor: '#1f2937',
                    color: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #374151',
                    padding: '8px',
                    minHeight: '40px',
                    width: '280px',
                }}
                style={{ width: '320px' }}
            />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium">New Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="w-full p-2 mt-1 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                    </div>
                    <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-md transition"
                    >
                        Update Password
                    </motion.button>
                </form>
                <p className="mt-4 text-center text-sm">
                    Back to{' '}
                    <a href="/login" className="text-emerald-500 hover:underline">
                        Log in
                    </a>
                </p>
            </motion.div>
        </div>
    );
}