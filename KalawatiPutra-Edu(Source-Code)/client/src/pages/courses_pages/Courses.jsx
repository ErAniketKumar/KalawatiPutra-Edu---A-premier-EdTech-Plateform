import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getCourses } from '../../api/academy';
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
  BadgeCheck
} from 'lucide-react';

function Courses() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCourses, setVisibleCourses] = useState(6);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllCourses = async () => {
      try {
        const response = await getCourses();
        const data = response.data;

        console.log('API Response:', data);
        console.log('Type of data:', typeof data);
        console.log('data.success:', data.success);
        console.log('data.data:', data.data);
        console.log('Array.isArray(data.data):', Array.isArray(data.data));

        // Handle enhanced API response format
        let coursesArray = [];
        if (data.success && data.data) {
          // Enhanced API format: {success: true, data: courses}
          coursesArray = Array.isArray(data.data) ? data.data : [];
          console.log('Using enhanced format, coursesArray:', coursesArray);
        } else if (Array.isArray(data)) {
          // Legacy API format: direct array
          coursesArray = data;
          console.log('Using legacy format, coursesArray:', coursesArray);
        } else {
          console.warn('Unexpected response format:', data);
          coursesArray = [];
        }

        console.log('Final coursesArray:', coursesArray);
        console.log('Array.isArray(coursesArray):', Array.isArray(coursesArray));
        if (coursesArray.length > 0) {
          console.log('First course structure:', coursesArray[0]);
          console.log('First course title:', coursesArray[0]?.title);
          console.log('First course category:', coursesArray[0]?.category);
        }
        setCourses(coursesArray);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setCourses([]);
        setIsLoading(false);
      }
    };

    fetchAllCourses();
  }, []);

  // Filter courses based on search query and category filter
  const filteredCourses = Array.isArray(courses) && courses.length > 0 ? courses.filter((course) => {
    if (!course || typeof course !== 'object') return false;
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
    const matchesFilter = activeFilter === 'all' || course.category === activeFilter;
    console.log('Filtering course:', course.title, 'matchesSearch:', matchesSearch, 'matchesFilter:', matchesFilter, 'searchQuery:', searchQuery, 'activeFilter:', activeFilter, 'course.category:', course.category);
    return matchesSearch && matchesFilter;
  }) : [];

  console.log('filteredCourses:', filteredCourses, 'length:', filteredCourses.length);

  // Sort courses based on selected option
  const sortedCourses = Array.isArray(filteredCourses) ? [...filteredCourses].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    } else if (sortBy === 'popular') {
      return (b.enrollments || 0) - (a.enrollments || 0);
    }
    return 0;
  }) : [];

  console.log('sortedCourses:', sortedCourses, 'length:', sortedCourses.length);

  const handleLoadMore = () => {
    setVisibleCourses((prev) => prev + 6);
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Get unique categories for filter buttons
  const categories = ['all', ...new Set(courses.map(course => course.category))];
  console.log('categories:', categories, 'activeFilter:', activeFilter);

  // Structured Data for SEO
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "KalawatiPutra Edu",
    "url": "https://kalawatiputra.com",
    "logo": "https://kalawatiputra.com/images/kalawatiputra-logo.png",
    "description": "KalawatiPutra Edu offers expert-led courses, DSA roadmaps, MNC interview preparation, and career counseling.",
    "sameAs": [
      "https://www.linkedin.com/company/kalawatiputra-edu",
      "https://twitter.com/kalawatiputra",
    ]
  };

  // Structured Data for Courses
  const courseSchema = sortedCourses.map((course) => ({
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description,
    "provider": {
      "@type": "Organization",
      "name": "KalawatiPutra Edu",
      "sameAs": "https://kalawatiputra.com",
    },
    "url": `https://kalawatiputra.com/courses/${course._id}`,
    "image": course.image || "https://kalawatiputra.com/images/placeholder-course.jpg",
    "author": {
      "@type": "Person",
      "name": course.author?.name || "KalawatiPutra Edu",
    }
  }));

  return (
    <div className="bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 min-h-screen pb-20">
      <Helmet>
        <title>Professional Courses - KalawatiPutra Edu</title>
        <meta
          name="description"
          content="Explore expert-led software engineering courses at KalawatiPutra Edu, designed for Data Structures and Algorithms, MNC interview preparation, and career growth."
        />
        <meta
          name="keywords"
          content="software engineering courses, DSA courses, MNC interview preparation, KalawatiPutra Edu courses, coding bootcamp, tech education"
        />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        {courseSchema.map((schema, index) => (
          <script key={`course-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* Hero Section with Animated Gradient Background */}
      <div className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('/images/pattern-grid.svg')] bg-center opacity-5"></div>

        {/* Animated Glow Elements */}
        <div className="absolute -left-20 -top-20 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -right-20 top-40 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6">
              <div className="flex items-center bg-emerald-900/30 rounded-full px-4 py-2 border border-emerald-500/20">
                <Sparkles className="h-4 w-4 text-emerald-400 mr-2" />
                <span className="text-sm font-medium text-emerald-400">Transformative Learning Experience</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white leading-tight">
              Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Tech Career</span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Expert-led courses designed to transform you into a top-tier software professional through practical, industry-relevant curriculum
            </p>

            {/* Search Input with Glow Effect */}
            <div className="relative max-w-2xl mx-auto group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
              <div className="relative bg-gray-900 rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-emerald-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCourses(6); // Reset visible courses on search
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-900 text-white placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition duration-200"
                />
                <button
                  onClick={toggleFilters}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-800 hover:bg-gray-700 transition-colors p-2 rounded-lg"
                >
                  <Filter className="h-5 w-5 text-emerald-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className={`bg-gray-900/80 backdrop-blur-sm border-y border-gray-800 py-3 transition-all duration-300 ${showFilters ? 'opacity-100' : 'opacity-0 -translate-y-full hidden'}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveFilter(category)}
                  className={`px-4 py-2 text-sm rounded-full transition-all ${activeFilter === category
                    ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                >
                  {category === 'all' ? 'All Courses' : category}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 text-gray-300 text-sm rounded-lg px-3 py-2 border border-gray-700 focus:outline-none focus:border-emerald-500"
              >
                <option value="popular">Most Popular</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Courses */}
      <div className="container mx-auto px-4 mt-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mb-4"></div>
              <p className="text-emerald-400">Loading courses...</p>
            </div>
          </div>
        ) : sortedCourses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {sortedCourses.slice(0, visibleCourses).map((course) => (
                <article
                  key={course._id}
                  className="group bg-gradient-to-b from-gray-900 to-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-800 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-900/20 hover:border-emerald-500/30 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    {course.image ? (
                      <img
                        src={course.image}
                        alt={`${course.title} - KalawatiPutra Edu`}
                        className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-emerald-500/40" />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-emerald-500/20">
                      {course.level || "All Levels"}
                    </div>
                    {course.featured && (
                      <div className="absolute top-4 left-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg shadow-amber-500/20 flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center space-x-2 mb-3">
                      <Tag className="h-4 w-4 text-emerald-400" />
                      <p className="text-sm text-emerald-400 font-medium">{course.category}</p>
                    </div>

                    <h2 className="text-xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors duration-200">
                      {course.title}
                    </h2>

                    <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                      {course.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {course.tags && course.tags.map((tag, index) => (
                        <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="border-t border-gray-800 pt-4 mt-2">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="text-xs">{course.duration || "Self-paced"}</span>
                        </div>

                        <div className="flex items-center text-gray-400">
                          <Users className="h-4 w-4 mr-1" />
                          <span className="text-xs">{course.enrollments || 0} students</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= (course.rating || 4.5)
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-gray-600"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400 ml-1">
                            ({course.reviews || 0})
                          </span>
                        </div>

                        <Link
                          to={`/courses/${course._id}`}
                          className="flex items-center text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors duration-200"
                        >
                          View Details
                          <ChevronRight className="h-4 w-4 ml-1 group-hover:ml-2 transition-all" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Load More Button */}
            {visibleCourses < sortedCourses.length && (
              <div className="mt-16 text-center">
                <button
                  onClick={handleLoadMore}
                  className="relative inline-flex items-center justify-center mx-auto group"
                >
                  <span className="absolute -inset-0.5 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-300"></span>
                  <span className="relative flex items-center bg-gray-900 text-emerald-400 px-8 py-3 rounded-lg hover:text-white transition-all duration-300">
                    <span className="mr-2">Load More Courses</span>
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
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery
                ? `We couldn't find any courses matching "${searchQuery}". Try a different search term.`
                : "No courses are currently available. Please check back later."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;