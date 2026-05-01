import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast, Toaster } from 'sonner'; // Import Sonner

function ManageArticles() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [createMode, setCreateMode] = useState(false);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        codeSnippets: [],
    });
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/admin/articles`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setArticles(res.data);
            } catch (err) {
                toast.error('Failed to load articles'); // Use toast for error
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('tags', formData.tags);
        data.append('codeSnippets', JSON.stringify(formData.codeSnippets));
        files.forEach((file) => data.append('files', file));

        try {
            const res = await axios.post(`${VITE_API_URL}/articles`, data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            setArticles([...articles, res.data]);
            setCreateMode(false);
            setFormData({ title: '', content: '', tags: '', codeSnippets: [] });
            setFiles([]);
            toast.success('Article created successfully!'); // Use toast for success
        } catch (err) {
            toast.error('Failed to create article'); // Use toast for error
        }
    };

    const handleApprove = async (id) => {
        try {
            const res = await axios.put(`${VITE_API_URL}/admin/articles/approve/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setArticles(articles.map((article) => (article._id === id ? res.data : article)));
            toast.success('Article approved successfully!'); // Use toast for success
        } catch (err) {
            toast.error('Failed to approve article'); // Use toast for error
        }
    };

    const handleDeny = async (id) => {
        try {
            const res = await axios.put(`${VITE_API_URL}/admin/articles/deny/${id}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setArticles(articles.map((article) => (article._id === id ? res.data : article)));
            toast.success('Article denied successfully!'); // Use toast for success
        } catch (err) {
            toast.error('Failed to deny article'); // Use toast for error
        }
    };

    const handleDelete = async (id) => {
        // Use toast.promise for delete confirmation
        toast(
            <div>
                <p>Are you sure you want to delete this article?</p>
                <div className="flex space-x-2 mt-2">
                    <button
                        onClick={async () => {
                            try {
                                await axios.delete(`${VITE_API_URL}/articles/${id}`, {
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                });
                                setArticles(articles.filter((article) => article._id !== id));
                                toast.dismiss(); // Dismiss the confirmation toast
                                toast.success('Article deleted successfully!'); // Success toast
                            } catch (err) {
                                toast.dismiss(); // Dismiss the confirmation toast
                                toast.error('Failed to delete article'); // Error toast
                            }
                        }}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-500"
                    >
                        Delete
                    </button>
                    <button
                        onClick={() => toast.dismiss()}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                </div>
            </div>,
            { duration: Infinity } // Keep the toast until an action is taken
        );
    };

    return (
        <div className="min-h-screen py-16 px-4 overflow-x-hidden bg-gradient-to-br from-gray-900 via-black to-gray-800">
            <Toaster richColors position="top-right" /> {/* Add Toaster component */}
            <div className="container mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <p className="text-emerald-300 text-lg">Manage Your Article Collection</p>
                </div>

                {error && (
                    <div className="mb-8 p-4 bg-red-900/40 border border-red-700 rounded-lg text-center text-red-200">
                        {error}
                    </div>
                )}

                <div className="mb-8 flex justify-center">
                    <button
                        onClick={() => setCreateMode(!createMode)}
                        className="px-8 py-3 rounded-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-black font-semibold shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transform hover:scale-105 transition-all duration-300"
                    >
                        {createMode ? '× Cancel Creation' : '+ Create New Article'}
                    </button>
                </div>

                {createMode && (
                    <div className="mb-12 rounded-2xl shadow-2xl overflow-hidden border border-emerald-500/30 backdrop-blur-sm">
                        <div className="p-1 bg-gradient-to-r from-emerald-600 to-emerald-400">
                            <div className="bg-gray-900 p-8">
                                <h2 className="text-3xl font-bold mb-6 text-emerald-400">Create Article</h2>
                                <form onSubmit={handleCreateSubmit} className="space-y-6">
                                    <div>
                                        <label className="block text-emerald-300 text-sm font-medium mb-2">
                                            Title
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                            placeholder="Enter article title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-emerald-300 text-sm font-medium mb-2">
                                            Content
                                        </label>
                                        <div className="quill-dark">
                                            <ReactQuill
                                                value={formData.content}
                                                onChange={(value) => setFormData({ ...formData, content: value })}
                                                className="bg-gray-800 text-white border border-emerald-500/30 rounded-lg"
                                                theme="snow"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-emerald-300 text-sm font-medium mb-2">
                                            Tags (comma-separated)
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                            placeholder="e.g., tech, coding, tips"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-emerald-300 text-sm font-medium mb-2">
                                            Code Snippets
                                        </label>
                                        <textarea
                                            value={formData.codeSnippets.join('\n')}
                                            onChange={(e) => setFormData({ ...formData, codeSnippets: e.target.value.split('\n') })}
                                            className="w-full bg-gray-800/80 text-white px-4 py-3 rounded-lg border border-emerald-500/30 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
                                            placeholder="Enter code snippets (one per line)"
                                            rows="5"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-emerald-300 text-sm font-medium mb-2">
                                            Upload Images/PDFs
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                multiple
                                                onChange={(e) => setFiles([...e.target.files])}
                                                className="w-full text-emerald-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:text-white file:hover:bg-emerald-500 file:transition-colors file:cursor-pointer cursor-pointer"
                                                accept="image/*,application/pdf"
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-emerald-600 to-emerald-400 text-black font-bold py-4 rounded-lg hover:from-emerald-500 hover:to-emerald-300 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
                                    >
                                        Publish Article
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-emerald-400 border-t-transparent"></div>
                    </div>
                ) : articles.length === 0 ? (
                    <div className="text-center py-16 bg-gray-800/30 rounded-2xl border border-emerald-500/10">
                        <div className="text-emerald-300 text-7xl mb-4">⦻</div>
                        <p className="text-gray-300 text-xl">No articles available.</p>
                        <p className="text-gray-400 mt-2">Create your first article to get started.</p>
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl shadow-2xl border border-emerald-500/20">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead>
                                    <tr className="bg-gradient-to-r from-emerald-900 to-gray-800 text-emerald-300 text-left">
                                        <th className="py-4 px-6 font-semibold">Title</th>
                                        <th className="py-4 px-6 font-semibold">Author</th>
                                        <th className="py-4 px-6 font-semibold">Status</th>
                                        <th className="py-4 px-6 font-semibold">Created At</th>
                                        <th className="py-4 px-6 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-900/30">
                                    {articles.map((article) => (
                                        <tr
                                            key={article._id}
                                            className="bg-gray-900/70 backdrop-blur-sm hover:bg-gray-800/80 transition-colors"
                                        >
                                            <td className="py-4 px-6 text-white font-medium">{article.title}</td>
                                            <td className="py-4 px-6 text-gray-300">{article.author.name}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${article.status === 'published'
                                                        ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/50'
                                                        : article.status === 'pending'
                                                            ? 'bg-amber-900/50 text-amber-300 border border-amber-500/50'
                                                            : 'bg-red-900/50 text-red-300 border border-red-500/50'
                                                    }`}>
                                                    {article.status.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-gray-300">
                                                {new Date(article.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex space-x-3">
                                                    <Link
                                                        to={`/edit-article/${article._id}`}
                                                        className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(article._id)}
                                                        className="text-red-400 hover:text-red-300 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                    {article.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleApprove(article._id)}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeny(article._id)}
                                                                className="text-amber-400 hover:text-amber-300 transition-colors"
                                                            >
                                                                Deny
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageArticles;