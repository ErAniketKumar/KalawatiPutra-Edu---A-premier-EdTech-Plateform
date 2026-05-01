import React, { useState, useEffect } from 'react';
import { createCourse } from '../../api/academy';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

function CreateCourse() {
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to create a course');
      navigate('/login');
    }
  }, [navigate]);

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
    if (topicInput.title && topicInput.description) {
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
    setIsLoading(true);
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
          };
        }),
      }));

      data.append('modules', JSON.stringify(modules));

      await createCourse(data);

      alert('Course created successfully!');
      setFormData({ title: '', description: '', category: '', image: null, modules: [] });
      setModuleInput({ title: '', topics: [] });
      setTopicInput({ title: '', youtubeUrl: '', notes: null, description: '' });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) {
        setError('Unauthorized. Please log in again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 403) {
        setError('Only admins can create courses.');
      } else {
        setError('Error creating course. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen py-12 px-4 bg-grid-pattern">
      <Helmet>
        <title>Create a Course - KalawatiPutra Edu</title>
        <meta name="description" content="Create engaging online courses with KalawatiPutra Edu. Add modules, topics, and upload course thumbnails for a rich learning experience." />
        <meta name="keywords" content="create course, online learning, course creation, KalawatiPutra Edu, e-learning" />
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <div className="relative bg-black/50 backdrop-blur-sm rounded-xl border border-emerald-500/20 shadow-xl shadow-emerald-500/10 p-6 md:p-10">
          {/* Header */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
              Create Course
            </h1>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Course Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6 md:col-span-2">
                <h2 className="text-2xl font-semibold text-emerald-400 flex items-center">
                  <span className="w-2 h-8 bg-emerald-500 rounded-sm mr-3"></span>
                  Course Information
                </h2>
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">Course Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter course title"
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
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="Enter course category"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter course description"
                  rows="4"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-300 text-sm font-medium mb-2">Thumbnail Image (JPEG/PNG)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-emerald-500/50 transition-colors">
                  <div className="space-y-1 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="flex text-sm text-gray-400">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="image"
                          type="file"
                          accept="image/jpeg,image/png"
                          onChange={handleFormChange}
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-400">JPEG or PNG up to 10MB</p>
                  </div>
                </div>
                {formData.image && (
                  <p className="mt-2 text-sm text-emerald-400">
                    Selected: {formData.image.name}
                  </p>
                )}
              </div>
            </div>

            {/* Module Section */}
            <div className="pt-6 border-t border-gray-800">
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-emerald-400 flex items-center">
                  <span className="w-2 h-8 bg-emerald-500 rounded-sm mr-3"></span>
                  Add Modules
                </h2>

                <div className="grid grid-cols-1 gap-6 bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Module Title</label>
                    <input
                      type="text"
                      value={moduleInput.title}
                      onChange={handleModuleChange}
                      className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                      placeholder="Enter module title"
                    />
                  </div>

                  {/* Topic Section */}
                  <div className="space-y-4 p-6 bg-black/30 rounded-lg border border-gray-700">
                    <h3 className="text-lg font-medium text-emerald-300 border-b border-gray-700 pb-2">
                      Add Topics
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">Topic Title</label>
                        <input
                          type="text"
                          name="title"
                          value={topicInput.title}
                          onChange={handleTopicChange}
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
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
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                          placeholder="Enter YouTube URL"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Topic Description</label>
                        <textarea
                          name="description"
                          value={topicInput.description}
                          onChange={handleTopicChange}
                          className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                          placeholder="Enter topic description"
                          rows="3"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-gray-300 text-sm font-medium mb-2">Notes (PDF)</label>
                        <div className="mt-1 flex border border-gray-700 rounded-lg overflow-hidden">
                          <label className="w-full flex items-center bg-gray-800 cursor-pointer hover:bg-gray-700 transition-colors">
                            <span className="flex-shrink-0 p-2 bg-gray-900 text-emerald-400">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="p-2 text-sm text-gray-300 truncate">
                              {topicInput.notes ? topicInput.notes.name : "Select PDF file"}
                            </span>
                            <input
                              type="file"
                              name="notes"
                              accept="application/pdf"
                              onChange={handleTopicChange}
                              className="sr-only"
                            />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={addTopic}
                        className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Topic
                      </button>
                    </div>
                  </div>

                  {/* Display Added Topics */}
                  {moduleInput.topics.length > 0 && (
                    <div className="mt-4 bg-black/20 p-4 rounded-lg border border-gray-700">
                      <h3 className="text-md font-medium text-emerald-300 mb-2">Added Topics</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {moduleInput.topics.map((topic, index) => (
                          <div key={index} className="flex items-center bg-gray-800 p-2 rounded border border-gray-700">
                            <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                              <span className="text-emerald-300 text-sm font-bold">{index + 1}</span>
                            </div>
                            <div className="flex-grow">
                              <p className="text-sm font-medium text-gray-200">{topic.title}</p>
                              <p className="text-xs text-gray-400 truncate">{topic.youtubeUrl}</p>
                            </div>
                            {topic.notes && (
                              <div className="flex-shrink-0 ml-2">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-900 text-emerald-300">
                                  PDF
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={addModule}
                      className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Add Module
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Display Added Modules */}
            {formData.modules.length > 0 && (
              <div className="bg-black/30 p-6 rounded-lg border border-gray-700">
                <h3 className="text-lg font-medium text-emerald-400 mb-4">Added Modules</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {formData.modules.map((module, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center mr-3">
                          <span className="text-emerald-300 font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-white">{module.title}</p>
                          <p className="text-sm text-emerald-400">{module.topics.length} {module.topics.length === 1 ? 'topic' : 'topics'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`relative overflow-hidden w-full md:w-1/2 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white py-4 px-8 rounded-lg font-medium text-lg shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="relative z-10 flex items-center justify-center">
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Course
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add custom CSS for the grid pattern background */}
      <style jsx>{`
        .bg-grid-pattern {
          background-color: #111827; /* bg-gray-900 */
          background-image: 
            linear-gradient(to right, rgba(16, 185, 129, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(16, 185, 129, 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>
    </div>
  );
}

export default CreateCourse;