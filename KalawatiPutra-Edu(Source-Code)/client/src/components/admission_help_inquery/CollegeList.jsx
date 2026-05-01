import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdmissionSection from './AdmissionSection.jsx';

const CollegeList = ({ onApplyClick }) => {
    const [colleges, setColleges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCourse, setSelectedCourse] = useState('');
    const [courses, setCourses] = useState([]);
    const [visibleColleges, setVisibleColleges] = useState(6);
    const [expandedCollege, setExpandedCollege] = useState(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        const fetchColleges = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/admin/colleges`);
                setColleges(res.data);
                const allCourses = new Set();
                res.data.forEach(college => {
                    if (college.courses && Array.isArray(college.courses)) {
                        college.courses.forEach(course => allCourses.add(course));
                    }
                });
                setCourses(Array.from(allCourses));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchColleges();
    }, []);

    useEffect(() => {
        setVisibleColleges(6);
        setExpandedCollege(null);
    }, [searchTerm, selectedCourse]);

    const filteredColleges = colleges.filter(college => {
        const matchesSearch = college.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCourse = selectedCourse === '' ||
            (college.courses && college.courses.some(course =>
                course.toLowerCase().includes(selectedCourse.toLowerCase())
            ));
        return matchesSearch && matchesCourse;
    });

    const handleLoadMore = () => {
        setVisibleColleges((prev) => prev + 6);
    };

    const toggleExpand = (collegeId) => {
        setExpandedCollege(expandedCollege === collegeId ? null : collegeId);
    };

    return (
        <div className="bg-gray-900 min-h-screen py-16 px-6 sm:px-8 lg:px-12">
            {/* Hero Section with Floating Elements */}
            <div className="relative text-center mb-20">
                {/* Decorative Elements */}
                <div className="hidden md:block absolute top-10 left-10 w-12 h-12 rounded-full bg-emerald-500/20 animate-pulse"></div>
                <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 rounded-full bg-emerald-600/20 animate-ping"></div>
                <div className="hidden md:block absolute top-20 right-32 w-8 h-8 rounded-full bg-emerald-400/30 animate-bounce"></div>

                <h1 className="text-5xl md:text-6xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-600">
                    Discover Premier Colleges
                </h1>
                <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                    Find your dream institution, explore cutting-edge courses, and start your academic journey today.
                </p>

                <div className="flex flex-col md:flex-row justify-center items-center gap-4 max-w-3xl mx-auto relative">
                    {/* Search Bar with Glow Effect */}
                    <div className="relative w-full md:w-2/3 group">
                        <input
                            type="text"
                            placeholder="Search colleges..."
                            className="w-full px-6 py-4 bg-gray-800/50 backdrop-blur-sm text-gray-200 rounded-xl border border-gray-700 group-hover:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 placeholder-gray-500 shadow-lg group-hover:shadow-emerald-500/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Course Filter with Custom Styles */}
                    <select
                        className="w-full md:w-1/3 px-6 py-4 bg-gray-800/50 backdrop-blur-sm text-gray-200 rounded-xl border border-gray-700 hover:border-emerald-500/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all duration-300 shadow-lg appearance-none"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2334d399'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em', paddingRight: '3rem' }}
                    >
                        <option value="" className="text-gray-900">All Courses</option>
                        {courses.map((course, index) => (
                            <option key={index} value={course} className="text-gray-900">{course}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Colleges Section with Heading Animation */}
            <div className="relative">
                <h2 className="text-4xl font-bold text-center mb-12 text-gray-100">
                    <span className="relative inline-block">
                        Top Institutions
                        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 animate-pulse"></span>
                    </span>
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="relative w-20 h-20">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-emerald-500/30 rounded-full animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-t-4 border-emerald-500 rounded-full animate-spin"></div>
                        </div>
                    </div>
                ) : filteredColleges.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800/30 backdrop-blur-sm rounded-2xl max-w-3xl mx-auto border border-gray-700">
                        <svg className="w-16 h-16 mx-auto text-emerald-400/60 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-2xl text-gray-300 mb-6">No colleges found for your criteria</p>
                        <button
                            className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-emerald-500/30"
                            onClick={() => { setSearchTerm(''); setSelectedCourse('') }}
                        >
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredColleges.slice(0, visibleColleges).map((college) => (
                                <div
                                    key={college._id}
                                    className={`relative bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700 hover:border-emerald-500/50 transition-all duration-500 group flex flex-col shadow-xl hover:shadow-emerald-500/20 ${expandedCollege === college._id ? 'scale-105 z-10' : ''}`}
                                >
                                    {/* Card Header - Always visible */}
                                    <div
                                        className="relative p-6 bg-gradient-to-br from-gray-800 to-gray-900 cursor-pointer"
                                        onClick={() => toggleExpand(college._id)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="relative bg-emerald-500/20 p-4 rounded-xl backdrop-blur-sm group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                                                    <span className="text-emerald-400 font-bold text-2xl relative z-10">{college.name.substring(0, 2).toUpperCase()}</span>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">{college.name}</h2>
                                                    {college.courses && college.courses.length > 0 && (
                                                        <p className="text-sm text-emerald-400 mt-1">{college.courses.length} Courses Available</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className={`transform transition-transform duration-300 ${expandedCollege === college._id ? 'rotate-180' : ''}`}>
                                                <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Preview Content (Always Visible) */}
                                        <div className="mt-4">
                                            <p className="text-sm text-gray-300 line-clamp-2">{college.about || 'No description available'}</p>
                                        </div>

                                        {/* Quick Actions */}
                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center">
                                                {college.courses && college.courses.slice(0, 2).map((course, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300 mr-2"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                                {college.courses && college.courses.length > 2 && (
                                                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full">
                                                        +{college.courses.length - 2}
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                className="p-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/30 text-emerald-400 transition-colors duration-300"
                                                title="Save for later"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expandable Card Body */}
                                    <div
                                        className={`overflow-hidden transition-all duration-500 ${expandedCollege === college._id ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                            }`}
                                    >
                                        <div className="p-6 pt-0 border-t border-gray-700 mt-2">
                                            {/* Courses Section */}
                                            <div className="mt-4">
                                                <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    Courses Offered
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {college.courses && college.courses.length > 0 ? (
                                                        college.courses.map((course, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full hover:bg-emerald-600 hover:text-white transition-colors duration-300"
                                                            >
                                                                {course}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No courses listed</span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Fee Structure */}
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Fee Structure
                                                </h3>
                                                <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                                    <p className="text-emerald-400 font-medium">{college.feeStructure || 'Not available'}</p>
                                                </div>
                                            </div>

                                            {/* Contact Information */}
                                            <div className="mt-6">
                                                <h3 className="text-lg font-semibold text-emerald-400 mb-3 flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                                    </svg>
                                                    Contact Information
                                                </h3>
                                                <div className="space-y-3 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                                                    {college.contact && (
                                                        <div className="flex items-center text-sm">
                                                            <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                                            </svg>
                                                            <span className="text-gray-300">{college.contact}</span>
                                                        </div>
                                                    )}
                                                    {college.website && (
                                                        <div className="flex items-center text-sm">
                                                            <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                                                            </svg>
                                                            <a
                                                                href={college.website}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-gray-300 hover:text-emerald-400 truncate transition-colors duration-300"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                {college.website}
                                                            </a>
                                                        </div>
                                                    )}
                                                    {college.location && (
                                                        <div className="flex items-center text-sm">
                                                            <svg className="w-5 h-5 mr-3 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                            </svg>
                                                            <span className="text-gray-300">{college.location}</span>
                                                        </div>
                                                    )}
                                                    {!college.contact && !college.website && !college.location && (
                                                        <p className="text-gray-500 text-sm">No contact information available</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Apply Button */}
                                            <div className="mt-6">
                                                <button
                                                    className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:translate-y-1 shadow-lg hover:shadow-emerald-500/30 flex items-center justify-center gap-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onApplyClick(college._id);
                                                    }}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>
                                                    Apply Now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button with Animation */}
                        {visibleColleges < filteredColleges.length && (
                            <div className="mt-16 text-center">
                                <button
                                    onClick={handleLoadMore}
                                    className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 overflow-hidden shadow-lg hover:shadow-emerald-500/30"
                                >
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <span>Load More</span>
                                        <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                                        </svg>
                                    </span>
                                    <span className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Stats Section with Animated Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-24">
                {[
                    {
                        value: `${colleges.length}+`,
                        label: 'Top Colleges',
                        icon: (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                            </svg>
                        )
                    },
                    {
                        value: `${courses.length}+`,
                        label: 'Courses',
                        icon: (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        )
                    },
                    {
                        value: '1000+',
                        label: 'Happy Students',
                        icon: (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )
                    },
                    {
                        value: '24/7',
                        label: 'Expert Support',
                        icon: (
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )
                    },
                ].map((stat, index) => (
                    <div
                        key={index}
                        className="group bg-gray-800/30 backdrop-blur-sm p-8 rounded-xl text-center border border-gray-700 hover:border-emerald-500/50 transition-all duration-500 shadow-lg hover:shadow-emerald-500/20 relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-teal-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center text-emerald-400 bg-gray-800/50 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                            </div>
                            <h3 className="text-4xl font-bold text-emerald-400 mb-2 group-hover:scale-110 transition-transform duration-300">{stat.value}</h3>
                            <p className="text-gray-300">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            <AdmissionSection />
        </div>
    );
};

export default CollegeList;
