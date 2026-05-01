import React, { useState, useEffect } from 'react';
import { getInternships } from '../../api';
import { Search, Briefcase, DollarSign, Calendar, Award, ChevronDown, ChevronUp, Clock, MapPin } from 'lucide-react';

const Internship = () => {
    const [internships, setInternships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedCard, setExpandedCard] = useState(null);

    useEffect(() => {
        const fetchInternships = async () => {
            try {
                const res = await getInternships();
                setInternships(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInternships();
    }, []);

    const filteredInternships = internships.filter(internship =>
        internship.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        internship.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (internship.skills && internship.skills.some(skill =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
        ))
    );

    const toggleExpand = (id) => {
        setExpandedCard(expandedCard === id ? null : id);
    };

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen py-16 px-4 overflow-x-hidden">
            <div className="container mx-auto overflow-hidden">
                <div className="mb-16 text-center relative">
                    <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">
                        Internship Opportunities
                    </h1>
                    <p className="text-emerald-400 text-lg max-w-2xl mx-auto">
                        Find your perfect internship match and launch your career in tech
                    </p>
                    <div className="absolute w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl -top-20 -left-20 animate-pulse"></div>
                    <div className="absolute w-64 h-64 rounded-full bg-emerald-500/10 blur-3xl -bottom-20 -right-20 animate-pulse"></div>
                </div>

                <div className="relative z-10 mb-10 max-w-lg mx-auto">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search by title, company, or skills..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-5 py-4 rounded-full bg-gray-900 border border-emerald-500/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                        />
                        <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-emerald-500" size={20} />
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-emerald-400 font-medium">Loading opportunities...</p>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-400 mb-6 text-center">
                            {filteredInternships.length} {filteredInternships.length === 1 ? 'opportunity' : 'opportunities'} available
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredInternships.map((internship) => (
                                <div
                                    key={internship._id}
                                    className={`bg-gray-900 rounded-xl overflow-hidden border border-gray-800 transition-all duration-300 hover:border-emerald-500/50 ${expandedCard === internship._id ? 'shadow-lg shadow-emerald-500/20' : ''
                                        }`}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start">
                                            <h2 className="text-xl font-bold text-emerald-400 mb-2 group-hover:text-white transition-colors">
                                                {internship.title}
                                            </h2>
                                            <button
                                                onClick={() => toggleExpand(internship._id)}
                                                className="text-emerald-500 hover:text-emerald-400 transition-colors"
                                            >
                                                {expandedCard === internship._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </button>
                                        </div>

                                        <div className="flex items-center mb-4">
                                            <Briefcase size={16} className="text-emerald-500 mr-2" />
                                            <p className="text-gray-300">{internship.company}</p>
                                        </div>

                                        {internship.description && (
                                            <p className={`text-gray-400 mb-4 ${expandedCard !== internship._id ? 'line-clamp-2' : ''}`}>
                                                {internship.description}
                                            </p>
                                        )}

                                        <div className={`space-y-3 ${expandedCard !== internship._id ? 'hidden' : 'block'}`}>
                                            {internship.requirements && (
                                                <div className="flex items-start">
                                                    <Award size={16} className="text-emerald-500 mr-2 mt-1 flex-shrink-0" />
                                                    <p className="text-gray-400">
                                                        <span className="text-gray-300 font-medium">Requirements:</span> {internship.requirements.join(', ')}
                                                    </p>
                                                </div>
                                            )}

                                            {internship.skills && (
                                                <div className="mt-3">
                                                    <p className="text-gray-300 font-medium mb-2">Skills:</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {internship.skills.map((skill, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-3 py-1 bg-emerald-900/30 text-emerald-400 text-sm rounded-full border border-emerald-800"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {internship.stipend && (
                                                <div className="flex items-center">
                                                    <DollarSign size={16} className="text-emerald-500 mr-2" />
                                                    <p className="text-gray-400">
                                                        <span className="text-gray-300 font-medium">Stipend:</span> {internship.stipend}
                                                    </p>
                                                </div>
                                            )}

                                            {internship.location && (
                                                <div className="flex items-center">
                                                    <MapPin size={16} className="text-emerald-500 mr-2" />
                                                    <p className="text-gray-400">
                                                        <span className="text-gray-300 font-medium">Location:</span> {internship.location}
                                                    </p>
                                                </div>
                                            )}

                                            {internship.duration && (
                                                <div className="flex items-center">
                                                    <Clock size={16} className="text-emerald-500 mr-2" />
                                                    <p className="text-gray-400">
                                                        <span className="text-gray-300 font-medium">Duration:</span> {internship.duration}
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {internship.deadline && (
                                            <div className="flex items-center mt-4">
                                                <Calendar size={16} className="text-emerald-500 mr-2" />
                                                <p className="text-gray-400">
                                                    <span className="text-gray-300 font-medium">Deadline:</span> {new Date(internship.deadline).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {internship.applyLink && (
                                        <div className={`px-6 pb-6 ${expandedCard === internship._id ? 'pt-2' : 'pt-0'}`}>
                                            <a
                                                href={internship.applyLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex w-full items-center justify-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-5 py-3 rounded-lg hover:from-emerald-500 hover:to-green-400 transition-all duration-300 font-medium"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {filteredInternships.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-gray-400 text-lg">No internships match your search criteria.</p>
                                <button
                                    className="mt-4 text-emerald-500 hover:text-emerald-400 underline"
                                    onClick={() => setSearchTerm('')}
                                >
                                    Clear search
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Internship;