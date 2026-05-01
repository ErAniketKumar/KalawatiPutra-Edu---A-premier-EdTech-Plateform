import React, { useState } from 'react';
import axios from 'axios';
import ItemList from './ItemList';

function CollegeManager({ colleges, setColleges }) {
  const [collegeForm, setCollegeForm] = useState({
    name: '',
    about: '',
    courses: '',
    contact: '',
    website: '',
    feeStructure: '',
  });
  const [editCollege, setEditCollege] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_API_URL}/admin/colleges`, collegeForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setColleges([...colleges, response.data]);
      alert('Created successfully');
      setCollegeForm({ name: '', about: '', courses: '', contact: '', website: '', feeStructure: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
      alert(`Error creating: ${errorMsg}`);
      console.error('Error creating college:', err.response || err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${VITE_API_URL}/admin/colleges/${editCollege._id}`, editCollege, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      setColleges(colleges.map((item) => (item._id === editCollege._id ? response.data : item)));
      alert('Updated successfully');
      setEditCollege(null);
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
      alert(`Error updating: ${errorMsg}`);
      console.error('Error updating college:', err.response || err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this college?')) return;
    try {
      await axios.delete(`${VITE_API_URL}/admin/colleges/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setColleges(colleges.filter((item) => item._id !== id));
      alert('Deleted successfully');
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || 'Unknown error';
      alert(`Error deleting: ${errorMsg}`);
      console.error('Error deleting college:', err.response || err);
    }
  };

  return (
    <div className="bg-[#1E1E1E] p-6 rounded-lg shadow-xl mb-8 text-white">
      <h2 className="text-2xl font-semibold mb-4">Manage Colleges</h2>
      <ItemList
        items={colleges}
        displayField="name"
        onEdit={(item) => setEditCollege({ ...item, courses: item.courses.join(',') })}
        onDelete={handleDelete}
        emptyMessage="No colleges available."
      />
      {editCollege && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Edit College</h3>
          <form onSubmit={handleEditSubmit}>
            <input
              type="text"
              placeholder="Name"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.name}
              onChange={(e) => setEditCollege({ ...editCollege, name: e.target.value })}
            />
            <textarea
              placeholder="About"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.about}
              onChange={(e) => setEditCollege({ ...editCollege, about: e.target.value })}
            />
            <input
              type="text"
              placeholder="Courses (comma-separated)"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.courses}
              onChange={(e) => setEditCollege({ ...editCollege, courses: e.target.value })}
            />
            <input
              type="text"
              placeholder="Contact"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.contact}
              onChange={(e) => setEditCollege({ ...editCollege, contact: e.target.value })}
            />
            <input
              type="text"
              placeholder="Website"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.website}
              onChange={(e) => setEditCollege({ ...editCollege, website: e.target.value })}
            />
            <textarea
              placeholder="Fee Structure"
              className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
              value={editCollege.feeStructure}
              onChange={(e) => setEditCollege({ ...editCollege, feeStructure: e.target.value })}
            />
            <div className="flex gap-4">
              <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
                Update College
              </button>
              <button
                type="button"
                onClick={() => setEditCollege(null)}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">Create College</h3>
      <form onSubmit={handleCreateSubmit}>
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.name}
          onChange={(e) => setCollegeForm({ ...collegeForm, name: e.target.value })}
        />
        <textarea
          placeholder="About"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.about}
          onChange={(e) => setCollegeForm({ ...collegeForm, about: e.target.value })}
        />
        <input
          type="text"
          placeholder="Courses (comma-separated)"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.courses}
          onChange={(e) => setCollegeForm({ ...collegeForm, courses: e.target.value })}
        />
        <input
          type="text"
          placeholder="Contact"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.contact}
          onChange={(e) => setCollegeForm({ ...collegeForm, contact: e.target.value })}
        />
        <input
          type="text"
          placeholder="Website"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.website}
          onChange={(e) => setCollegeForm({ ...collegeForm, website: e.target.value })}
        />
        <textarea
          placeholder="Fee Structure"
          className="w-full p-2 mb-4 bg-[#2A2A2A] rounded text-white"
          value={collegeForm.feeStructure}
          onChange={(e) => setCollegeForm({ ...collegeForm, feeStructure: e.target.value })}
        />
        <button type="submit" className="bg-[#4CAF50] text-white px-4 py-2 rounded hover:bg-[#388E3C]">
          Create College
        </button>
      </form>
    </div>
  );
}

export default CollegeManager;