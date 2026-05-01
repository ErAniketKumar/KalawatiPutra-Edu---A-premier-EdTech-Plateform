import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function DsapracticeManager({ dsapracticeQuestions, setDsapracticeQuestions }) {
    const [dsapracticeForm, setDsapracticeForm] = useState({ company: '', question: '', link: '', ytLink: '', topic: '', difficulty: '' });
    const [editDsapractice, setEditDsapractice] = useState(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const topics = [
        'array', 'string', 'linkedlist', 'stack', 'queue', 'tree',
        'dp', 'recursion', 'binarysearch', 'sorting', 'graph',
        'hashing', 'heap', 'trie', 'greedy', 'backtracking',
        'twopointers', 'slidingwindow', 'bitmanipulation',
        'segmenttree', 'matrix', 'maths', 'gametheory', 'divideandconquer'
    ];

    const difficulties = ['basic', 'easy', 'medium', 'hard'];

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${VITE_API_URL}/admin/dsapractice`, dsapracticeForm, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setDsapracticeQuestions([...dsapracticeQuestions, response.data]);
            alert('Created successfully');
            setDsapracticeForm({ company: '', question: '', link: '', ytLink: '', topic: '', difficulty: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating DSA practice question:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedPayload = {
                ...editDsapractice,
                company: Array.isArray(editDsapractice.company)
                    ? editDsapractice.company.join(', ')
                    : editDsapractice.company,
            };

            const response = await axios.put(
                `${VITE_API_URL}/admin/dsapractice/${editDsapractice._id}`,
                updatedPayload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            setDsapracticeQuestions(dsapracticeQuestions.map(item =>
                item._id === editDsapractice._id ? response.data : item
            ));
            alert('Updated successfully');
            setEditDsapractice(null);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating DSA practice question:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this DSA practice question?')) return;
        try {
            await axios.delete(`${VITE_API_URL}/admin/dsapractice/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setDsapracticeQuestions(dsapracticeQuestions.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting DSA practice question:', err.response || err);
        }
    };

    const handleYouTubeClick = (ytLink) => {
        if (ytLink) {
            window.open(ytLink, '_blank', 'noopener,noreferrer');
        } else {
            alert('No YouTube link available for this question');
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-8 rounded-xl shadow-2xl mb-8 transform transition-all duration-300 hover:shadow-[0_0_20px_rgba(76,175,80,0.3)] text-white">
            <h2 className="text-3xl font-bold mb-6 text-white">Manage DSA Practice Questions</h2>
            <ItemList
                items={dsapracticeQuestions}
                displayField="question"
                onEdit={setEditDsapractice}
                onDelete={handleDelete}
                onYouTubeClick={handleYouTubeClick}
                showYouTube={true}
                emptyMessage="No DSA practice questions available."
            />
            {editDsapractice && (
                <div className="mb-10 bg-[#252525] p-6 rounded-lg">
                    <h3 className="text-2xl font-semibold mb-4 text-white">Edit DSA Practice Question</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            placeholder="Company (e.g., Google)"
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.company}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, company: e.target.value.split(',').map(s => s.trim()) })}
                        />
                        <input
                            type="text"
                            placeholder="Question"
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.question}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, question: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Link (GFG/LeetCode)"
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.link}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, link: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="YouTube Link"
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.ytLink}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, ytLink: e.target.value })}
                        />
                        <select
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.topic}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, topic: e.target.value })}
                        >
                            <option value="">Select Topic</option>
                            {topics.map((topic) => (
                                <option key={topic} value={topic}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</option>
                            ))}
                        </select>
                        <select
                            className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                            value={editDsapractice.difficulty}
                            onChange={(e) => setEditDsapractice({ ...editDsapractice, difficulty: e.target.value })}
                        >
                            <option value="">Select Difficulty</option>
                            {difficulties.map((diff) => (
                                <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                            ))}
                        </select>
                        <div className="flex gap-4">
                            <button
                                type="submit"
                                className="bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#388E3C] transition-all duration-200"
                            >
                                Update DSA Practice
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditDsapractice(null)}
                                className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h3 className="text-2xl font-semibold mb-4 text-white">Create DSA Practice</h3>
            <form onSubmit={handleCreateSubmit} className="bg-[#252525] p-6 rounded-lg">
                <input
                    type="text"
                    placeholder="Company (e.g., Google)"
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.company}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, company: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Question"
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.question}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, question: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Link (GFG/LeetCode)"
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.link}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, link: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="YouTube Link"
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.ytLink}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, ytLink: e.target.value })}
                />
                <select
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.topic}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, topic: e.target.value })}
                >
                    <option value="">Select Topic</option>
                    {topics.map((topic) => (
                        <option key={topic} value={topic}>{topic.charAt(0).toUpperCase() + topic.slice(1)}</option>
                    ))}
                </select>
                <select
                    className="w-full p-3 mb-4 bg-[#2A2A2A] rounded-lg text-white border border-[#4CAF50]/30 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-all"
                    value={dsapracticeForm.difficulty}
                    onChange={(e) => setDsapracticeForm({ ...dsapracticeForm, difficulty: e.target.value })}
                >
                    <option value="">Select Difficulty</option>
                    {difficulties.map((diff) => (
                        <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
                    ))}
                </select>
                <button
                    type="submit"
                    className="bg-[#4CAF50] text-white px-6 py-2 rounded-lg hover:bg-[#388E3C] transition-all duration-200"
                >
                    Create DSA Practice
                </button>
            </form>
        </div>
    );
}

export default DsapracticeManager;