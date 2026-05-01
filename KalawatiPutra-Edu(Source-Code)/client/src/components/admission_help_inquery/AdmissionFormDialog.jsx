import React from 'react';
import { X, ChevronRight, User, Calendar, Users, Mail, Phone, MapPin, BookOpen } from 'lucide-react';

const AdmissionFormDialog = ({ isOpen, onClose, onSubmit, formData, setFormData }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-black border border-emerald-500/30 rounded-xl p-8 w-full max-w-xl relative animate-fade-in max-h-[85vh] overflow-y-auto shadow-lg shadow-emerald-500/20">
                {/* Decorative elements */}
                <div className="absolute -top-3 -left-3 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl"></div>
                <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-emerald-500/5 rounded-full blur-xl"></div>

                {/* Header with tech pattern */}
                <div className="relative mb-8">
                    <div className="absolute top-0 right-0 h-12 w-1/3">
                        <svg width="100%" height="100%" viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 20 L20 0 L40 20 L60 0 L80 20 L100 0" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                            <path d="M0 40 L20 20 L40 40 L60 20 L80 40 L100 20" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="1" />
                        </svg>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute -top-2 -right-2 text-gray-400 hover:text-emerald-400 transition-colors bg-gray-900 rounded-full p-1.5"
                    >
                        <X size={18} />
                    </button>

                    <h2 className="text-2xl font-bold text-white">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-500">
                            Admission Application
                        </span>
                    </h2>
                    <p className="text-gray-400 text-sm mt-1">Complete all fields to submit your application</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    <div className="space-y-5">
                        <div className="group">
                            <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                <User size={14} className="mr-1.5 text-emerald-500" />
                                Full Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                <Calendar size={14} className="mr-1.5 text-emerald-500" />
                                Date of Birth
                            </label>
                            <input
                                type="date"
                                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                value={formData.dob}
                                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                <Users size={14} className="mr-1.5 text-emerald-500" />
                                Father's Name
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                value={formData.fatherName}
                                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                                placeholder="Enter father's full name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="group">
                                <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                    <Mail size={14} className="mr-1.5 text-emerald-500" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                    <Phone size={14} className="mr-1.5 text-emerald-500" />
                                    Phone/WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+1 (123) 456-7890"
                                    required
                                />
                            </div>
                        </div>

                        <div className="group">
                            <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                <MapPin size={14} className="mr-1.5 text-emerald-500" />
                                Complete Address
                            </label>
                            <textarea
                                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all h-24 resize-none"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Enter your full address"
                                required
                            />
                        </div>

                        <div className="group">
                            <label className="flex items-center text-gray-300 text-sm font-medium mb-1.5 group-focus-within:text-emerald-400 transition-colors">
                                <BookOpen size={14} className="mr-1.5 text-emerald-500" />
                                Courses (comma-separated)
                            </label>
                            <input
                                type="text"
                                className="w-full p-3 bg-gray-900 border border-gray-800 focus:border-emerald-500/50 rounded-lg text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                value={formData.courses}
                                onChange={(e) => setFormData({ ...formData, courses: e.target.value })}
                                placeholder="e.g. Computer Science, Mathematics, Design"
                            />
                        </div>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center group"
                        >
                            <span>Submit Application</span>
                            <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <p className="text-center text-xs text-gray-500 mt-3">
                            By submitting, you agree to our Terms & Privacy Policy
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdmissionFormDialog;