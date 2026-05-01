import React, { useState } from 'react';
import { login, getProfile, googleLogin as googleLoginAPI } from '../../api';
import { useNavigate, Link } from 'react-router-dom';
import { Toaster, toast } from 'sonner';
import { Mail, Lock, LogIn, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('expired') === 'true') {
            toast.error('Session expired. Please login again.', {
                position: "top-center",
                duration: 5000,
                style: {
                    background: '#F59E0B',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    minHeight: '40px',
                    fontSize: '14px',
                },
            });
            // Clean up the URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await login({
                email,
                password,
            });
            localStorage.setItem('token', res.data.token);

            toast.success('Login successful!', {
                position: "top-center",
                duration: 2000,
                style: {
                    background: '#10B981',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    minHeight: '40px',
                    fontSize: '14px',
                },
            });

            const profileRes = await getProfile();
            setTimeout(() => {
                if (profileRes.data.role === 'admin') {
                    navigate('/admin/manage-articles');
                } else {
                    navigate('/');
                }
            }, 2000);
        } catch (err) {
            console.error('Login error:', err);
            toast.error(err.response?.data?.msg || 'Login failed', {
                position: "top-center",
                duration: 4000,
                style: {
                    background: '#EF4444',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    minHeight: '40px',
                    fontSize: '14px',
                },
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        googleLoginAPI();
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.2),transparent_50%),radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.2),transparent_50%)]"></div>
            <div className="absolute top-10 left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>

            <Toaster position="top-center" richColors />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className="w-full max-w-md"
            >
                <div className="bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-800/50 p-8 relative overflow-hidden">
                    {/* Header accent bar */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500"></div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.5 }}
                            className="text-3xl font-bold text-white bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400"
                        >
                            Welcome Back
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.5 }}
                            className="text-gray-400 mt-2"
                        >
                            Sign in to continue your learning journey
                        </motion.p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <label className="block text-sm font-medium text-gray-300">
                                Email Address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail size={20} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-100 pl-10 pr-3 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                                    placeholder="Enter your email"
                                    required
                                    disabled={loading}
                                />
                            </div>
                        </motion.div>

                        {/* Password Input */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="space-y-2"
                        >
                            <label className="block text-sm font-medium text-gray-300">
                                Password
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock size={20} className="text-gray-500 group-focus-within:text-emerald-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-gray-800/50 border border-gray-700/50 text-gray-100 pl-10 pr-10 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 placeholder-gray-500"
                                    placeholder="Enter your password"
                                    required
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-emerald-400 focus:outline-none transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </motion.div>

                        {/* Links */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.5 }}
                            className="flex justify-between items-center text-sm"
                        >
                            <Link
                                to="/register"
                                className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                            >
                                Create an account
                            </Link>
                            <Link
                                to="/forgot-password"
                                className="text-gray-400 hover:text-emerald-400 transition-colors duration-200"
                            >
                                Forgot Password?
                            </Link>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.7, duration: 0.5 }}
                            className={`w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 rounded-lg font-medium transition-all duration-300 hover:from-emerald-500 hover:to-teal-500 hover:shadow-lg hover:shadow-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-gray-900 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
                            disabled={loading}
                            whileHover={{ scale: loading ? 1 : 1.05 }}
                            whileTap={{ scale: loading ? 1 : 0.95 }}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Logging in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </motion.button>
                    </form>

                    {/* Divider */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                        className="my-8 flex items-center"
                    >
                        <div className="flex-grow h-px bg-gray-700"></div>
                        <span className="px-4 text-gray-400 text-sm font-medium">OR</span>
                        <div className="flex-grow h-px bg-gray-700"></div>
                    </motion.div>

                    {/* Google Login Button */}
                    <motion.button
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.9, duration: 0.5 }}
                        onClick={handleGoogleLogin}
                        className={`w-full bg-gray-800/50 border border-gray-700/50 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-700/50 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'}`}
                        disabled={loading}
                        whileHover={{ scale: loading ? 1 : 1.05 }}
                        whileTap={{ scale: loading ? 1 : 0.95 }}
                    >
                        <LogIn size={20} />
                        Sign in with Google
                    </motion.button>
                </div>

                {/* Footer Branding */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="mt-6 text-center"
                >
                    <p className="text-gray-500 text-sm">
                        Powered by{' '}
                        <span className="text-emerald-400 font-semibold">KalawatiPutra Edu</span>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
}