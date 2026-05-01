import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function InternshipManager({ internships, setInternships }) {
    const [internshipForm, setInternshipForm] = useState({
        company: '', title: '', description: '', requirements: '', stipend: '', skills: '', deadline: '', applyLink: ''
    });
    const [editInternship, setEditInternship] = useState(null);
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${VITE_API_URL}/admin/internships`, internshipForm, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setInternships([...internships, response.data]);
            alert('Created successfully');
            setInternshipForm({
                company: '', title: '', description: '', requirements: '', stipend: '', skills: '', deadline: '', applyLink: ''
            });
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error creating: ${errorMsg}`);
            console.error('Error creating internship:', err.response || err);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${VITE_API_URL}/admin/internships/${editInternship._id}`, editInternship, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            setInternships(internships.map(item => item._id === editInternship._id ? response.data : item));
            alert('Updated successfully');
            setEditInternship(null);
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error updating: ${errorMsg}`);
            console.error('Error updating internship:', err.response || err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this internship?')) return;
        try {
            await axios.delete(`${VITE_API_URL}/admin/internships/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setInternships(internships.filter(item => item._id !== id));
            alert('Deleted successfully');
        } catch (err) {
            const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
            alert(`Error deleting: ${errorMsg}`);
            console.error('Error deleting internship:', err.response || err);
        }
    };

    return (
        <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8 text-white">
            <h2 className="text-2xl font-semibold mb-4">Manage Internships</h2>
            <ItemList
                items={internships}
                displayField="title"
                onEdit={(item) => setEditInternship({ ...item, requirements: item.requirements.join(','), skills: item.skills.join(',') })}
                onDelete={handleDelete}
                emptyMessage="No internships available."
            />
            {editInternship && (
                <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-2">Edit Internship</h3>
                    <form onSubmit={handleEditSubmit}>
                        <input
                            type="text"
                            placeholder="Company"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.company}
                            onChange={(e) => setEditInternship({ ...editInternship, company: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Title"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.title}
                            onChange={(e) => setEditInternship({ ...editInternship, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.description}
                            onChange={(e) => setEditInternship({ ...editInternship, description: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Requirements (comma-separated)"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.requirements}
                            onChange={(e) => setEditInternship({ ...editInternship, requirements: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Stipend"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.stipend}
                            onChange={(e) => setEditInternship({ ...editInternship, stipend: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Skills (comma-separated)"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.skills}
                            onChange={(e) => setEditInternship({ ...editInternship, skills: e.target.value })}
                        />
                        <input
                            type="date"
                            placeholder="Deadline"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.deadline ? editInternship.deadline.split('T')[0] : ''}
                            onChange={(e) => setEditInternship({ ...editInternship, deadline: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Apply Link"
                            className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                            value={editInternship.applyLink}
                            onChange={(e) => setEditInternship({ ...editInternship, applyLink: e.target.value })}
                        />
                        <div className="flex gap-4">
                            <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                                Update Internship
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditInternship(null)}
                                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
            <h3 className="text-xl font-semibold mb-2">Create Internship</h3>
            <form onSubmit={handleCreateSubmit}>
                <input
                    type="text"
                    placeholder="Company"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.company}
                    onChange={(e) => setInternshipForm({ ...internshipForm, company: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.title}
                    onChange={(e) => setInternshipForm({ ...internshipForm, title: e.target.value })}
                />
                <textarea
                    placeholder="Description"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.description}
                    onChange={(e) => setInternshipForm({ ...internshipForm, description: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Requirements (comma-separated)"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.requirements}
                    onChange={(e) => setInternshipForm({ ...internshipForm, requirements: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Stipend"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.stipend}
                    onChange={(e) => setInternshipForm({ ...internshipForm, stipend: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Skills (comma-separated)"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.skills}
                    onChange={(e) => setInternshipForm({ ...internshipForm, skills: e.target.value })}
                />
                <input
                    type="date"
                    placeholder="Deadline"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.deadline}
                    onChange={(e) => setInternshipForm({ ...internshipForm, deadline: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Apply Link"
                    className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
                    value={internshipForm.applyLink}
                    onChange={(e) => setInternshipForm({ ...internshipForm, applyLink: e.target.value })}
                />
                <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                    Create Internship
                </button>
            </form>
        </div>
    );
}

export default InternshipManager;