import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function CounselingManager({ counselingPosts, setCounselingPosts }) {
    const [counselingForm, setCounselingForm] = useState({ title: '', content: '' });
    const [editCounseling, setEditCounseling] = useState(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${VITE_API_URL}/admin/counseling`, counselingForm, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setCounselingPosts([...counselingPosts, response.data]);
            alert('Created successfully');
            setCounselingForm({ title: '', content: '' });
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating counseling post:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${VITE_API_URL}/admin/counseling/${editCounseling._id}`, editCounseling, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setCounselingPosts(counselingPosts.map(item => item._id === editCounseling._id ? response.data : item));
            alert('Updated successfully');
            setEditCounseling(null);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating counseling post:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this counseling post?')) return;
        try {
            await axios.delete(`${VITE_API_URL}/admin/counseling/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setCounselingPosts(counselingPosts.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting counseling post:', err.response || err);
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">Manage Counseling Posts</h2>
            <ItemList
                items={counselingPosts}
                displayField="title"
                onEdit={setEditCounseling}
                onDelete={handleDelete}
                emptyMessage="No counseling posts available."
            />
            {editCounseling && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Edit Counseling Post</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editCounseling.title}
                            onChange={(e) => setEditCounseling({ ...editCounseling, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Content"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editCounseling.content}
                            onChange={(e) => setEditCounseling({ ...editCounseling, content: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                                Update Counseling Post
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditCounseling(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2">Create Counseling Post</h3>
            <form onSubmit={handleCreateSubmit}>
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={counselingForm.title}
                    onChange={(e) => setCounselingForm({ ...counselingForm, title: e.target.value })}
                />
                <textarea
                    placeholder="Content"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={counselingForm.content}
                    onChange={(e) => setCounselingForm({ ...counselingForm, content: e.target.value })}
                />
                <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                    Create Counseling Post
                </button>
            </form>
        </div>
    );
}

export default CounselingManager;