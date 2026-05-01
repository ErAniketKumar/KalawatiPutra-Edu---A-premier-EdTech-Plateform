import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectCards } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-cards';

const AdmissionManager = () => {
    const [admissionApplications, setAdmissionApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'cards'
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    
    const swiperRef = useRef(null);

    useEffect(() => {
        const fetchApplications = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${VITE_API_URL}/applications`);
                setAdmissionApplications(res.data);
                setFilteredApplications(res.data);
            } catch (err) {
                console.error('Error fetching admission applications:', err);
                alert('Error fetching admission applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    useEffect(() => {
        // Filter applications based on reference ID or name
        if (searchTerm.trim() === '') {
            setFilteredApplications(admissionApplications);
        } else {
            const filtered = admissionApplications.filter(app =>
                app.referenceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredApplications(filtered);
        }
    }, [searchTerm, admissionApplications]);

    const toggleAccordion = (index) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const ApplicationCard = ({ app }) => (
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl overflow-hidden border border-gray-700 h-full flex flex-col">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-4">
                <h3 className="text-xl font-bold text-white truncate">{app.name}</h3>
                <p className="text-green-100 text-sm">Ref: {app.referenceId}</p>
            </div>
            <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                    </div>
                    <span className="text-gray-300 text-sm">DOB: {new Date(app.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                    </div>
                    <span className="text-gray-300 text-sm truncate">{app.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                        </svg>
                    </div>
                    <span className="text-gray-300 text-sm">{app.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-gray-700 p-2 rounded-full">
                        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                        </svg>
                    </div>
                    <span className="text-gray-300 text-sm">
                        {app.courses.length > 0
                            ? (app.courses.length > 1
                                ? `${app.courses[0]} +${app.courses.length - 1}`
                                : app.courses[0])
                            : 'No courses'}
                    </span>
                </div>
                {app.collegeId && (
                    <div className="flex items-center space-x-2">
                        <div className="bg-gray-700 p-2 rounded-full">
                            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <span className="text-gray-300 text-sm truncate">{app.collegeId.name}</span>
                    </div>
                )}
            </div>
            <div className="p-4 bg-gray-800 border-t border-gray-700">
                <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400">
                        Submitted: {new Date(app.createdAt).toLocaleDateString()}
                    </span>
                    <button
                        className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1 rounded-full transition-colors"
                        onClick={(e) => {
                            e.stopPropagation();
                            alert(`View details for ${app.name}`);
                        }}
                    >
                        Details
                    </button>
                </div>
            </div>
        </div>
    );

    const DetailedApplicationView = ({ app }) => (
        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
            <div className="bg-gradient-to-r from-green-600 to-green-800 p-6">
                <h3 className="text-2xl font-bold text-white">{app.name}</h3>
                <p className="text-green-100">Reference ID: {app.referenceId}</p>
            </div>
            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h4 className="text-green-400 font-semibold">Personal Information</h4>
                        <p className="text-gray-300">
                            <span className="text-gray-400">Date of Birth:</span> {new Date(app.dob).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300">
                            <span className="text-gray-400">Father's Name:</span> {app.fatherName}
                        </p>
                    </div>
                    <div className="space-y-2">
                        <h4 className="text-green-400 font-semibold">Contact Information</h4>
                        <p className="text-gray-300">
                            <span className="text-gray-400">Email:</span> {app.email}
                        </p>
                        <p className="text-gray-300">
                            <span className="text-gray-400">Phone:</span> {app.phone}
                        </p>
                        <p className="text-gray-300">
                            <span className="text-gray-400">Address:</span> {app.address}
                        </p>
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="text-green-400 font-semibold">Academic Information</h4>
                    <p className="text-gray-300">
                        <span className="text-gray-400">Courses:</span>{' '}
                        {app.courses.length > 0 ? app.courses.join(', ') : 'None'}
                    </p>
                    <p className="text-gray-300">
                        <span className="text-gray-400">College:</span>{' '}
                        {app.collegeId ? app.collegeId.name : 'Unknown'}
                    </p>
                </div>
                <div className="border-t border-gray-700 pt-4">
                    <p className="text-gray-400 text-sm">
                        Application submitted on {new Date(app.createdAt).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-green-500 mb-4 sm:mb-0">
                        Admission Applications
                    </h1>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'list'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                                List
                            </div>
                        </button>
                        <button
                            onClick={() => setViewMode('cards')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'cards'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                        >
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
                                </svg>
                                Cards
                            </div>
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="mb-8">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by name or reference ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg py-3 px-4 pl-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent shadow-lg transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg
                                className="w-6 h-6 text-green-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                ) : filteredApplications.length === 0 ? (
                    <div className="bg-gray-800 rounded-xl p-8 text-center shadow-lg border border-gray-700">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <p className="text-xl text-gray-400">
                            {searchTerm ? "No applications found matching your search." : "No admission applications found."}
                        </p>
                    </div>
                ) : viewMode === 'list' ? (
                    <div className="space-y-4">
                        {filteredApplications.map((app, index) => (
                            <div
                                key={app._id || index}
                                className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-green-500 transition-all duration-300"
                            >
                                <button
                                    className="w-full p-5 text-left flex justify-between items-center hover:bg-gray-750 transition-colors"
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-green-600 rounded-full h-10 w-10 flex items-center justify-center text-white font-bold">
                                            {app.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <span className="text-lg font-semibold text-white">
                                                {app.name}
                                            </span>
                                            <p className="text-green-400 text-sm">
                                                Ref: {app.referenceId}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="hidden md:block text-right">
                                            <span className="text-gray-400 text-sm">
                                                {new Date(app.createdAt).toLocaleDateString()}
                                            </span>
                                            {app.collegeId && (
                                                <p className="text-gray-300 text-sm">
                                                    {app.collegeId.name}
                                                </p>
                                            )}
                                        </div>
                                        <svg
                                            className={`w-6 h-6 text-green-500 transform transition-transform ${activeAccordion === index ? 'rotate-180' : ''}`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </button>
                                {activeAccordion === index && (
                                    <div className="p-5 bg-gray-850 border-t border-gray-700">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="text-green-400 font-semibold mb-3">Personal Details</h3>
                                                <div className="space-y-2">
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Name:</span> {app.name}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Date of Birth:</span>{' '}
                                                        {new Date(app.dob).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Father's Name:</span> {app.fatherName}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-green-400 font-semibold mb-3">Contact Information</h3>
                                                <div className="space-y-2">
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Email:</span> {app.email}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Phone:</span> {app.phone}
                                                    </p>
                                                    <p className="text-gray-300">
                                                        <span className="text-gray-400">Address:</span> {app.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <h3 className="text-green-400 font-semibold mb-3">Academic Information</h3>
                                            <div className="space-y-2">
                                                <p className="text-gray-300">
                                                    <span className="text-gray-400">Courses:</span>{' '}
                                                    {app.courses.length > 0 ? app.courses.join(', ') : 'None'}
                                                </p>
                                                <p className="text-gray-300">
                                                    <span className="text-gray-400">College:</span>{' '}
                                                    {app.collegeId ? app.collegeId.name : 'Unknown'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 flex justify-end">
                                            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors">
                                                Process Application
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Card Swiper View */}
                        <div className="mb-4 flex justify-center sm:justify-end">
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => swiperRef.current?.swiper.slidePrev()}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => swiperRef.current?.swiper.slideNext()}
                                    className="bg-gray-800 hover:bg-gray-700 text-gray-300 p-2 rounded-full transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8">
                            <Swiper
                                ref={swiperRef}
                                modules={[Navigation, Pagination, EffectCards]}
                                spaceBetween={30}
                                slidesPerView={1}
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                    },
                                }}
                                pagination={{ clickable: true }}
                                className="w-full py-8"
                            >
                                {filteredApplications.map((app, index) => (
                                    <SwiperSlide key={app._id || index} className="pb-12">
                                        <ApplicationCard app={app} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {activeAccordion !== null && (
                                <div className="mt-8">
                                    <DetailedApplicationView app={filteredApplications[activeAccordion]} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default AdmissionManager;