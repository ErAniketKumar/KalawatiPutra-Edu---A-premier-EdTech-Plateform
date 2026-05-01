import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function MentorshipManager({ mentorships, setMentorships }) {
    const [mentorshipForm, setMentorshipForm] = useState({
        name: '', email: '', phone: '', linkedin: '', experience: '', domain: ''
    });
    const [editMentorship, setEditMentorship] = useState(null);
    const [photo, setPhoto] = useState(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(mentorshipForm).forEach(key => form.append(key, mentorshipForm[key]));
            if (photo) form.append('photo', photo);
            const response = await axios.post(`${VITE_API_URL}/admin/mentorships`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMentorships([...mentorships, response.data]);
            alert('Created successfully');
            setMentorshipForm({ name: '', email: '', phone: '', linkedin: '', experience: '', domain: '' });
            setPhoto(null);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating mentorship:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();
            Object.keys(editMentorship).forEach(key => form.append(key, editMentorship[key]));
            if (photo) form.append('photo', photo);
            const response = await axios.put(`${VITE_API_URL}/admin/mentorships/${editMentorship._id}`, form, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMentorships(mentorships.map(item => item._id === editMentorship._id ? response.data : item));
            alert('Updated successfully');
            setEditMentorship(null);
            setPhoto(null);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating mentorship:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this mentorship?')) return;
        try {
            await axios.delete(`${VITE_API_URL}/admin/mentorships/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMentorships(mentorships.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting mentorship:', err.response || err);
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">Manage Mentorships</h2>
            <ItemList
                items={mentorships}
                displayField="name"
                onEdit={setEditMentorship}
                onDelete={handleDelete}
                emptyMessage="No mentorships available."
            />
            {editMentorship && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Edit Mentorship</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            placeholder="Name"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.name}
                            onChange={(e) => setEditMentorship({ ...editMentorship, name: e.target.value })}
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.email}
                            onChange={(e) => setEditMentorship({ ...editMentorship, email: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Phone"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.phone}
                            onChange={(e) => setEditMentorship({ ...editMentorship, phone: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="LinkedIn"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.linkedin}
                            onChange={(e) => setEditMentorship({ ...editMentorship, linkedin: e.target.value })}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            className="mb-4"
                            onChange={(e) => setPhoto(e.target.files[0])}
                        />
                        <textarea
                            placeholder="Experience"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.experience}
                            onChange={(e) => setEditMentorship({ ...editMentorship, experience: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Domain"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editMentorship.domain}
                            onChange={(e) => setEditMentorship({ ...editMentorship, domain: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                                Update Mentorship
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMentorship(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2">Create Mentorship</h3>
            <form onSubmit={handleCreateSubmit}>
                <input
                    type="text"
                    placeholder="Name"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.name}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, name: e.target.value })}
                />
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.email}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, email: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Phone"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.phone}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, phone: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="LinkedIn"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.linkedin}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, linkedin: e.target.value })}
                />
                <input
                    type="file"
                    accept="image/*"
                    className="mb-4"
                    onChange={(e) => setPhoto(e.target.files[0])}
                />
                <textarea
                    placeholder="Experience"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.experience}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, experience: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Domain"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={mentorshipForm.domain}
                    onChange={(e) => setMentorshipForm({ ...mentorshipForm, domain: e.target.value })}
                />
                <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                    Create Mentorship
                </button>
            </form>
        </div>
    );
}

export default MentorshipManager;