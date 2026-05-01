import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, Toaster } from 'sonner';

function EditArticle() {
    const { id } = useParams();
    const navigate = useNavigate();
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
        codeSnippets: '',
    });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const res = await axios.get(`${VITE_API_URL}/articles/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    title: res.data.title,
                    content: res.data.content,
                    tags: res.data.tags.join(', '),
                    codeSnippets: JSON.stringify(res.data.codeSnippets),
                });
                toast.success('Article loaded successfully');
            } catch (err) {
                toast.error('Failed to load article');
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, VITE_API_URL]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles(e.target.files);
        toast.info(`${e.target.files.length} file(s) selected`);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        toast.promise(
            async () => {
                setLoading(true);
                const data = new FormData();
                data.append('title', formData.title);
                data.append('content', formData.content);
                data.append('tags', formData.tags);
                data.append('codeSnippets', formData.codeSnippets);

                for (let i = 0; i < files.length; i++) {
                    data.append('files', files[i]);
                }

                const token = localStorage.getItem('token');
                await axios.put(`${VITE_API_URL}/articles/${id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setLoading(false);
                setTimeout(() => navigate('/dashboard'), 1000);
            },
            {
                loading: 'Updating article...',
                success: 'Article updated successfully!',
                error: 'Failed to update article',
            }
        );
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen flex items-center justify-center py-12 px-4">
            <Toaster position="top-right" richColors />

            <div className="container mx-auto max-w-2xl">
                <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                            Edit Article
                        </h1>
                        <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-emerald-600 mx-auto mt-2 rounded-full"></div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1">
                            <label className="block text-gray-300 text-sm font-medium">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Enter article title"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-300 text-sm font-medium">
                                Content
                            </label>
                            <textarea
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                placeholder="Enter article content"
                                rows="6"
                                required
                                disabled={loading}
                            ></textarea>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-300 text-sm font-medium">
                                Tags
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="tags"
                                    value={formData.tags}
                                    onChange={handleChange}
                                    className="w-full bg-gray-700 text-white pl-4 pr-10 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                    placeholder="e.g., tech, coding, tips"
                                    disabled={loading}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <span className="text-gray-400 text-xs">Comma-separated</span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-300 text-sm font-medium">
                                Code Snippets
                            </label>
                            <textarea
                                name="codeSnippets"
                                value={formData.codeSnippets}
                                onChange={handleChange}
                                className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-mono text-sm"
                                placeholder="Enter code snippets (JSON format)"
                                rows="5"
                                disabled={loading}
                            ></textarea>
                            <p className="text-gray-400 text-xs mt-1">JSON format required</p>
                        </div>

                        <div className="space-y-1">
                            <label className="block text-gray-300 text-sm font-medium">
                                Upload Files
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-lg hover:border-emerald-500 transition-colors">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-400">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none"
                                        >
                                            <span>Upload files</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                className="sr-only"
                                                onChange={handleFileChange}
                                                accept="image/*,application/pdf"
                                                disabled={loading}
                                            />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-400">Images & PDFs up to 10MB each</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-700 text-white py-3 rounded-lg font-medium transition-all hover:from-emerald-600 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Update Article'
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="w-full mt-4 bg-transparent border border-gray-600 text-gray-300 py-2 rounded-lg font-medium transition-all hover:bg-gray-700 focus:outline-none"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditArticle;