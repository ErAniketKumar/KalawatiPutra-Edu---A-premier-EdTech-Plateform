import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProblems, getProblemStats, getUserProgress } from '../../api/problems';
import { motion } from 'framer-motion';
import { Code, CheckCircle, Circle, Database, Search, Filter, TrendingUp, Target, Award } from 'lucide-react';

const ProblemsList = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState({ difficulty: '', problemType: '', search: '' });
    const [stats, setStats] = useState(null);
    const [solvedProblems, setSolvedProblems] = useState(new Set());

    useEffect(() => {
        fetchProblems();
        fetchStats();
        fetchProgress();
    }, [filter.difficulty, filter.problemType]);

    const fetchProblems = async () => {
        setLoading(true);
        try {
            const res = await getProblems({
                difficulty: filter.difficulty,
                problemType: filter.problemType
            });
            setProblems(res.data);
        } catch (err) {
            console.error("Failed to fetch problems:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const res = await getProblemStats();
            setStats(res.data);
        } catch (err) {
            console.error("Failed to fetch stats:", err);
        }
    };

    const fetchProgress = async () => {
        try {
            const res = await getUserProgress();
            const solved = new Set(res.data.solvedProblems.map(p => p.slug));
            setSolvedProblems(solved);
        } catch (err) {
            console.error("Failed to fetch progress:", err);
        }
    };

    const difficultyColor = (diff) => {
        switch (diff) {
            case 'Easy': return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/30';
            case 'Medium': return 'text-amber-400 bg-amber-400/10 border-amber-400/30';
            case 'Hard': return 'text-rose-400 bg-rose-400/10 border-rose-400/30';
            default: return 'text-gray-400';
        }
    };

    const getStatByDifficulty = (difficulty) => {
        if (!stats?.byDifficulty) return { count: 0, totalSolved: 0 };
        return stats.byDifficulty.find(s => s._id === difficulty) || { count: 0, totalSolved: 0 };
    };

    const filteredProblems = problems.filter(p => 
        filter.search === '' || 
        p.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        p.tags?.some(t => t.toLowerCase().includes(filter.search.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-500">
                            Coding Labs
                        </h1>
                        <p className="text-gray-400 mt-2">Master DSA & SQL with our curated problem set</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <Award className="text-emerald-400" size={20} />
                        <span className="text-gray-400">Solved:</span>
                        <span className="text-emerald-400 font-semibold">{solvedProblems.size}</span>
                        <span className="text-gray-500">/ {stats?.total || 0}</span>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                            <Target size={16} />
                            <span>Total</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stats?.total || 0}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-emerald-900/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-emerald-400 text-sm mb-1">
                            <TrendingUp size={16} />
                            <span>Easy</span>
                        </div>
                        <div className="text-2xl font-bold text-emerald-400">{getStatByDifficulty('Easy').count}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-amber-900/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-amber-400 text-sm mb-1">
                            <TrendingUp size={16} />
                            <span>Medium</span>
                        </div>
                        <div className="text-2xl font-bold text-amber-400">{getStatByDifficulty('Medium').count}</div>
                    </div>
                    <div className="bg-gray-900/50 border border-rose-900/50 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-rose-400 text-sm mb-1">
                            <TrendingUp size={16} />
                            <span>Hard</span>
                        </div>
                        <div className="text-2xl font-bold text-rose-400">{getStatByDifficulty('Hard').count}</div>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            placeholder="Search problems or tags..."
                            className="w-full bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:ring-emerald-500 focus:border-emerald-500"
                            value={filter.search}
                            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                        />
                    </div>

                    {/* Difficulty Filter */}
                    <select
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2.5"
                        value={filter.difficulty}
                        onChange={(e) => setFilter({ ...filter, difficulty: e.target.value })}
                    >
                        <option value="">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                    </select>

                    {/* Problem Type Filter */}
                    <select
                        className="bg-gray-800 border border-gray-700 text-gray-300 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 px-4 py-2.5"
                        value={filter.problemType}
                        onChange={(e) => setFilter({ ...filter, problemType: e.target.value })}
                    >
                        <option value="">All Types</option>
                        <option value="DSA">DSA</option>
                        <option value="SQL">SQL</option>
                    </select>
                </div>

                {/* Problem List */}
                <div className="bg-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-800">
                    <table className="w-full text-left">
                        <thead className="bg-gray-800/80 text-gray-400 uppercase text-xs font-semibold">
                            <tr>
                                <th className="px-4 py-4 w-16">Status</th>
                                <th className="px-4 py-4">Title</th>
                                <th className="px-4 py-4 w-24 hidden sm:table-cell">Type</th>
                                <th className="px-4 py-4 w-28">Difficulty</th>
                                <th className="px-4 py-4 w-24 hidden md:table-cell">Acceptance</th>
                                <th className="px-4 py-4 w-24">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                                            Loading problems...
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProblems.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                                        No problems found.
                                    </td>
                                </tr>
                            ) : (
                                filteredProblems.map((problem, idx) => (
                                    <motion.tr
                                        key={problem._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.03 }}
                                        className="hover:bg-gray-800/50 transition-colors"
                                    >
                                        <td className="px-4 py-4">
                                            {solvedProblems.has(problem.slug) ? (
                                                <CheckCircle className="text-emerald-400" size={20} />
                                            ) : (
                                                <Circle className="text-gray-600" size={20} />
                                            )}
                                        </td>
                                        <td className="px-4 py-4">
                                            <Link 
                                                to={`/labs/problem/${problem.slug}`} 
                                                className="font-medium text-gray-200 hover:text-emerald-400 transition-colors"
                                            >
                                                {problem.title}
                                            </Link>
                                            <div className="flex flex-wrap gap-1.5 mt-1.5">
                                                {problem.tags?.slice(0, 3).map(tag => (
                                                    <span 
                                                        key={tag} 
                                                        className="bg-gray-800 text-gray-500 text-xs px-2 py-0.5 rounded-full border border-gray-700"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                                {problem.companies?.length > 0 && (
                                                    <span className="bg-blue-900/30 text-blue-400 text-xs px-2 py-0.5 rounded-full border border-blue-800/50">
                                                        {problem.companies[0]}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 hidden sm:table-cell">
                                            <span className={`flex items-center gap-1 text-xs ${problem.problemType === 'SQL' ? 'text-purple-400' : 'text-cyan-400'}`}>
                                                {problem.problemType === 'SQL' ? <Database size={14} /> : <Code size={14} />}
                                                {problem.problemType || 'DSA'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${difficultyColor(problem.difficulty)}`}>
                                                {problem.difficulty}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 hidden md:table-cell">
                                            <span className="text-gray-400 text-sm">
                                                {problem.acceptanceRate || 0}%
                                            </span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <Link
                                                to={`/labs/problem/${problem.slug}`}
                                                className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
                                            >
                                                Solve
                                                <Code size={14} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer info */}
                <div className="mt-4 text-center text-gray-500 text-sm">
                    Showing {filteredProblems.length} of {problems.length} problems
                </div>
            </div>
        </div>
    );
};

export default ProblemsList;
