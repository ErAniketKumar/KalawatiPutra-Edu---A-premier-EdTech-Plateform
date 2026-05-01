import React, { useState } from 'react';
import { createRoadmap, updateRoadmap, deleteRoadmap } from '../../api';
import ItemList from './ItemList';

function RoadmapManager({ roadmaps, setRoadmaps }) {
    const initialFormState = {
        subject: '',
        content: '',
        category: 'programming',
        difficulty: 'Beginner',
        estimatedDuration: '40h',
        isCertificateAvailable: true
    };
    const [roadmapForm, setRoadmapForm] = useState(initialFormState);
    const [editRoadmap, setEditRoadmap] = useState(null);
    const [files, setFiles] = useState([]);

    const categories = ['programming', 'web development', 'data science', 'mobile development', 'devops'];
    const difficulties = ['Beginner', 'Intermediate', 'Expert'];

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(roadmapForm).forEach(key => form.append(key, roadmapForm[key]));
            files.forEach(file => form.append('files', file));
            const response = await createRoadmap(form);
            setRoadmaps([response.data, ...roadmaps]);
            alert('Created successfully');
            setRoadmapForm(initialFormState);
            setFiles([]);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating roadmap:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(editRoadmap).forEach(key => {
                if (key === 'files' || key === '_id' || key === '__v' || key === 'createdAt') return;
                form.append(key, editRoadmap[key]);
            });
            files.forEach(file => form.append('files', file));
            const response = await updateRoadmap(editRoadmap._id, form);
            setRoadmaps(roadmaps.map(item => item._id === editRoadmap._id ? response.data : item));
            alert('Updated successfully');
            setEditRoadmap(null);
            setFiles([]);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating roadmap:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this roadmap?')) return;
        try {
            await deleteRoadmap(id);
            setRoadmaps(roadmaps.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting roadmap:', err.response || err);
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-white">Manage Roadmaps</h2>
            <ItemList
                items={roadmaps}
                displayField="subject"
                onEdit={setEditRoadmap}
                onDelete={handleDelete}
                emptyMessage="No roadmaps available yet. Create one below!"
            />

            {editRoadmap && (
                <div className="mb-8 text-white bg-[#252525] p-6 rounded-lg border border-blue-500/30">
                    <h3 className="text-xl font-semibold mb-4 text-blue-400">Edit Roadmap</h3>
                    <form onSubmit={handleEditSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Subject</label>
                                <input
                                    type="text"
                                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                    value={editRoadmap.subject}
                                    onChange={(e) => setEditRoadmap({ ...editRoadmap, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Category</label>
                                <select
                                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                    value={editRoadmap.category}
                                    onChange={(e) => setEditRoadmap({ ...editRoadmap, category: e.target.value })}
                                >
                                    {categories.map(cat => <option key={cat} value={cat}>{cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Difficulty</label>
                                <select
                                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                    value={editRoadmap.difficulty}
                                    onChange={(e) => setEditRoadmap({ ...editRoadmap, difficulty: e.target.value })}
                                >
                                    {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Estimated Duration</label>
                                <input
                                    type="text"
                                    placeholder="e.g. 40h"
                                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                    value={editRoadmap.estimatedDuration}
                                    onChange={(e) => setEditRoadmap({ ...editRoadmap, estimatedDuration: e.target.value })}
                                />
                            </div>
                        </div>

                        <label className="block text-sm font-medium mb-1">Content / Overview</label>
                        <textarea
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700 h-32"
                            value={editRoadmap.content}
                            onChange={(e) => setEditRoadmap({ ...editRoadmap, content: e.target.value })}
                            required
                        />

                        <div className="flex items-center gap-2 mb-4">
                            <input
                                type="checkbox"
                                id="edit-cert"
                                checked={editRoadmap.isCertificateAvailable}
                                onChange={(e) => setEditRoadmap({ ...editRoadmap, isCertificateAvailable: e.target.checked })}
                                className="w-4 h-4 rounded border-gray-700 bg-[#2A2A2A]"
                            />
                            <label htmlFor="edit-cert" className="text-sm">Certificate Available</label>
                        </div>

                        <label className="block text-sm font-medium mb-1">Resources (Images/PDFs)</label>
                        <input
                            type="file"
                            multiple
                            accept="image/*,application/pdf"
                            className="mb-4 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-500/10 file:text-blue-400 hover:file:bg-blue-500/20"
                            onChange={(e) => setFiles([...e.target.files])}
                        />

                        <div className="flex gap-4">
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all">
                                Update Roadmap
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditRoadmap(null)}
                                className="bg-gray-700 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="text-white bg-[#252525] p-6 rounded-lg border border-emerald-500/20">
                <h3 className="text-xl font-semibold mb-4 text-emerald-400">Create New Roadmap</h3>
                <form onSubmit={handleCreateSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Subject</label>
                            <input
                                type="text"
                                placeholder="Roadmap Title"
                                className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                value={roadmapForm.subject}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, subject: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Category</label>
                            <select
                                className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                value={roadmapForm.category}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, category: e.target.value })}
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Difficulty</label>
                            <select
                                className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                value={roadmapForm.difficulty}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, difficulty: e.target.value })}
                            >
                                {difficulties.map(diff => <option key={diff} value={diff}>{diff}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Estimated Duration</label>
                            <input
                                type="text"
                                placeholder="e.g. 40h"
                                className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700"
                                value={roadmapForm.estimatedDuration}
                                onChange={(e) => setRoadmapForm({ ...roadmapForm, estimatedDuration: e.target.value })}
                            />
                        </div>
                    </div>

                    <label className="block text-sm font-medium mb-1">Content / Overview</label>
                    <textarea
                        placeholder="Provide a detailed description of this roadmap..."
                        className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white border border-gray-700 h-32"
                        value={roadmapForm.content}
                        onChange={(e) => setRoadmapForm({ ...roadmapForm, content: e.target.value })}
                        required
                    />

                    <div className="flex items-center gap-2 mb-4">
                        <input
                            type="checkbox"
                            id="create-cert"
                            checked={roadmapForm.isCertificateAvailable}
                            onChange={(e) => setRoadmapForm({ ...roadmapForm, isCertificateAvailable: e.target.checked })}
                            className="w-4 h-4 rounded border-gray-700 bg-[#2A2A2A]"
                        />
                        <label htmlFor="create-cert" className="text-sm">Certificate Available</label>
                    </div>

                    <label className="block text-sm font-medium mb-1">Resources (Images/PDFs)</label>
                    <input
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        className="mb-6 block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-500/10 file:text-emerald-400 hover:file:bg-emerald-500/20"
                        onChange={(e) => setFiles([...e.target.files])}
                    />

                    <button type="submit" className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg hover:bg-emerald-600 transition-all font-bold shadow-lg shadow-emerald-500/20">
                        Create Roadmap
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RoadmapManager;