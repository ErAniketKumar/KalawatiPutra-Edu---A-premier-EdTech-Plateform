import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getCourses, getCourseStats, deleteCourse, updateCourseStatus } from '../../api/academy';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    MoreHorizontal,
    Users,
    Star,
    Clock,
    BookOpen,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Download,
    Upload,
    Settings,
    BarChart3,
    DollarSign
} from 'lucide-react';

function EnhancedManageCourses() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [courseStats, setCourseStats] = useState(null);
    const [actionLoading, setActionLoading] = useState({});

    // Filter and search state
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        level: '',
        status: '',
        pricing: ''
    });

    const [sortOptions, setSortOptions] = useState({
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });

    // Pagination
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10
    });

    const [metadata, setMetadata] = useState({
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });

    // Filter options
    const filterOptions = {
        categories: ['Programming', 'Data Science', 'Web Development', 'Mobile Development', 'AI/ML', 'Cybersecurity', 'DevOps', 'Database', 'Design', 'Business'],
        levels: ['beginner', 'intermediate', 'advanced', 'expert'],
        statuses: ['draft', 'review', 'published', 'archived'],
        pricingTypes: ['free', 'paid', 'subscription']
    };

    // Fetch courses with filters
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const params = {};

            // Add filters
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    params[key] = value;
                }
            });

            // Add sort options
            Object.entries(sortOptions).forEach(([key, value]) => {
                if (value) {
                    params[key] = value;
                }
            });

            // Add pagination
            Object.entries(pagination).forEach(([key, value]) => {
                if (value) {
                    params[key] = value;
                }
            });

            const response = await getCourses(params);

            if (response.data.success) {
                // Handle enhanced API response format
                const coursesData = response.data.data;
                const coursesArray = Array.isArray(coursesData) ? coursesData : [];

                setCourses(coursesArray);

                // Handle pagination metadata
                const paginationData = response.data.pagination || {};
                setMetadata({
                    total: paginationData.total || coursesArray.length,
                    totalPages: paginationData.totalPages || 1,
                    hasNextPage: paginationData.hasNextPage || false,
                    hasPrevPage: paginationData.hasPrevPage || false
                });
            } else {
                setError(response.data.message || 'Failed to fetch courses');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError(err.response?.data?.message || 'Failed to load courses');
        } finally {
            setLoading(false);
        }
    }, [filters, sortOptions, pagination]);

    // Fetch course statistics
    const fetchCourseStats = async () => {
        try {
            const response = await getCourseStats();

            if (response.data.success) {
                setCourseStats(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching course stats:', err);
        }
    };

    // Delete course
    const handleDelete = async (courseId) => {
        if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
            return;
        }

        setActionLoading(prev => ({ ...prev, [courseId]: 'deleting' }));

        try {
            await deleteCourse(courseId);

            setCourses(courses.filter(course => course._id !== courseId));
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } catch (err) {
            console.error('Error deleting course:', err);
            setError(err.response?.data?.message || 'Failed to delete course');
        } finally {
            setActionLoading(prev => ({ ...prev, [courseId]: null }));
        }
    };

    // Update course status
    const handleStatusChange = async (courseId, newStatus) => {
        setActionLoading(prev => ({ ...prev, [courseId]: 'updating' }));

        try {
            const response = await updateCourseStatus(courseId, newStatus);

            if (response.data.success) {
                setCourses(prev => {
                    const coursesArray = Array.isArray(prev) ? prev : [];
                    return coursesArray.map(course =>
                        course._id === courseId
                            ? { ...course, status: newStatus, isPublished: newStatus === 'published' }
                            : course
                    );
                });
            }
        } catch (err) {
            console.error('Error updating course status:', err);
            setError(err.response?.data?.message || 'Failed to update course status');
        } finally {
            setActionLoading(prev => ({ ...prev, [courseId]: null }));
        }
    };

    // Bulk actions
    const handleBulkAction = async (action) => {
        if (selectedCourses.length === 0) return;

        if (!window.confirm(`Are you sure you want to ${action} ${selectedCourses.length} selected courses?`)) {
            return;
        }

        // Implementation for bulk actions would go here
        console.log(`Bulk ${action} for courses:`, selectedCourses);
    };

    // Toggle course selection
    const toggleCourseSelection = (courseId) => {
        setSelectedCourses(prev =>
            prev.includes(courseId)
                ? prev.filter(id => id !== courseId)
                : [...prev, courseId]
        );
    };

    // Select all courses
    const toggleSelectAll = () => {
        const coursesArray = Array.isArray(courses) ? courses : [];
        setSelectedCourses(
            selectedCourses.length === coursesArray.length
                ? []
                : coursesArray.map(course => course._id)
        );
    };

    // Handle filter change
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Handle sort change
    const handleSortChange = (sortBy) => {
        setSortOptions(prev => ({
            sortBy,
            sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc'
        }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Clear filters
    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            level: '',
            status: '',
            pricing: ''
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Get status badge styling
    const getStatusBadge = (status) => {
        const badges = {
            draft: { icon: Edit, color: 'bg-gray-500', text: 'Draft' },
            review: { icon: AlertCircle, color: 'bg-yellow-500', text: 'Under Review' },
            published: { icon: CheckCircle, color: 'bg-green-500', text: 'Published' },
            archived: { icon: XCircle, color: 'bg-red-500', text: 'Archived' }
        };

        return badges[status] || badges.draft;
    };

    // Effects
    useEffect(() => {
        fetchCourses();
    }, [fetchCourses]);

    useEffect(() => {
        fetchCourseStats();
    }, []);

    return (
        <div className="bg-gray-900 text-white min-h-screen p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Course Management</h1>
                        <p className="text-gray-400">
                            Manage your courses, track performance, and analyze student engagement
                        </p>
                    </div>

                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <button
                            onClick={() => setShowStatsModal(true)}
                            className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Statistics
                        </button>

                        <Link
                            to="/admin/courses/create"
                            className="flex items-center bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Create Course
                        </Link>
                    </div>
                </div>

                {/* Stats Cards */}
                {courseStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Courses</p>
                                    <p className="text-2xl font-bold text-white">{courseStats.totalCourses}</p>
                                </div>
                                <BookOpen className="h-10 w-10 text-emerald-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Published</p>
                                    <p className="text-2xl font-bold text-white">{courseStats.publishedCourses}</p>
                                </div>
                                <CheckCircle className="h-10 w-10 text-green-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Total Enrollments</p>
                                    <p className="text-2xl font-bold text-white">{courseStats.totalEnrollments}</p>
                                </div>
                                <Users className="h-10 w-10 text-blue-500" />
                            </div>
                        </div>

                        <div className="bg-gray-800 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-400 text-sm">Drafts</p>
                                    <p className="text-2xl font-bold text-white">{courseStats.draftCourses}</p>
                                </div>
                                <Edit className="h-10 w-10 text-yellow-500" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters and Search */}
                <div className="bg-gray-800 rounded-lg p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search */}
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                                <input
                                    type="text"
                                    placeholder="Search courses..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={filters.category}
                                onChange={(e) => handleFilterChange('category', e.target.value)}
                                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">All Categories</option>
                                {filterOptions.categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>

                            <select
                                value={filters.level}
                                onChange={(e) => handleFilterChange('level', e.target.value)}
                                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">All Levels</option>
                                {filterOptions.levels.map(level => (
                                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                                ))}
                            </select>

                            <select
                                value={filters.status}
                                onChange={(e) => handleFilterChange('status', e.target.value)}
                                className="bg-gray-700 text-white px-3 py-2 rounded-lg border border-gray-600 focus:outline-none focus:border-emerald-500"
                            >
                                <option value="">All Statuses</option>
                                {filterOptions.statuses.map(status => (
                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                ))}
                            </select>

                            <button
                                onClick={clearFilters}
                                className="text-gray-400 hover:text-white transition-colors px-3 py-2"
                            >
                                Clear
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedCourses.length > 0 && (
                    <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between">
                            <span className="text-emerald-400">
                                {selectedCourses.length} course{selectedCourses.length !== 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleBulkAction('publish')}
                                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Publish
                                </button>
                                <button
                                    onClick={() => handleBulkAction('archive')}
                                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Archive
                                </button>
                                <button
                                    onClick={() => handleBulkAction('delete')}
                                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Courses Table */}
                <div className="bg-gray-800 rounded-lg overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                            <span className="ml-3 text-gray-400">Loading courses...</span>
                        </div>
                    ) : !Array.isArray(courses) || courses.length === 0 ? (
                        <div className="text-center py-12">
                            <BookOpen className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-400 mb-2">No courses found</h3>
                            <p className="text-gray-500">
                                {Object.values(filters).some(v => v)
                                    ? 'No courses match your current filters.'
                                    : 'Start by creating your first course.'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-700">
                                        <tr>
                                            <th className="px-6 py-3 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={Array.isArray(courses) && selectedCourses.length === courses.length}
                                                    onChange={toggleSelectAll}
                                                    className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                                                />
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('title')}>
                                                Course
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('category')}>
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('status')}>
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('enrollmentCount')}>
                                                Students
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('rating')}>
                                                Rating
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSortChange('createdAt')}>
                                                Created
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-700">
                                        {Array.isArray(courses) && courses.map((course) => {
                                            const statusBadge = getStatusBadge(course.status);
                                            const StatusIcon = statusBadge.icon;

                                            return (
                                                <tr key={course._id} className="hover:bg-gray-700/50 transition-colors">
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedCourses.includes(course._id)}
                                                            onChange={() => toggleCourseSelection(course._id)}
                                                            className="rounded border-gray-600 text-emerald-500 focus:ring-emerald-500"
                                                        />
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            {course.image ? (
                                                                <img
                                                                    src={course.image}
                                                                    alt={course.title}
                                                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                                                />
                                                            ) : (
                                                                <div className="h-10 w-10 bg-gray-600 rounded-lg flex items-center justify-center mr-3">
                                                                    <BookOpen className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div className="text-sm font-medium text-white truncate max-w-xs">
                                                                    {course.title}
                                                                </div>
                                                                <div className="text-sm text-gray-400 truncate max-w-xs">
                                                                    {course.level} • {course.language}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        {course.category}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <select
                                                                value={course.status}
                                                                onChange={(e) => handleStatusChange(course._id, e.target.value)}
                                                                disabled={actionLoading[course._id]}
                                                                className={`text-xs px-2 py-1 rounded-full border-none ${statusBadge.color} text-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
                                                            >
                                                                {filterOptions.statuses.map(status => (
                                                                    <option key={status} value={status}>
                                                                        {status.charAt(0).toUpperCase() + status.slice(1)}
                                                                    </option>
                                                                ))}
                                                            </select>
                                                            {actionLoading[course._id] === 'updating' && (
                                                                <RefreshCw className="h-4 w-4 ml-2 animate-spin text-emerald-500" />
                                                            )}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                                                            {course.enrollmentCount || 0}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        <div className="flex items-center">
                                                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                                                            {course.rating?.toFixed(1) || '0.0'}
                                                        </div>
                                                    </td>

                                                    <td className="px-6 py-4 text-sm text-gray-300">
                                                        {new Date(course.createdAt).toLocaleDateString()}
                                                    </td>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-2">
                                                            <Link
                                                                to={`/courses/${course.slug || course._id}`}
                                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                                title="View Course"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Link>

                                                            <Link
                                                                to={`/admin/courses/edit/${course._id}`}
                                                                className="text-emerald-400 hover:text-emerald-300 transition-colors"
                                                                title="Edit Course"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                            </Link>

                                                            <button
                                                                onClick={() => handleDelete(course._id)}
                                                                disabled={actionLoading[course._id]}
                                                                className="text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                                                title="Delete Course"
                                                            >
                                                                {actionLoading[course._id] === 'deleting' ? (
                                                                    <RefreshCw className="h-4 w-4 animate-spin" />
                                                                ) : (
                                                                    <Trash2 className="h-4 w-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {metadata.totalPages > 1 && (
                                <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
                                    <div className="text-sm text-gray-400">
                                        Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, metadata.total)} of {metadata.total} results
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                                            disabled={!metadata.hasPrevPage}
                                            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-500 transition-colors"
                                        >
                                            Previous
                                        </button>
                                        <span className="text-sm text-gray-400">
                                            Page {pagination.page} of {metadata.totalPages}
                                        </span>
                                        <button
                                            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(metadata.totalPages, prev.page + 1) }))}
                                            disabled={!metadata.hasNextPage}
                                            className="px-3 py-1 bg-gray-600 text-white rounded disabled:opacity-50 hover:bg-gray-500 transition-colors"
                                        >
                                            Next
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Statistics Modal */}
            <AnimatePresence>
                {showStatsModal && courseStats && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowStatsModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-white">Course Statistics</h2>
                                <button
                                    onClick={() => setShowStatsModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <XCircle className="h-6 w-6" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Categories */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Categories Distribution</h3>
                                    <div className="space-y-2">
                                        {courseStats.categoriesStats?.map((category, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-gray-300">{category._id}</span>
                                                <span className="text-emerald-400 font-medium">{category.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Levels */}
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-4">Level Distribution</h3>
                                    <div className="space-y-2">
                                        {courseStats.levelStats?.map((level, index) => (
                                            <div key={index} className="flex justify-between items-center">
                                                <span className="text-gray-300">{level._id}</span>
                                                <span className="text-emerald-400 font-medium">{level.count}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Popular Courses */}
                                <div className="md:col-span-2">
                                    <h3 className="text-lg font-semibold text-white mb-4">Most Popular Courses</h3>
                                    <div className="space-y-3">
                                        {courseStats.popularCourses?.map((course, index) => (
                                            <div key={course._id} className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
                                                <div>
                                                    <span className="text-white font-medium">{course.title}</span>
                                                    <div className="flex items-center mt-1">
                                                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                                                        <span className="text-gray-400 text-sm">{course.enrollmentCount} students</span>
                                                        <Star className="h-4 w-4 text-yellow-400 ml-3 mr-1" />
                                                        <span className="text-gray-400 text-sm">{course.rating}</span>
                                                    </div>
                                                </div>
                                                <span className="text-emerald-400 font-bold">#{index + 1}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default EnhancedManageCourses;
