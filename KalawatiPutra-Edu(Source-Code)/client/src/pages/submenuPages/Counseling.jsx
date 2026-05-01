
import React, { useState, useEffect } from 'react';
import { getCounselingPosts, submitCounselingBooking } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Loader2,
    MessageCircle,
    Users,
    Calendar,
    Clock,
    Star,
    ArrowRight,
    Phone,
    Video,
    CheckCircle,
    User,
    BookOpen,
    Target,
    Lightbulb,
    Heart,
    Award,
    Search,
    Filter,
    X
} from 'lucide-react';

const Counseling = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [bookingData, setBookingData] = useState({
        name: '',
        email: '',
        phone: '',
        preferredDate: '',
        preferredTime: '',
        sessionType: 'video',
        message: ''
    });

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await getCounselingPosts();
                setPosts(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    // Handle booking form submission
    const handleBooking = async (e) => {
        e.preventDefault();
        setBookingLoading(true);

        try {
            const response = await submitCounselingBooking(bookingData);

            if (response.data.success) {
                setBookingSuccess(true);
                setTimeout(() => {
                    setShowBookingModal(false);
                    setBookingSuccess(false);
                    setBookingData({
                        name: '',
                        email: '',
                        phone: '',
                        preferredDate: '',
                        preferredTime: '',
                        sessionType: 'video',
                        message: ''
                    });
                }, 2000);
            }
        } catch (error) {
            console.error('Booking error:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to book session. Please try again.';
            alert(errorMsg);
        } finally {
            setBookingLoading(false);
        }
    };

    // Get categories from posts
    const categories = ['all', ...new Set(posts.map(post => post.category || 'general'))];

    // Filter posts based on search and category
    const filteredPosts = posts.filter(post => {
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    // Stats data
    const stats = [
        { icon: Users, label: 'Students Helped', value: '500+', color: 'text-emerald-400' },
        { icon: Star, label: 'Success Rate', value: '95%', color: 'text-yellow-400' },
        { icon: Clock, label: 'Response Time', value: '< 24hrs', color: 'text-blue-400' },
        { icon: Award, label: 'Expert Counselors', value: '50+', color: 'text-purple-400' }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 min-h-screen text-white overflow-x-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            <div className="container mx-auto py-12 px-4 relative z-10">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <motion.h1
                        className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6"
                        style={{
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}
                    >
                        Career Counseling
                    </motion.h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
                        Get expert guidance for your career journey. Our professional counselors are here to help you
                        make informed decisions about your education and career path.
                    </p>

                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setShowBookingModal(true)}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2 shadow-lg hover:shadow-emerald-500/25"
                        >
                            <Calendar className="w-5 h-5" />
                            Book Free Session
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 px-8 py-3 rounded-xl font-medium transition-all flex items-center gap-2"
                        >
                            <Video className="w-5 h-5" />
                            Watch Demo
                        </motion.button>
                    </div>
                </motion.div>

                {/* Stats Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + 0.4 }}
                            className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-xl p-6 text-center hover:border-emerald-500/30 transition-all"
                        >
                            <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                            <div className="text-gray-400 text-sm">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Search and Filter Section */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="mb-12"
                >
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search counseling topics..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-gray-400"
                            />
                        </div>

                        {/* Category Filter */}
                        <div className="flex items-center gap-4">
                            <Filter className="text-gray-400 w-5 h-5" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm"
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category.charAt(0).toUpperCase() + category.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </motion.div>

                {/* Main Content */}
                {loading ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center items-center h-64"
                    >
                        <Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
                        <p className="ml-4 text-gray-400 text-lg">Loading counseling resources...</p>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {filteredPosts.length > 0 ? (
                            filteredPosts.map((post, index) => (
                                <motion.div
                                    key={post._id}
                                    initial={{ opacity: 0, y: 50 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.7 }}
                                    whileHover={{ y: -10, scale: 1.02 }}
                                    className="group relative overflow-hidden bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-glow-sm transition-all duration-300"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                                    <div className="relative z-10">
                                        {/* Header */}
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                                <BookOpen className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400">
                                                {post.category || 'General'}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                                            {post.content}
                                        </p>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
                                            <div className="flex items-center text-gray-400 text-sm">
                                                <MessageCircle className="w-4 h-4 mr-2" />
                                                Get Guidance
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="col-span-full text-center py-20"
                            >
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-bold text-gray-300 mb-4">No resources found</h3>
                                <p className="text-gray-400">Try adjusting your search terms or filters</p>
                            </motion.div>
                        )}
                    </motion.div>
                )}

                {/* Service Features */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-20"
                >
                    <h2 className="text-3xl font-bold text-center mb-12 text-emerald-400">Why Choose Our Counseling?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Target, title: 'Personalized Guidance', desc: 'Tailored advice based on your goals' },
                            { icon: Users, title: 'Expert Counselors', desc: 'Industry professionals with years of experience' },
                            { icon: Lightbulb, title: 'Career Insights', desc: 'Latest trends and opportunities in your field' },
                            { icon: Heart, title: 'Ongoing Support', desc: 'Continuous mentorship throughout your journey' }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 + 0.9 }}
                                className="text-center p-6 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-emerald-500/30 transition-all"
                            >
                                <feature.icon className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
                                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-400 text-sm">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Booking Modal */}
            <AnimatePresence>
                {showBookingModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[9999] flex items-center justify-center p-4"
                        onClick={() => setShowBookingModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="bg-gray-900/98 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl w-full max-w-lg mx-4 relative flex flex-col max-h-[95vh] sm:max-h-[90vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-700/50 flex-shrink-0">
                                <h3 className="text-xl font-bold text-emerald-400">Book Counseling Session</h3>
                                <button
                                    onClick={() => setShowBookingModal(false)}
                                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                                    aria-label="Close modal"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Modal Content - Scrollable */}
                            <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar">
                                {bookingSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.5 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 text-center"
                                    >
                                        <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-12 h-12 text-emerald-500 animate-bounce-slow" />
                                        </div>
                                        <h4 className="text-2xl font-bold text-white mb-2">Booking Successful!</h4>
                                        <p className="text-gray-400">Our counselors will contact you shortly.</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleBooking} className="space-y-4 sm:space-y-6">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={bookingData.name}
                                                    onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                                                    placeholder="John Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={bookingData.email}
                                                    onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                                            <input
                                                type="tel"
                                                required
                                                value={bookingData.phone}
                                                onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                                                placeholder="+91 XXXXX XXXXX"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={bookingData.preferredDate}
                                                    onChange={(e) => setBookingData({ ...bookingData, preferredDate: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-300 mb-2">Preferred Time</label>
                                                <input
                                                    type="time"
                                                    required
                                                    value={bookingData.preferredTime}
                                                    onChange={(e) => setBookingData({ ...bookingData, preferredTime: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Session Mode</label>
                                            <div className="grid grid-cols-3 gap-3">
                                                {['video', 'phone', 'in-person'].map((type) => (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        onClick={() => setBookingData({ ...bookingData, sessionType: type })}
                                                        className={`py-2 rounded-lg border text-sm font-medium transition-all ${bookingData.sessionType === type
                                                            ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                                                            : 'bg-gray-800/30 border-gray-700 text-gray-400 hover:bg-gray-800'
                                                            }`}
                                                    >
                                                        {type.charAt(0).toUpperCase() + type.slice(1)}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-300 mb-2">Additional Notes</label>
                                            <textarea
                                                value={bookingData.message}
                                                onChange={(e) => setBookingData({ ...bookingData, message: e.target.value })}
                                                className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-white resize-none transition-all"
                                                rows="3"
                                                placeholder="Tell us about your goals or concerns..."
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-2">
                                            <button
                                                type="button"
                                                onClick={() => setShowBookingModal(false)}
                                                className="flex-1 px-6 py-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-bold transition-all border border-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={bookingLoading}
                                                className="flex-[2] px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                {bookingLoading ? (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Booking...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Calendar className="w-5 h-5" />
                                                        Request Session
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Post Detail Modal */}
            <AnimatePresence>
                {selectedPost && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[9999] flex items-center justify-center p-4"
                        onClick={() => setSelectedPost(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="bg-gray-900/98 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-700/50 flex-shrink-0">
                                <h3 className="text-xl font-bold text-emerald-400">{selectedPost.title}</h3>
                                <button
                                    onClick={() => setSelectedPost(null)}
                                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Content */}
                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                <div className="mb-6">
                                    <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-xs font-medium text-emerald-400 mb-4">
                                        {selectedPost.category || 'General'}
                                    </div>
                                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedPost.content}</p>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        onClick={() => {
                                            setSelectedPost(null);
                                            setShowBookingModal(true);
                                        }}
                                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                                    >
                                        <Calendar className="w-4 h-4" />
                                        Book Counseling
                                    </button>
                                    <button
                                        onClick={() => setSelectedPost(null)}
                                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Counseling;