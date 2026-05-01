import React, { useState, useEffect } from 'react';
import { getProblems, createProblem, updateProblem } from '../../api/problems';
import { Link, useNavigate } from 'react-router-dom';
import { Edit2, Plus, Trash2, Code } from 'lucide-react';

const ManageProblems = () => {
    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProblems();
    }, []);

    const fetchProblems = async () => {
        try {
            const res = await getProblems({});
            setProblems(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-black bg-opacity-70 p-6 rounded-lg shadow-card backdrop-blur-sm transform transition-all duration-300 hover:scale-[1.005]">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-emerald-400">Manage Problems</h2>
                <Link
                    to="/admin/problems/create"
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <Plus size={18} /> Add New Problem
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-300">
                    <thead className="text-xs uppercase bg-gray-800 text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Difficulty</th>
                            <th className="px-6 py-3">Public</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
                        ) : problems.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-4">No problems found.</td></tr>
                        ) : (
                            problems.map(prob => (
                                <tr key={prob._id} className="hover:bg-gray-800/50">
                                    <td className="px-6 py-4 font-medium">{prob.title}</td>
                                    <td className="px-6 py-4 text-emerald-500">{prob.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs ${prob.difficulty === 'Easy' ? 'bg-emerald-900 text-emerald-300' :
                                                prob.difficulty === 'Medium' ? 'bg-amber-900 text-amber-300' :
                                                    'bg-rose-900 text-rose-300'
                                            }`}>
                                            {prob.difficulty}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">{prob.isPublic ? 'Yes' : 'No'}</td>
                                    <td className="px-6 py-4 text-right flex justify-end gap-3">
                                        <Link
                                            to={`/admin/problems/edit/${prob.slug}`}
                                            className="text-blue-400 hover:text-blue-300"
                                        >
                                            <Edit2 size={18} />
                                        </Link>
                                        <Link
                                            to={`/labs/problem/${prob.slug}`}
                                            className="text-emerald-400 hover:text-emerald-300"
                                            target="_blank"
                                        >
                                            <Code size={18} />
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProblems;
