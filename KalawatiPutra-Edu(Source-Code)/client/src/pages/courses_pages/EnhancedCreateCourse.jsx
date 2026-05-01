import React, { useState, useEffect } from 'react';
import { createCourse } from '../../api/academy';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';

function EnhancedCreateCourse() {
    const navigate = useNavigate();
    const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    const [formData, setFormData] = useState({
        // Basic Information
        title: '',
        description: '',
        category: '',
        level: 'beginner',
        language: 'english',
        image: null,

        // Pricing
        pricing: {
            type: 'free',
            price: 0,
            originalPrice: 0,
            currency: 'USD'
        },

        // Course Details
        prerequisites: [],
        learningOutcomes: [],
        tags: [],
        duration: '',
        certificateOffered: true,

        // SEO
        seo: {
            metaTitle: '',
            metaDescription: '',
            keywords: []
        },

        // Content
        modules: [],

        // Settings
        status: 'draft',
        isPublished: false,
        maxStudents: null
    });

    const [currentStep, setCurrentStep] = useState(1);
    const [moduleInput, setModuleInput] = useState({
        title: '',
        description: '',
        order: 1,
        topics: []
    });

    const [topicInput, setTopicInput] = useState({
        title: '',
        description: '',
        youtubeUrl: '',
        duration: 0,
        order: 1,
        notes: null,
        resources: []
    });

    const [prerequisiteInput, setPrerequisiteInput] = useState('');
    const [outcomeInput, setOutcomeInput] = useState('');
    const [tagInput, setTagInput] = useState('');
    const [keywordInput, setKeywordInput] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const steps = [
        { id: 1, name: 'Basic Info', icon: '📝' },
        { id: 2, name: 'Details', icon: '📋' },
        { id: 3, name: 'Pricing', icon: '💰' },
        { id: 4, name: 'Content', icon: '📚' },
        { id: 5, name: 'SEO', icon: '🔍' },
        { id: 6, name: 'Review', icon: '✅' }
    ];

    const categories = [
        'Programming', 'Data Science', 'Web Development', 'Mobile Development',
        'AI/ML', 'Cybersecurity', 'DevOps', 'Database', 'Design', 'Business'
    ];

    const levels = [
        { value: 'beginner', label: 'Beginner' },
        { value: 'intermediate', label: 'Intermediate' },
        { value: 'advanced', label: 'Advanced' },
        { value: 'expert', label: 'Expert' }
    ];

    const languages = [
        { value: 'english', label: 'English' },
        { value: 'hindi', label: 'Hindi' },
        { value: 'spanish', label: 'Spanish' },
        { value: 'french', label: 'French' }
    ];

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Please log in to create a course');
            navigate('/login');
        }
    }, [navigate]);

    // Auto-generate SEO fields
    useEffect(() => {
        if (formData.title) {
            setFormData(prev => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    metaTitle: prev.seo.metaTitle || formData.title,
                    metaDescription: prev.seo.metaDescription || formData.description.substring(0, 160)
                }
            }));
        }
    }, [formData.title, formData.description]);

    const handleFormChange = (e) => {
        const { name, value, files, type, checked } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
                }
            }));
        } else if (name === 'image') {
            if (files[0] && !['image/jpeg', 'image/png', 'image/webp'].includes(files[0].type)) {
                alert('Please upload a JPEG, PNG, or WebP image');
                return;
            }
            setFormData(prev => ({ ...prev, image: files[0] }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
            }));
        }
    };

    const handleArrayInput = (type, input, setInput) => {
        if (input.trim()) {
            setFormData(prev => ({
                ...prev,
                [type]: [...prev[type], input.trim()]
            }));
            setInput('');
        }
    };

    const removeArrayItem = (type, index) => {
        setFormData(prev => ({
            ...prev,
            [type]: prev[type].filter((_, i) => i !== index)
        }));
    };

    const handleTopicChange = (e) => {
        const { name, value, files, type } = e.target;
        if (name === 'notes') {
            if (files[0] && files[0].type !== 'application/pdf') {
                alert('Please upload a PDF file');
                return;
            }
            setTopicInput(prev => ({ ...prev, notes: files[0] }));
        } else {
            setTopicInput(prev => ({
                ...prev,
                [name]: type === 'number' ? Number(value) : value
            }));
        }
    };

    const addTopic = () => {
        if (topicInput.title && topicInput.description) {
            const newTopic = {
                ...topicInput,
                order: moduleInput.topics.length + 1,
                id: Date.now() // Temporary ID for frontend
            };
            setModuleInput(prev => ({
                ...prev,
                topics: [...prev.topics, newTopic]
            }));
            setTopicInput({
                title: '',
                description: '',
                youtubeUrl: '',
                duration: 0,
                order: 1,
                notes: null,
                resources: []
            });
        } else {
            alert('Please fill in topic title and description');
        }
    };

    const addModule = () => {
        if (moduleInput.title && moduleInput.topics.length > 0) {
            const newModule = {
                ...moduleInput,
                order: formData.modules.length + 1,
                id: Date.now() // Temporary ID for frontend
            };
            setFormData(prev => ({
                ...prev,
                modules: [...prev.modules, newModule]
            }));
            setModuleInput({
                title: '',
                description: '',
                order: 1,
                topics: []
            });
        } else {
            alert('Please add a module title and at least one topic');
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
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

            // Basic fields
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('category', formData.category);
            data.append('level', formData.level);
            data.append('language', formData.language);
            data.append('duration', formData.duration);
            data.append('certificateOffered', formData.certificateOffered);
            data.append('status', formData.status);
            data.append('isPublished', formData.isPublished);

            if (formData.maxStudents) {
                data.append('maxStudents', formData.maxStudents);
            }

            // Pricing
            data.append('pricing', JSON.stringify(formData.pricing));

            // Arrays
            data.append('prerequisites', JSON.stringify(formData.prerequisites));
            data.append('learningOutcomes', JSON.stringify(formData.learningOutcomes));
            data.append('tags', JSON.stringify(formData.tags));

            // SEO
            data.append('seo', JSON.stringify(formData.seo));

            // Image
            if (formData.image) {
                data.append('thumbnail', formData.image);
            }

            // Process modules and topics
            const modules = formData.modules.map((module, moduleIndex) => ({
                title: module.title,
                description: module.description,
                order: module.order,
                topics: module.topics.map((topic, topicIndex) => {
                    if (topic.notes) {
                        data.append(`notes_${moduleIndex}_${topicIndex}`, topic.notes);
                    }
                    return {
                        title: topic.title,
                        description: topic.description,
                        youtubeUrl: topic.youtubeUrl,
                        duration: topic.duration,
                        order: topic.order,
                        resources: topic.resources
                    };
                })
            }));

            data.append('modules', JSON.stringify(modules));

            await createCourse(data);

            alert('Course created successfully!');
            navigate('/admin/courses');
        } catch (err) {
            console.error('Error creating course:', err);
            if (err.response?.status === 401) {
                setError('Unauthorized. Please log in again.');
                localStorage.removeItem('token');
                navigate('/login');
            } else if (err.response?.status === 403) {
                setError('Only admins can create courses.');
            } else {
                setError(err.response?.data?.message || 'Error creating course. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Course Title *</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Enter course title"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Category *</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Level *</label>
                                <select
                                    name="level"
                                    value={formData.level}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {levels.map(level => (
                                        <option key={level.value} value={level.value}>{level.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    {languages.map(lang => (
                                        <option key={lang.value} value={lang.value}>{lang.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Estimated Duration</label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="e.g., 10 hours, 3 weeks"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    placeholder="Enter course description"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Course Thumbnail</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-emerald-500/50 transition-colors">
                                    <div className="space-y-1 text-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <div className="flex text-sm text-gray-400">
                                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-emerald-400 hover:text-emerald-300">
                                                <span>Upload a file</span>
                                                <input
                                                    id="file-upload"
                                                    name="image"
                                                    type="file"
                                                    accept="image/jpeg,image/png,image/webp"
                                                    onChange={handleFormChange}
                                                    className="sr-only"
                                                />
                                            </label>
                                            <p className="pl-1">or drag and drop</p>
                                        </div>
                                        <p className="text-xs text-gray-400">JPEG, PNG, or WebP up to 10MB</p>
                                    </div>
                                </div>
                                {formData.image && (
                                    <p className="mt-2 text-sm text-emerald-400">Selected: {formData.image.name}</p>
                                )}
                            </div>
                        </div>
                    </motion.div>
                );

            case 2:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Course Details</h3>

                        {/* Prerequisites */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Prerequisites</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={prerequisiteInput}
                                    onChange={(e) => setPrerequisiteInput(e.target.value)}
                                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Add prerequisite"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleArrayInput('prerequisites', prerequisiteInput, setPrerequisiteInput)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.prerequisites.map((prereq, index) => (
                                    <span key={index} className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {prereq}
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('prerequisites', index)}
                                            className="text-emerald-400 hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Learning Outcomes */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Learning Outcomes</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={outcomeInput}
                                    onChange={(e) => setOutcomeInput(e.target.value)}
                                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Add learning outcome"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleArrayInput('learningOutcomes', outcomeInput, setOutcomeInput)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.learningOutcomes.map((outcome, index) => (
                                    <span key={index} className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {outcome}
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('learningOutcomes', index)}
                                            className="text-emerald-400 hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block text-gray-300 text-sm font-medium mb-2">Tags</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Add tag"
                                />
                                <button
                                    type="button"
                                    onClick={() => handleArrayInput('tags', tagInput, setTagInput)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag, index) => (
                                    <span key={index} className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeArrayItem('tags', index)}
                                            className="text-emerald-400 hover:text-red-400"
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Max Students (Optional)</label>
                                <input
                                    type="number"
                                    name="maxStudents"
                                    value={formData.maxStudents || ''}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="Leave empty for unlimited"
                                    min="1"
                                />
                            </div>

                            <div className="flex items-center">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="certificateOffered"
                                        checked={formData.certificateOffered}
                                        onChange={handleFormChange}
                                        className="sr-only"
                                    />
                                    <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.certificateOffered ? 'bg-emerald-600' : 'bg-gray-600'}`}>
                                        <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.certificateOffered ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </div>
                                    <span className="ml-3 text-gray-300">Offer Certificate</span>
                                </label>
                            </div>
                        </div>
                    </motion.div>
                );

            case 3:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Pricing Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Pricing Type</label>
                                <select
                                    name="pricing.type"
                                    value={formData.pricing.type}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="free">Free</option>
                                    <option value="paid">Paid</option>
                                    <option value="subscription">Subscription</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Currency</label>
                                <select
                                    name="pricing.currency"
                                    value={formData.pricing.currency}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                >
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                    <option value="GBP">GBP</option>
                                    <option value="INR">INR</option>
                                </select>
                            </div>

                            {formData.pricing.type !== 'free' && (
                                <>
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Current Price</label>
                                        <input
                                            type="number"
                                            name="pricing.price"
                                            value={formData.pricing.price}
                                            onChange={handleFormChange}
                                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Original Price (for discounts)</label>
                                        <input
                                            type="number"
                                            name="pricing.originalPrice"
                                            value={formData.pricing.originalPrice}
                                            onChange={handleFormChange}
                                            className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {formData.pricing.originalPrice > formData.pricing.price && formData.pricing.price > 0 && (
                            <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 text-emerald-400">
                                    <span className="text-lg">💰</span>
                                    <span className="font-medium">Discount Preview</span>
                                </div>
                                <p className="text-gray-300 mt-2">
                                    Students will see: <span className="line-through text-gray-500">${formData.pricing.originalPrice}</span>
                                    <span className="text-emerald-400 font-bold ml-2">${formData.pricing.price}</span>
                                    <span className="text-sm text-emerald-300 ml-2">
                                        ({Math.round((1 - formData.pricing.price / formData.pricing.originalPrice) * 100)}% off)
                                    </span>
                                </p>
                            </div>
                        )}
                    </motion.div>
                );

            case 4:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Course Content</h3>

                        {/* Module Creation */}
                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700">
                            <h4 className="text-lg font-medium text-emerald-300 mb-4">Add Module</h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Module Title</label>
                                    <input
                                        type="text"
                                        value={moduleInput.title}
                                        onChange={(e) => setModuleInput(prev => ({ ...prev, title: e.target.value }))}
                                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Enter module title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Module Order</label>
                                    <input
                                        type="number"
                                        value={moduleInput.order}
                                        onChange={(e) => setModuleInput(prev => ({ ...prev, order: Number(e.target.value) }))}
                                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        min="1"
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm font-medium mb-2">Module Description</label>
                                <textarea
                                    value={moduleInput.description}
                                    onChange={(e) => setModuleInput(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    placeholder="Enter module description"
                                    rows="3"
                                />
                            </div>

                            {/* Topic Creation */}
                            <div className="bg-black/30 p-4 rounded-lg border border-gray-700">
                                <h5 className="text-md font-medium text-emerald-300 mb-3">Add Topic</h5>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Topic Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={topicInput.title}
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Enter topic title"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Duration (minutes)</label>
                                        <input
                                            type="number"
                                            name="duration"
                                            value={topicInput.duration}
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="0"
                                            min="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">YouTube URL</label>
                                        <input
                                            type="url"
                                            name="youtubeUrl"
                                            value={topicInput.youtubeUrl}
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            placeholder="https://youtube.com/watch?v=..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Topic Order</label>
                                        <input
                                            type="number"
                                            name="order"
                                            value={topicInput.order}
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                            min="1"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Topic Description</label>
                                        <textarea
                                            name="description"
                                            value={topicInput.description}
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                            placeholder="Enter topic description"
                                            rows="3"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-gray-300 text-sm font-medium mb-2">Notes (PDF)</label>
                                        <input
                                            type="file"
                                            name="notes"
                                            accept="application/pdf"
                                            onChange={handleTopicChange}
                                            className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-4">
                                    <button
                                        type="button"
                                        onClick={addTopic}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Add Topic
                                    </button>
                                </div>
                            </div>

                            {/* Display topics in module */}
                            {moduleInput.topics.length > 0 && (
                                <div className="mt-4">
                                    <h6 className="text-sm font-medium text-emerald-300 mb-2">Topics in this module:</h6>
                                    <div className="space-y-2">
                                        {moduleInput.topics.map((topic, index) => (
                                            <div key={topic.id} className="flex items-center justify-between bg-gray-800 p-3 rounded border border-gray-700">
                                                <div>
                                                    <p className="text-white font-medium">{topic.title}</p>
                                                    <p className="text-gray-400 text-sm">{topic.duration} minutes</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setModuleInput(prev => ({
                                                        ...prev,
                                                        topics: prev.topics.filter(t => t.id !== topic.id)
                                                    }))}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end mt-4">
                                <button
                                    type="button"
                                    onClick={addModule}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg transition-colors"
                                >
                                    Add Module
                                </button>
                            </div>
                        </div>

                        {/* Display added modules */}
                        {formData.modules.length > 0 && (
                            <div className="bg-black/30 p-6 rounded-lg border border-gray-700">
                                <h4 className="text-lg font-medium text-emerald-400 mb-4">Course Modules ({formData.modules.length})</h4>
                                <div className="space-y-4">
                                    {formData.modules.map((module, index) => (
                                        <div key={module.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h5 className="text-white font-medium">{module.title}</h5>
                                                    <p className="text-gray-400 text-sm">{module.topics.length} topics</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({
                                                        ...prev,
                                                        modules: prev.modules.filter(m => m.id !== module.id)
                                                    }))}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    Remove Module
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                );

            case 5:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">SEO Settings</h3>

                        <div className="grid grid-cols-1 gap-6">
                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Meta Title</label>
                                <input
                                    type="text"
                                    name="seo.metaTitle"
                                    value={formData.seo.metaTitle}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    placeholder="SEO title for search engines"
                                    maxLength="60"
                                />
                                <p className="text-gray-400 text-xs mt-1">{formData.seo.metaTitle.length}/60 characters</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">Meta Description</label>
                                <textarea
                                    name="seo.metaDescription"
                                    value={formData.seo.metaDescription}
                                    onChange={handleFormChange}
                                    className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                                    placeholder="SEO description for search engines"
                                    rows="3"
                                    maxLength="160"
                                />
                                <p className="text-gray-400 text-xs mt-1">{formData.seo.metaDescription.length}/160 characters</p>
                            </div>

                            <div>
                                <label className="block text-gray-300 text-sm font-medium mb-2">SEO Keywords</label>
                                <div className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={keywordInput}
                                        onChange={(e) => setKeywordInput(e.target.value)}
                                        className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Add SEO keyword"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (keywordInput.trim()) {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    seo: {
                                                        ...prev.seo,
                                                        keywords: [...prev.seo.keywords, keywordInput.trim()]
                                                    }
                                                }));
                                                setKeywordInput('');
                                            }
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                                    >
                                        Add
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.seo.keywords.map((keyword, index) => (
                                        <span key={index} className="bg-emerald-900/50 text-emerald-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                            {keyword}
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    seo: {
                                                        ...prev.seo,
                                                        keywords: prev.seo.keywords.filter((_, i) => i !== index)
                                                    }
                                                }))}
                                                className="text-emerald-400 hover:text-red-400"
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            case 6:
                return (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-semibold text-emerald-400 mb-4">Review & Publish</h3>

                        <div className="bg-gray-800/50 p-6 rounded-lg border border-gray-700 space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-gray-300 text-sm font-medium mb-2">Publication Status</label>
                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleFormChange}
                                        className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="review">Under Review</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>

                                <div className="flex items-center">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            name="isPublished"
                                            checked={formData.isPublished}
                                            onChange={handleFormChange}
                                            className="sr-only"
                                        />
                                        <div className={`relative w-12 h-6 rounded-full transition-colors ${formData.isPublished ? 'bg-emerald-600' : 'bg-gray-600'}`}>
                                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.isPublished ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                        </div>
                                        <span className="ml-3 text-gray-300">Publish Immediately</span>
                                    </label>
                                </div>
                            </div>

                            {/* Course Summary */}
                            <div className="border-t border-gray-700 pt-4">
                                <h4 className="text-lg font-medium text-emerald-300 mb-3">Course Summary</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Title:</span>
                                        <span className="text-white ml-2">{formData.title}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Category:</span>
                                        <span className="text-white ml-2">{formData.category}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Level:</span>
                                        <span className="text-white ml-2">{formData.level}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Price:</span>
                                        <span className="text-white ml-2">
                                            {formData.pricing.type === 'free' ? 'Free' : `${formData.pricing.currency} ${formData.pricing.price}`}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Modules:</span>
                                        <span className="text-white ml-2">{formData.modules.length}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Total Topics:</span>
                                        <span className="text-white ml-2">{formData.modules.reduce((total, module) => total + module.topics.length, 0)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-900 text-white min-h-screen py-12 px-4">
            <Helmet>
                <title>Create Advanced Course - KalawatiPutra Edu</title>
                <meta name="description" content="Create comprehensive online courses with advanced features including pricing, SEO optimization, and structured content management." />
                <meta name="robots" content="noindex" />
            </Helmet>

            <div className="container mx-auto max-w-6xl">
                <div className="bg-black/50 backdrop-blur-sm rounded-xl border border-emerald-500/20 shadow-xl p-6 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">
                            Create Advanced Course
                        </h1>
                        <div className="w-24 h-1 bg-emerald-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-between items-center mb-8 overflow-x-auto pb-2">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-col items-center min-w-0 flex-1">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-colors ${currentStep >= step.id ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {step.icon}
                                </div>
                                <span className={`text-xs mt-2 text-center ${currentStep >= step.id ? 'text-emerald-400' : 'text-gray-500'
                                    }`}>
                                    {step.name}
                                </span>
                                {index < steps.length - 1 && (
                                    <div className={`hidden md:block absolute w-full h-0.5 mt-6 transition-colors ${currentStep > step.id ? 'bg-emerald-600' : 'bg-gray-700'
                                        }`} style={{ left: '50%', width: 'calc(100% - 48px)' }}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6 text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-700">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={currentStep === 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${currentStep === 1
                                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                    : 'bg-gray-600 hover:bg-gray-500 text-white'
                                    }`}
                            >
                                Previous
                            </button>

                            <div className="flex gap-4">
                                {currentStep < steps.length ? (
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-3 rounded-lg font-medium transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg'
                                            }`}
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Course...
                                            </span>
                                        ) : (
                                            'Create Course'
                                        )}
                                    </button>
                                )}
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EnhancedCreateCourse;
