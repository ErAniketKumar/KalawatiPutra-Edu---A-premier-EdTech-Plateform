import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Mail,
    Phone,
    Linkedin,
    Award,
    Briefcase,
    Star,
    Clock,
    Users,
    MessageCircle,
    Calendar,
    Video,
    Search,
    Filter,
    MapPin,
    CheckCircle,
    ArrowRight,
    X,
    Send,
    Loader2,
    Heart,
    Target,
    BookOpen
} from 'lucide-react';
import { getMentorships, submitMentorshipBooking } from '../../api';

const Mentorship = () => {
    const [mentors, setMentors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMentor, setSelectedMentor] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');
    const [showBookModal, setShowBookModal] = useState(false);
    const [bookingMentor, setBookingMentor] = useState(null);
    const [bookingForm, setBookingForm] = useState({
        name: '',
        email: '',
        phone: '',
        sessionType: 'one-on-one',
        preferredDate: '',
        preferredTime: '',
        topic: '',
        experience: '',
        goals: '',
        specialRequests: ''
    });
    const [submitLoading, setSubmitLoading] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        const fetchMentors = async () => {
            try {
                const res = await getMentorships();
                setMentors(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchMentors();
    }, []);

    // Filter mentors based on search and category
    const filteredMentors = mentors.filter(mentor => {
        const matchesSearch = mentor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.domain?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            mentor.experience?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = filterCategory === 'All' ||
            mentor.domain?.toLowerCase().includes(filterCategory.toLowerCase());

        return matchesSearch && matchesCategory;
    });

    // Get unique categories from mentors
    const categories = ['All', ...new Set(mentors.map(mentor => mentor.domain).filter(Boolean))];

    // Handle booking form submission
    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setSubmitLoading(true);

        try {
            const bookingPayload = {
                ...bookingForm,
                mentorId: bookingMentor._id,
                mentorName: bookingMentor.name
            };

            const response = await submitMentorshipBooking(bookingPayload);

            if (response.data.success) {
                setSubmitSuccess(true);
                // Keep success message visible for 2.5 seconds before closing
                setTimeout(() => {
                    setShowBookModal(false);
                    setSubmitSuccess(false);
                    setBookingForm({
                        name: '',
                        email: '',
                        phone: '',
                        sessionType: 'one-on-one',
                        preferredDate: '',
                        preferredTime: '',
                        topic: '',
                        experience: '',
                        goals: '',
                        specialRequests: ''
                    });
                }, 2500);
            }
        } catch (error) {
            console.error('Error submitting booking:', error);
            const errorMsg = error.response?.data?.message || error.message || 'Failed to book session. Please try again.';
            alert(errorMsg);
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleBookSession = (mentor) => {
        setBookingMentor(mentor);
        setShowBookModal(true);
    };

    const stats = [
        { icon: Users, label: "Expert Mentors", value: mentors.length, color: "text-emerald-400" },
        { icon: Clock, label: "Hours of Mentoring", value: "1000+", color: "text-blue-400" },
        { icon: Star, label: "Success Rate", value: "95%", color: "text-yellow-400" },
        { icon: Target, label: "Career Goals Achieved", value: "500+", color: "text-purple-400" }
    ];

    const features = [
        {
            icon: Video,
            title: "One-on-One Sessions",
            description: "Personalized guidance tailored to your specific career goals and challenges."
        },
        {
            icon: Users,
            title: "Group Mentoring",
            description: "Learn alongside peers in collaborative group sessions with industry experts."
        },
        {
            icon: Calendar,
            title: "Flexible Scheduling",
            description: "Book sessions at your convenience with our easy-to-use scheduling system."
        },
        {
            icon: BookOpen,
            title: "Career Roadmaps",
            description: "Get detailed career roadmaps and actionable steps to reach your goals."
        },
        {
            icon: MessageCircle,
            title: "24/7 Support",
            description: "Access to mentor communication channels for ongoing support and guidance."
        },
        {
            icon: Award,
            title: "Industry Expertise",
            description: "Learn from professionals working at top companies in the industry."
        }
    ];

    return (
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white min-h-screen overflow-x-hidden">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="relative py-20 px-4"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-blue-600/20 backdrop-blur-sm"></div>
                <div className="container mx-auto text-center relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-5xl md:text-6xl font-bold mb-6"
                    >
                        <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">
                            Mentorship Program
                        </span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto"
                    >
                        Connect with industry experts and accelerate your career growth with personalized guidance,
                        practical insights, and actionable roadmaps to success.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={() => document.getElementById('mentor-search').scrollIntoView({ behavior: 'smooth' })}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg shadow-emerald-500/25"
                        >
                            Find Your Mentor
                        </button>
                        <button
                            onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
                            className="border border-emerald-500/30 bg-emerald-500/5 text-emerald-400 hover:bg-emerald-500/10 px-8 py-3 rounded-full font-semibold transition-all duration-300"
                        >
                            Learn More
                        </button>
                    </motion.div>
                </div>
            </motion.div>

            {/* Stats Section */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="py-16 px-4"
            >
                <div className="container mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 * index }}
                                className="text-center"
                            >
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4 ${stat.color}`}>
                                    <stat.icon size={24} />
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">{stat.value}</h3>
                                <p className="text-gray-400 text-sm md:text-base">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Features Section */}
            <motion.div
                id="features"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="py-16 px-4 bg-gray-900/50"
            >
                <div className="container mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold mb-4">
                            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 text-transparent bg-clip-text">
                                Why Choose Our Mentorship?
                            </span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Our comprehensive mentorship program is designed to provide you with the support,
                            guidance, and resources you need to succeed in your career.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 * index }}
                                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
                            >
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-emerald-500/20 text-emerald-400 mb-4">
                                    <feature.icon size={24} />
                                </div>
                                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400">{feature.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Search and Filter Section */}
            <div id="mentor-search" className="py-12 px-4 scroll-mt-20">
                <div className="container mx-auto">
                    <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700 backdrop-blur-md">
                        <div className="flex flex-col lg:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="Search mentors by name, domain, or expertise..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                                <select
                                    value={filterCategory}
                                    onChange={(e) => setFilterCategory(e.target.value)}
                                    className="pl-10 pr-8 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent appearance-none cursor-pointer"
                                >
                                    {categories.map(category => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mentors Grid */}
            <div className="py-8 px-4">
                <div className="container mx-auto">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredMentors.map((mentor, index) => (
                                <motion.div
                                    key={mentor._id}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 * index }}
                                    className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 transform hover:-translate-y-1 group"
                                >
                                    <div className="p-6">
                                        <div className="flex items-center justify-center mb-6">
                                            {mentor.photo ? (
                                                <div className="relative">
                                                    <img
                                                        src={mentor.photo}
                                                        alt={mentor.name}
                                                        className="w-24 h-24 rounded-full object-cover border-4 border-emerald-500/30 group-hover:border-emerald-500 transition-colors duration-300"
                                                    />
                                                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1.5 border-2 border-gray-900 shadow-lg">
                                                        <CheckCircle size={12} className="text-white" />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                    <span className="text-2xl font-bold text-white">
                                                        {mentor.name?.charAt(0) || "M"}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold mb-1 text-center text-white group-hover:text-emerald-400 transition-colors">{mentor.name}</h2>
                                        <p className="text-emerald-500/80 text-center text-sm font-medium mb-4">{mentor.domain || 'Expert Mentor'}</p>

                                        <div className="space-y-3 mb-6 bg-gray-900/40 p-4 rounded-lg border border-gray-700/50">
                                            {mentor.experience && (
                                                <div className="flex items-center text-gray-300">
                                                    <Award size={16} className="mr-3 text-emerald-400" />
                                                    <span className="text-sm">{mentor.experience}</span>
                                                </div>
                                            )}

                                            <div className="flex items-center text-gray-300">
                                                <Target size={16} className="mr-3 text-emerald-400" />
                                                <span className="text-sm">Career Guidance</span>
                                            </div>

                                            <div className="flex items-center text-gray-300">
                                                <Linkedin size={16} className="mr-3 text-emerald-400" />
                                                <span className="text-sm">Verified Professional</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => setSelectedMentor(mentor)}
                                                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold border border-gray-600"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => handleBookSession(mentor)}
                                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-lg transition-all duration-300 text-sm font-semibold shadow-lg shadow-emerald-500/10"
                                            >
                                                Book Session
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    {!loading && filteredMentors.length === 0 && (
                        <div className="text-center py-20 bg-gray-800/20 rounded-2xl border border-gray-700/50">
                            <Users size={64} className="mx-auto text-gray-600 mb-4 opacity-50" />
                            <h3 className="text-2xl font-semibold text-gray-400 mb-2">No mentors found</h3>
                            <p className="text-gray-500">Try adjusting your search criteria or filters.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Mentor Profile Modal */}
            <AnimatePresence>
                {selectedMentor && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                        onClick={() => setSelectedMentor(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl p-0 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-700/50 flex-shrink-0">
                                <h2 className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">Mentor Profile</h2>
                                <button
                                    onClick={() => setSelectedMentor(null)}
                                    className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-8 custom-scrollbar">
                                <div className="flex flex-col md:flex-row gap-8 mb-8 items-center md:items-start text-center md:text-left">
                                    <div className="flex-shrink-0">
                                        {selectedMentor.photo ? (
                                            <img
                                                src={selectedMentor.photo}
                                                alt={selectedMentor.name}
                                                className="w-40 h-40 rounded-2xl object-cover border-4 border-emerald-500/30 shadow-2xl"
                                            />
                                        ) : (
                                            <div className="w-40 h-40 rounded-2xl bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center shadow-2xl">
                                                <span className="text-6xl font-bold text-white">
                                                    {selectedMentor.name?.charAt(0) || "M"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-bold text-white mb-2">{selectedMentor.name}</h3>
                                        <p className="text-emerald-400 text-lg font-medium mb-4">{selectedMentor.domain || 'Expert Mentor'}</p>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            {selectedMentor.experience && (
                                                <div className="flex items-center text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                                    <Award size={20} className="mr-3 text-emerald-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium">{selectedMentor.experience}</span>
                                                </div>
                                            )}
                                            {selectedMentor.email && (
                                                <div className="flex items-center text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                                    <Mail size={20} className="mr-3 text-emerald-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium truncate">{selectedMentor.email}</span>
                                                </div>
                                            )}
                                            {selectedMentor.phone && (
                                                <div className="flex items-center text-gray-300 bg-gray-800/50 p-3 rounded-xl border border-gray-700/50">
                                                    <Phone size={20} className="mr-3 text-emerald-400 flex-shrink-0" />
                                                    <span className="text-sm font-medium">{selectedMentor.phone}</span>
                                                </div>
                                            )}
                                            {selectedMentor.linkedin && (
                                                <a
                                                    href={selectedMentor.linkedin}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center text-blue-400 bg-blue-500/10 p-3 rounded-xl border border-blue-500/20 hover:bg-blue-500/20 transition-all"
                                                >
                                                    <Linkedin size={20} className="mr-3 flex-shrink-0" />
                                                    <span className="text-sm font-bold">LinkedIn Profile</span>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="bg-gray-800/30 p-6 rounded-2xl border border-gray-700/50">
                                        <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                                            <Briefcase size={20} className="mr-2 text-emerald-400" />
                                            Professional Background
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed">
                                            Expert in {selectedMentor.domain || 'various industry tools'} with dedicated experience in mentoring students and professionals. Focused on providing practical, results-oriented guidance for career excellence.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-center">
                                            <Heart size={24} className="mx-auto mb-2 text-emerald-400" />
                                            <span className="block text-white font-bold text-lg">98%</span>
                                            <span className="text-gray-500 text-xs">Satisfaction</span>
                                        </div>
                                        <div className="p-4 bg-blue-500/5 rounded-xl border border-blue-500/10 text-center">
                                            <Users size={24} className="mx-auto mb-2 text-blue-400" />
                                            <span className="block text-white font-bold text-lg">150+</span>
                                            <span className="text-gray-500 text-xs">Mentees</span>
                                        </div>
                                        <div className="p-4 bg-purple-500/5 rounded-xl border border-purple-500/10 text-center">
                                            <Target size={24} className="mx-auto mb-2 text-purple-400" />
                                            <span className="block text-white font-bold text-lg">48</span>
                                            <span className="text-gray-500 text-xs">Sessions</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-8 flex-col sm:flex-row">
                                    <button
                                        onClick={() => setSelectedMentor(null)}
                                        className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold border border-gray-700"
                                    >
                                        Close Profile
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleBookSession(selectedMentor);
                                            setSelectedMentor(null);
                                        }}
                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold shadow-xl shadow-emerald-500/20"
                                    >
                                        Book Sessions Now
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Book Session Modal */}
            <AnimatePresence>
                {showBookModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
                        onClick={() => setShowBookModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-900 border border-gray-700 rounded-2xl p-0 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center p-6 border-b border-gray-700/50 flex-shrink-0">
                                <div>
                                    <h2 className="text-2xl font-bold text-emerald-400 uppercase tracking-wider">Book a Session</h2>
                                    {bookingMentor && (
                                        <p className="text-gray-400 text-sm mt-1">Experience personalized guidance with <span className="text-emerald-400 font-bold">{bookingMentor.name}</span></p>
                                    )}
                                </div>
                                <button
                                    onClick={() => setShowBookModal(false)}
                                    className="p-2 hover:bg-gray-800 rounded-full text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="overflow-y-auto p-8 custom-scrollbar">
                                {submitSuccess ? (
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="text-center py-12"
                                    >
                                        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
                                            <CheckCircle size={48} className="text-emerald-500 animate-bounce-slow" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Booking Confirmed!</h3>
                                        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                                            Successfully scheduled your mentorship session. Our team will reach out with the meeting details shortly.
                                        </p>
                                        <button
                                            onClick={() => setShowBookModal(false)}
                                            className="bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-12 py-4 rounded-xl font-bold transition-all shadow-xl shadow-emerald-500/25"
                                        >
                                            Done
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Full Name *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={bookingForm.name}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                    placeholder="e.g. Rahul Sharma"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Email Address *
                                                </label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={bookingForm.email}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                    placeholder="rahul@example.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Phone Number *
                                                </label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={bookingForm.phone}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                    placeholder="+91 XXXXX XXXXX"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Session Type *
                                                </label>
                                                <select
                                                    value={bookingForm.sessionType}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, sessionType: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                                                >
                                                    <option value="one-on-one">One-on-One (60 min)</option>
                                                    <option value="group">Group Session (90 min)</option>
                                                    <option value="workshop">Workshop (2 hours)</option>
                                                    <option value="career-review">Career Review (45 min)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Preferred Date *
                                                </label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={bookingForm.preferredDate}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Preferred Time *
                                                </label>
                                                <select
                                                    value={bookingForm.preferredTime}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                                                >
                                                    <option value="">Select time slot</option>
                                                    <option value="09:00">9:00 AM</option>
                                                    <option value="10:00">10:00 AM</option>
                                                    <option value="11:00">11:00 AM</option>
                                                    <option value="14:00">2:00 PM</option>
                                                    <option value="15:00">3:00 PM</option>
                                                    <option value="16:00">4:00 PM</option>
                                                    <option value="17:00">5:00 PM</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Discussion Topic *
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={bookingForm.topic}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, topic: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                                                    placeholder="e.g. Career Transition, Mock Interview, System Design"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                    Current Experience Level *
                                                </label>
                                                <select
                                                    required
                                                    value={bookingForm.experience}
                                                    onChange={(e) => setBookingForm({ ...bookingForm, experience: e.target.value })}
                                                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all cursor-pointer"
                                                >
                                                    <option value="">Select your level</option>
                                                    <option value="beginner">Beginner (0-1 years)</option>
                                                    <option value="intermediate">Intermediate (1-3 years)</option>
                                                    <option value="experienced">Experienced (3-5 years)</option>
                                                    <option value="senior">Senior (5+ years)</option>
                                                    <option value="student">Student</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-emerald-500 uppercase mb-2 tracking-widest">
                                                Your Goals for this Session *
                                            </label>
                                            <textarea
                                                required
                                                value={bookingForm.goals}
                                                onChange={(e) => setBookingForm({ ...bookingForm, goals: e.target.value })}
                                                rows={4}
                                                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
                                                placeholder="What specifically do you want to achieve or learn?..."
                                            />
                                        </div>

                                        <div className="flex gap-4 pt-6">
                                            <button
                                                type="button"
                                                onClick={() => setShowBookModal(false)}
                                                className="flex-1 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold border border-gray-700"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={submitLoading}
                                                className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-4 rounded-xl transition-all duration-300 font-bold shadow-xl shadow-emerald-500/20 flex items-center justify-center overflow-hidden relative group"
                                            >
                                                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                                {submitLoading ? (
                                                    <div className="flex items-center">
                                                        <Loader2 size={20} className="animate-spin mr-3" />
                                                        <span>Processing...</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center">
                                                        <Send size={20} className="mr-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                        <span>Confirm Booking</span>
                                                    </div>
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
        </div>
    );
};

export default Mentorship;