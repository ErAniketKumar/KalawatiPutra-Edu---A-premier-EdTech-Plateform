import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { getCourses } from '../../api';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    BookOpen,
    ChevronRight,
    Clock,
    Tag,
    ArrowDown,
    Sparkles,
    Filter,
    Star,
    Users,
    BadgeCheck,
    Grid3X3,
    List,
    TrendingUp,
    Calendar,
    DollarSign,
    Play,
    Award,
    SlidersHorizontal,
    X
} from 'lucide-react';

function EnhancedCourses() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('grid');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Filter and search state
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        level: searchParams.get('level') || '',
        pricing: searchParams.get('pricing') || '',
        language: searchParams.get('language') || '',
        status: 'published'
    });

    const [sortOptions, setSortOptions] = useState({
        sortBy: searchParams.get('sortBy') || 'createdAt',
        sortOrder: searchParams.get('sortOrder') || 'desc'
    });

    const [pagination, setPagination] = useState({
        page: parseInt(searchParams.get('page')) || 1,
        limit: 12
    });

    const [metadata, setMetadata] = useState({
        total: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPrevPage: false
    });



    // Predefined filter options
    const filterOptions = {
        categories: [
            'Programming', 'Data Science', 'Web Development', 'Mobile Development',
            'AI/ML', 'Cybersecurity', 'DevOps', 'Database', 'Design', 'Business'
        ],
        levels: [
            { value: 'beginner', label: 'Beginner' },
            { value: 'intermediate', label: 'Intermediate' },
            { value: 'advanced', label: 'Advanced' },
            { value: 'expert', label: 'Expert' }
        ],
        pricingTypes: [
            { value: 'free', label: 'Free' },
            { value: 'paid', label: 'Paid' },
            { value: 'subscription', label: 'Subscription' }
        ],
        languages: [
            { value: 'english', label: 'English' },
            { value: 'hindi', label: 'Hindi' },
            { value: 'spanish', label: 'Spanish' },
            { value: 'french', label: 'French' }
        ],
        sortOptions: [
            { value: 'createdAt', label: 'Newest First', order: 'desc' },
            { value: 'title', label: 'Title A-Z', order: 'asc' },
            { value: 'title', label: 'Title Z-A', order: 'desc' },
            { value: 'enrollmentCount', label: 'Most Popular', order: 'desc' },
            { value: 'rating', label: 'Highest Rated', order: 'desc' },
            { value: 'pricing.price', label: 'Price Low to High', order: 'asc' },
            { value: 'pricing.price', label: 'Price High to Low', order: 'desc' }
        ]
    };

    // Fetch courses with advanced filtering
    const fetchCourses = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const queryParams = new URLSearchParams();

            // Add all filters to query params
            Object.entries(filters).forEach(([key, value]) => {
                if (value && value !== '') {
                    queryParams.append(key, value);
                }
            });

            // Add sort options
            Object.entries(sortOptions).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value);
                }
            });

            // Add pagination
            Object.entries(pagination).forEach(([key, value]) => {
                if (value) {
                    queryParams.append(key, value.toString());
                }
            });

            const { data } = await getCourses(queryParams);

            if (data.success) {
                setCourses(data.data.courses);
                setMetadata({
                    total: data.data.total,
                    totalPages: data.data.totalPages,
                    hasNextPage: data.data.hasNextPage,
                    hasPrevPage: data.data.hasPrevPage
                });
            } else {
                setError(data.message || 'Failed to fetch courses');
            }
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [filters, sortOptions, pagination, VITE_API_URL]);

    // Update URL parameters
    const updateURL = useCallback(() => {
        const params = new URLSearchParams();

        Object.entries({ ...filters, ...sortOptions }).forEach(([key, value]) => {
            if (value && value !== '' && key !== 'status') {
                params.set(key, value);
            }
        });

        if (pagination.page > 1) {
            params.set('page', pagination.page.toString());
        }

        setSearchParams(params);
    }, [filters, sortOptions, pagination, setSearchParams]);

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    const handleSortChange = (sortBy, sortOrder) => {
        setSortOptions({ sortBy, sortOrder });
        setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            category: '',
            level: '',
            pricing: '',
            language: '',
            status: 'published'
        });
        setSortOptions({
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    // Load more courses (pagination)
    const loadMore = () => {
        if (metadata.hasNextPage) {
            setPagination(prev => ({ ...prev, page: prev.page + 1 }));
        }
    };

    // Effects
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCourses();
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [fetchCourses]);

    useEffect(() => {
        updateURL();
    }, [updateURL]);

    // Computed values
    const hasActiveFilters = useMemo(() => {
        return Object.entries(filters).some(([key, value]) =>
            key !== 'status' && value && value !== ''
        );
    }, [filters]);

    const activeFilterCount = useMemo(() => {
        return Object.entries(filters).filter(([key, value]) =>
            key !== 'status' && value && value !== ''
        ).length;
    }, [filters]);

    // Course card component
    const CourseCard = ({ course, index }) => (
        <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`group bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-500/30 hover:-translate-y-1 ${viewMode === 'list' ? 'flex' : ''
                }`}
        >
            <div className={`relative overflow-hidden ${viewMode === 'list' ? 'w-64 flex-shrink-0' : ''}`}>
                {course.image ? (
                    <img
                        src={course.image}
                        alt={`${course.title} - KalawatiPutra Edu`}
                        className={`object-cover transition-transform duration-500 group-hover:scale-105 ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-56'
                            }`}
                        loading="lazy"
                    />
                ) : (
                    <div className={`bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center ${viewMode === 'list' ? 'w-full h-full' : 'w-full h-56'
                        }`}>
                        <BookOpen className="h-16 w-16 text-emerald-500/40" />
                    </div>
                )}

                {/* Status badges */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        {course.level}
                    </div>
                    {course.pricing?.type === 'free' && (
                        <div className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                            Free
                        </div>
                    )}
                    {course.certificateOffered && (
                        <div className="bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                            <Award className="h-3 w-3" />
                        </div>
                    )}
                </div>

                {/* Quick preview overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-full transition-colors">
                        <Play className="h-6 w-6" />
                    </button>
                </div>
            </div>

            <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-emerald-400" />
                    <p className="text-sm text-emerald-400 font-medium">{course.category}</p>
                    <span className="text-gray-500">•</span>
                    <p className="text-sm text-gray-400">{course.language}</p>
                </div>

                <h2 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-200 line-clamp-2">
                    {course.title}
                </h2>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {course.description}
                </p>

                {/* Course stats */}
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.metadata?.estimatedDuration || course.duration || 'Self-paced'}</span>
                    </div>
                    <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        <span>{course.enrollmentCount || 0} students</span>
                    </div>
                    <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.metadata?.totalTopics || 0} topics</span>
                    </div>
                </div>

                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                        {course.tags.length > 3 && (
                            <span className="text-xs bg-gray-700 text-gray-400 px-2 py-1 rounded">
                                +{course.tags.length - 3} more
                            </span>
                        )}
                    </div>
                )}

                <div className="border-t border-gray-800 pt-4">
                    <div className="flex items-center justify-between mb-4">
                        {/* Rating */}
                        <div className="flex items-center">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        className={`h-4 w-4 ${star <= (course.rating || 0)
                                            ? 'text-amber-400 fill-amber-400'
                                            : 'text-gray-600'
                                            }`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400 ml-1">
                                ({course.metadata?.totalReviews || 0})
                            </span>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                            {course.pricing?.type === 'free' ? (
                                <span className="text-green-400 font-bold">Free</span>
                            ) : (
                                <div className="flex items-center">
                                    {course.pricing?.originalPrice > course.pricing?.price && (
                                        <span className="text-gray-500 line-through text-sm mr-2">
                                            {course.pricing.currency} {course.pricing.originalPrice}
                                        </span>
                                    )}
                                    <span className="text-emerald-400 font-bold">
                                        {course.pricing?.currency} {course.pricing?.price || 0}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Updated: {new Date(course.updatedAt).toLocaleDateString()}
                        </div>
                        <Link
                            to={`/courses/${course.slug || course._id}`}
                            className="flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                        >
                            View Details
                            <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                        </Link>
                    </div>
                </div>
            </div>
        </motion.article>
    );

    return (
        <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 min-h-screen">
            <Helmet>
                <title>Advanced Courses - KalawatiPutra Edu</title>
                <meta
                    name="description"
                    content="Explore comprehensive software engineering courses with advanced filtering, search, and learning features at KalawatiPutra Edu."
                />
                <meta
                    name="keywords"
                    content="advanced courses, software engineering, programming, data science, web development, AI/ML, tech education"
                />
            </Helmet>

            {/* Hero Section */}
            <div className="relative overflow-hidden py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950"></div>
                <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -right-20 top-40 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-pulse"></div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-block mb-6"
                        >
                            <div className="flex items-center bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-500/20">
                                <Sparkles className="h-4 w-4 text-emerald-400 mr-2" />
                                <span className="text-sm font-medium text-emerald-400">Enhanced Learning Platform</span>
                            </div>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight"
                        >
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Technology</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto"
                        >
                            Discover, learn, and excel with our comprehensive course catalog featuring advanced search and personalized learning paths
                        </motion.p>

                        {/* Enhanced Search */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="relative max-w-2xl mx-auto group"
                        >
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                            <div className="relative bg-gray-900 rounded-xl">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-emerald-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search courses, topics, technologies..."
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                    className="w-full pl-12 pr-16 py-4 bg-gray-900 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                                <button
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                    className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors ${showAdvancedFilters
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-gray-800 hover:bg-gray-700 text-emerald-400'
                                        }`}
                                >
                                    <SlidersHorizontal className="h-5 w-5" />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showAdvancedFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-900/95 backdrop-blur-sm border-y border-gray-800"
                    >
                        <div className="container mx-auto px-4 py-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold text-white flex items-center">
                                    <Filter className="h-5 w-5 mr-2 text-emerald-400" />
                                    Advanced Filters
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </h3>
                                <div className="flex items-center gap-3">
                                    {hasActiveFilters && (
                                        <button
                                            onClick={clearFilters}
                                            className="text-gray-400 hover:text-white transition-colors text-sm flex items-center"
                                        >
                                            <X className="h-4 w-4 mr-1" />
                                            Clear All
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setShowAdvancedFilters(false)}
                                        className="text-gray-400 hover:text-white transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Category Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                                    <select
                                        value={filters.category}
                                        onChange={(e) => handleFilterChange('category', e.target.value)}
                                        className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">All Categories</option>
                                        {filterOptions.categories.map(category => (
                                            <option key={category} value={category}>{category}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Level Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Level</label>
                                    <select
                                        value={filters.level}
                                        onChange={(e) => handleFilterChange('level', e.target.value)}
                                        className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">All Levels</option>
                                        {filterOptions.levels.map(level => (
                                            <option key={level.value} value={level.value}>{level.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Pricing Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Pricing</label>
                                    <select
                                        value={filters.pricing}
                                        onChange={(e) => handleFilterChange('pricing', e.target.value)}
                                        className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">All Types</option>
                                        {filterOptions.pricingTypes.map(type => (
                                            <option key={type.value} value={type.value}>{type.label}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Language Filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Language</label>
                                    <select
                                        value={filters.language}
                                        onChange={(e) => handleFilterChange('language', e.target.value)}
                                        className="w-full bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-emerald-500"
                                    >
                                        <option value="">All Languages</option>
                                        {filterOptions.languages.map(lang => (
                                            <option key={lang.value} value={lang.value}>{lang.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Header */}
            <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {loading ? 'Loading...' : `${metadata.total} Courses Found`}
                        </h2>
                        {hasActiveFilters && (
                            <p className="text-gray-400">
                                Filtered by: {Object.entries(filters)
                                    .filter(([key, value]) => key !== 'status' && value)
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(', ')}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort Options */}
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400">Sort by:</span>
                            <select
                                value={`${sortOptions.sortBy}-${sortOptions.sortOrder}`}
                                onChange={(e) => {
                                    const [sortBy, sortOrder] = e.target.value.split('-');
                                    handleSortChange(sortBy, sortOrder);
                                }}
                                className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500"
                            >
                                {filterOptions.sortOptions.map(option => (
                                    <option key={`${option.value}-${option.order}`} value={`${option.value}-${option.order}`}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* View Mode Toggle */}
                        <div className="flex bg-gray-800 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <Grid3X3 className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-emerald-600 text-white' : 'text-gray-400 hover:text-white'}`}
                            >
                                <List className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Course Results */}
            <div className="container mx-auto px-4 pb-20">
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-pulse flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
                            <p className="text-emerald-400">Loading courses...</p>
                        </div>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="bg-red-500/20 border border-red-500 text-red-400 p-6 rounded-lg text-center max-w-md">
                            <h3 className="text-lg font-semibold mb-2">Error</h3>
                            <p>{error}</p>
                            <button
                                onClick={fetchCourses}
                                className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                                Try Again
                            </button>
                        </div>
                    </div>
                ) : courses.length > 0 ? (
                    <>
                        <div className={`${viewMode === 'grid'
                            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                            : 'space-y-6'
                            }`}>
                            {courses.map((course, index) => (
                                <CourseCard key={course._id} course={course} index={index} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {metadata.hasNextPage && (
                            <div className="mt-16 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="relative inline-flex items-center justify-center group"
                                >
                                    <span className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></span>
                                    <span className="relative flex items-center bg-gray-900 text-emerald-400 px-8 py-3 rounded-lg hover:text-white transition-all duration-300">
                                        <span className="mr-2">
                                            {loading ? 'Loading...' : `Load More (${metadata.total - courses.length} remaining)`}
                                        </span>
                                        <ArrowDown className="h-5 w-5 group-hover:translate-y-1 transition-transform duration-300" />
                                    </span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20">
                        <BookOpen className="h-16 w-16 text-gray-700 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-400 mb-2">No courses found</h3>
                        <p className="text-gray-500 text-center max-w-md mb-6">
                            {hasActiveFilters
                                ? "No courses match your current filters. Try adjusting your search criteria."
                                : "No courses are currently available. Please check back later."}
                        </p>
                        {hasActiveFilters && (
                            <button
                                onClick={clearFilters}
                                className="text-emerald-400 hover:text-emerald-300 font-medium"
                            >
                                Clear all filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default EnhancedCourses;
