import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById, updateCourse } from '../../api/academy';
import { Helmet } from 'react-helmet-async';

function EditCourse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image: null,
    modules: [],
  });
  const [moduleInput, setModuleInput] = useState({ title: '', topics: [] });
  const [topicInput, setTopicInput] = useState({
    title: '',
    youtubeUrl: '',
    notes: null,
    description: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to edit a course');
      navigate('/login');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        const courseData = res.data.success && res.data.data ? res.data.data : res.data;

        setFormData({
          title: courseData.title,
          description: courseData.description,
          category: courseData.category,
          image: null,
          modules: courseData.modules || [],
        });
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Unauthorized. Please log in again.');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError('Failed to load course');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, navigate]);

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      if (files[0] && !['image/jpeg', 'image/png'].includes(files[0].type)) {
        alert('Please upload a JPEG or PNG image');
        return;
      }
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleModuleChange = (e) => {
    setModuleInput({ ...moduleInput, title: e.target.value });
  };

  const handleTopicChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'notes') {
      if (files[0] && files[0].type !== 'application/pdf') {
        alert('Please upload a PDF file');
        return;
      }
      setTopicInput({ ...topicInput, notes: files[0] });
    } else {
      setTopicInput({ ...topicInput, [name]: value });
    }
  };

  const addTopic = () => {
    if (topicInput.title && topicInput.youtubeUrl && topicInput.description) {
      setModuleInput({
        ...moduleInput,
        topics: [...moduleInput.topics, { ...topicInput }],
      });
      setTopicInput({ title: '', youtubeUrl: '', notes: null, description: '' });
    } else {
      alert('Please fill all topic fields');
    }
  };

  const addModule = () => {
    if (moduleInput.title && moduleInput.topics.length > 0) {
      setFormData({
        ...formData,
        modules: [...formData.modules, moduleInput],
      });
      setModuleInput({ title: '', topics: [] });
    } else {
      alert('Please add a module title and at least one topic');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('category', formData.category);
      if (formData.image) {
        data.append('thumbnail', formData.image);
      }

      const modules = formData.modules.map((module, moduleIndex) => ({
        title: module.title,
        topics: module.topics.map((topic, topicIndex) => {
          if (topic.notes) {
            data.append(`notes_${moduleIndex}_${topicIndex}`, topic.notes);
          }
          return {
            title: topic.title,
            youtubeUrl: topic.youtubeUrl,
            description: topic.description,
            notesUrl: topic.notesUrl || '',
          };
        }),
      }));

      data.append('modules', JSON.stringify(modules));

      await updateCourse(id, data);

      alert('Course updated successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Only admins can update courses.');
      } else {
        setError('Failed to update course');
      }
    }
  };

  if (loading) return <div className="text-center text-gray-400">Loading...</div>;

  return (
    <div className="bg-[#000000] text-white min-h-screen flex items-center justify-center py-12 px-4">
      <Helmet>
        <title>Edit Course - KalawatiPutra Edu</title>
        <meta name="description" content="Edit your online courses with KalawatiPutra Edu. Update course details, modules, topics, and thumbnails." />
        <meta name="keywords" content="edit course, online learning, course management, KalawatiPutra Edu, e-learning" />
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="container mx-auto max-w-md flex justify-center items-center">
        <div className="bg-[#1E1E1E] rounded-lg shadow-xl py-10 px-20 transform transition-all hover:shadow-2xl w-full">
          <h1 className="text-3xl font-bold text-center mb-6">Edit Course</h1>
          {error && (
            <div className="bg-red-600 text-white p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                placeholder="Enter course title"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                placeholder="Enter course description"
                rows="6"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                placeholder="Enter course category"
                required
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">Thumbnail Image (JPEG/PNG)</label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/png"
                onChange={handleFormChange}
                className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
              />
            </div>

            {/* Module Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#4CAF50]">Add/Edit Modules</h2>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Module Title</label>
                <input
                  type="text"
                  value={moduleInput.title}
                  onChange={handleModuleChange}
                  className="w-full bg-[#2A2A2A] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                  placeholder="Enter module title"
                />
              </div>

              {/* Topic Section */}
              <div className="space-y-4 p-4 bg-[#2A2A2A] rounded-lg">
                <h3 className="text-lg font-medium text-gray-300">Add Topics</h3>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Topic Title</label>
                  <input
                    type="text"
                    name="title"
                    value={topicInput.title}
                    onChange={handleTopicChange}
                    className="w-full bg-[#333333] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                    placeholder="Enter topic title"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">YouTube URL</label>
                  <input
                    type="text"
                    name="youtubeUrl"
                    value={topicInput.youtubeUrl}
                    onChange={handleTopicChange}
                    className="w-full bg-[#333333] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                    placeholder="Enter YouTube URL"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Notes (PDF)</label>
                  <input
                    type="file"
                    name="notes"
                    accept="application/pdf"
                    onChange={handleTopicChange}
                    className="w-full bg-[#333333] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Topic Description</label>
                  <textarea
                    name="description"
                    value={topicInput.description}
                    onChange={handleTopicChange}
                    className="w-full bg-[#333333] text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] transition-colors"
                    placeholder="Enter topic description"
                    rows="3"
                  />
                </div>
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-transform transform hover:scale-105"
                >
                  Add Topic
                </button>
              </div>

              {/* Display Added Topics */}
              {moduleInput.topics.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-md font-medium text-gray-300">Added Topics</h3>
                  <ul className="list-disc pl-6 text-gray-400">
                    {moduleInput.topics.map((topic, index) => (
                      <li key={index}>
                        {topic.title} {topic.notes && `(PDF: ${topic.notes.name})`}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                type="button"
                onClick={addModule}
                className="bg-[#4CAF50] text-white px-4 py-2 rounded-lg hover:bg-[#388E3C] transition-transform transform hover:scale-105"
              >
                Add Module
              </button>
            </div>

            {/* Display Existing Modules */}
            {formData.modules.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-300">Existing Modules</h3>
                <ul className="list-disc pl-6 text-gray-400">
                  {formData.modules.map((module, index) => (
                    <li key={index}>
                      {module.title} ({module.topics.length} topics)
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#4CAF50] text-white py-3 rounded-lg hover:bg-[#388E3C] transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#4CAF50] focus:ring-offset-2 focus:ring-offset-[#1E1E1E]"
            >
              Update Course
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default EditCourse;