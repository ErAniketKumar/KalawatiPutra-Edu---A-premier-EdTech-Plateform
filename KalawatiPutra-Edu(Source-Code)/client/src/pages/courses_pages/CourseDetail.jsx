import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getCourseById, getCourseContent, enrollCourse } from '../../api/academy';
import { Helmet } from 'react-helmet-async';
import { Toaster, toast } from 'sonner';
import CourseContent from '../../components/CourseContent.jsx';
import { ChevronLeft, User, Calendar, BookOpen, Tag, Award, Clock } from 'lucide-react';

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        // First, fetch public course details
        const courseRes = await getCourseById(id);
        console.log('Course details response:', courseRes.data);

        // Handle enhanced API response format
        let courseData = null;
        if (courseRes.data.success && courseRes.data.data) {
          // Enhanced API format: {success: true, data: course}
          courseData = courseRes.data.data;
        } else if (courseRes.data && !courseRes.data.success) {
          // Legacy API format: direct course object
          courseData = courseRes.data;
        } else {
          throw new Error('Invalid course data format');
        }

        setCourse(courseData);

        // Then, if user is logged in, fetch enrollment status and content
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const contentRes = await getCourseContent(id);

            console.log('Content response:', contentRes.data);

            // Handle enhanced API response format for content
            if (contentRes.data.success && contentRes.data.data) {
              const contentData = contentRes.data.data;
              setIsEnrolled(contentData.isEnrolled);
              setCompletedTopics(contentData.completedTopics || []);

              // Update course data with the full course content if available
              if (contentData.course) {
                setCourse(contentData.course);
              }
            } else {
              // Legacy format
              setIsEnrolled(contentRes.data.isEnrolled);
              setCompletedTopics(contentRes.data.completedTopics || []);
            }
          } catch (contentErr) {
            console.warn('Could not fetch enrollment status:', contentErr);
            // Don't set error here, just continue with public course view
          }
        }
      } catch (err) {
        console.error('Error fetching course details:', err);
        setError(err.response?.data?.message || 'Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourseDetails();
  }, [id]);

  const handleEnroll = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to enroll');
        return;
      }
      await enrollCourse(id);
      setIsEnrolled(true);
      toast.success('Enrolled successfully!');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to enroll');
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Calculate course metrics
  const calculateCourseMetrics = () => {
    if (!course || !course.modules) return { totalTopics: 0, totalDuration: 0 };

    let totalTopics = 0;
    let totalDuration = 0;

    course.modules.forEach(module => {
      if (module.topics && Array.isArray(module.topics)) {
        totalTopics += module.topics.length;
        module.topics.forEach(topic => {
          totalDuration += topic.duration || 0;
        });
      }
    });

    return { totalTopics, totalDuration };
  };

  // Structured Data for Course
  const courseSchema = course
    ? {
      "@context": "https://schema.org",
      "@type": "Course",
      name: course.title,
      description: course.description,
      provider: {
        "@type": "Organization",
        name: "KalawatiPutra Edu",
        sameAs: "https://kalawatiputra.com",
      },
      url: `https://kalawatiputra.com/courses/${course._id}`,
      image: course.image || "https://kalawatiputra.com/images/placeholder-course.jpg",
      author: {
        "@type": "Person",
        name: course.author?.name || "KalawatiPutra Edu",
      },
    }
    : null;

  if (loading) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-emerald-900/30 rounded mb-4"></div>
          <div className="h-4 w-32 bg-emerald-900/30 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-emerald-500">
        <div className="text-center p-8 bg-zinc-900 rounded-lg border border-emerald-800/50 shadow-lg max-w-md">
          <div className="text-red-400 text-xl font-semibold mb-4">{error}</div>
          <p className="text-zinc-400 mb-6">Please login to view and access course content.</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/login"
              className="bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
            >
              Login
            </Link>
            <Link
              to="/courses"
              className="bg-zinc-800 text-emerald-400 px-4 py-2 rounded-md hover:bg-zinc-700 transition duration-300"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    console.log('CourseDetail: course is null/undefined, loading:', loading, 'error:', error);
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-emerald-500">
        <div className="text-center p-8 bg-zinc-900 rounded-lg border border-emerald-800/50 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
          <p className="text-zinc-400">The course you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/courses"
            className="mt-6 flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300 inline-block"
          >
            <ChevronLeft size={16} />
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const { totalTopics, totalDuration } = calculateCourseMetrics();

  return (
    <div className="bg-black text-emerald-50 min-h-screen py-12 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0f1c1a',
            color: '#ecfdf5',
            border: '1px solid #064e3b'
          },
          success: {
            icon: '✓',
            iconTheme: {
              primary: '#10b981',
              secondary: '#ecfdf5'
            }
          },
          error: {
            icon: '✕',
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#ecfdf5'
            }
          }
        }}
      />

      <Helmet>
        <title>{`${course.title} - KalawatiPutra Edu`}</title>
        <meta
          name="description"
          content={course.description.substring(0, 160)}
        />
        <meta
          name="keywords"
          content={`software engineering course, DSA course, ${course.title}, KalawatiPutra Edu, ${course.category}`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={course.author?.name || "KalawatiPutra Edu"} />
        <link rel="canonical" href={`https://kalawatiputra.com/courses/${course._id}`} />
        <meta property="og:title" content={`${course.title} - KalawatiPutra Edu`} />
        <meta
          property="og:description"
          content={course.description.substring(0, 160)}
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://kalawatiputra.com/courses/${course._id}`} />
        <meta
          property="og:image"
          content={course.image || "https://kalawatiputra.com/images/kalawatiputra-og.jpg"}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${course.title} - KalawatiPutra Edu`} />
        <meta
          name="twitter:description"
          content={course.description.substring(0, 160)}
        />
        <meta
          name="twitter:image"
          content={course.image || "https://kalawatiputra.com/images/kalawatiputra-og.jpg"}
        />
        {courseSchema && (
          <script type="application/ld+json">{JSON.stringify(courseSchema)}</script>
        )}
      </Helmet>

      <div className="container mx-auto max-w-5xl">
        <Link
          to="/courses"
          className="group flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition duration-300 mb-6"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Courses
        </Link>

        {/* Course Header Card */}
        <div className="bg-zinc-900 rounded-xl shadow-2xl border border-emerald-900/30 overflow-hidden mb-8">
          {/* Course Banner Image */}
          {course.image && (
            <div className="w-full h-56 overflow-hidden relative">
              <img
                src={course.image}
                alt={course.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent"></div>
            </div>
          )}

          {/* Course Header Info */}
          <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-8 border-b border-emerald-900/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-4xl font-bold text-white mb-2 leading-tight">{course.title}</h1>

              {!isEnrolled ? (
                <button
                  onClick={handleEnroll}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/50"
                >
                  <BookOpen size={20} />
                  Enroll Now
                </button>
              ) : (
                <div className="bg-emerald-900/40 text-emerald-300 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 border border-emerald-700/50">
                  <Award size={20} />
                  Enrolled
                </div>
              )}
            </div>

            <p className="text-emerald-100/80 my-4 max-w-3xl">{course.description}</p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-200 mt-4">
              {course.author && (
                <div className="flex items-center gap-1">
                  <User size={14} />
                  <span>{course.author.name}</span>
                </div>
              )}

              {course.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(course.createdAt)}</span>
                </div>
              )}

              {course.category && (
                <div className="flex items-center gap-1">
                  <Tag size={14} />
                  <span>{course.category}</span>
                </div>
              )}
            </div>
          </div>

          {/* Course Statistics */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-zinc-800/50 p-4 rounded-lg border border-emerald-900/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <BookOpen size={18} />
                <span className="font-semibold">Content</span>
              </div>
              <p className="text-2xl font-bold text-white">{course.modules?.length || 0} Modules</p>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-emerald-900/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Award size={18} />
                <span className="font-semibold">Topics</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalTopics}</p>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-emerald-900/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <Clock size={18} />
                <span className="font-semibold">Duration</span>
              </div>
              <p className="text-2xl font-bold text-white">{totalDuration} mins</p>
            </div>

            <div className="bg-zinc-800/50 p-4 rounded-lg border border-emerald-900/20">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <User size={18} />
                <span className="font-semibold">Progress</span>
              </div>
              <p className="text-2xl font-bold text-white">
                {isEnrolled ?
                  `${Math.round((completedTopics.length / totalTopics) * 100)}%` :
                  'Not Started'}
              </p>
            </div>
          </div>
        </div>

        {/* Course Content */}
        {isEnrolled ? (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-emerald-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-6 border-b border-emerald-900/20">
              <h2 className="text-2xl font-semibold text-white">Course Content</h2>
            </div>
            <div className="p-6">
              {/* Debug info */}
              {console.log('CourseDetail - course.modules:', course.modules)}
              {console.log('CourseDetail - completedTopics:', completedTopics)}
              {!course.modules || course.modules.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No course modules available.</p>
                  <p className="text-sm text-gray-500">
                    The course structure is being prepared. Please check back later.
                  </p>
                </div>
              ) : (
                <CourseContent
                  modules={course.modules}
                  courseId={id}
                  completedTopics={completedTopics}
                  setCompletedTopics={setCompletedTopics}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="bg-zinc-900 rounded-xl shadow-xl border border-emerald-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-6 border-b border-emerald-900/20">
              <h2 className="text-2xl font-semibold text-white">Course Preview</h2>
            </div>
            <div className="p-8 text-center">
              <p className="text-zinc-400 mb-6">Enroll in this course to access the full content.</p>
              <button
                onClick={handleEnroll}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg transition duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2 mx-auto"
              >
                <BookOpen size={20} />
                Enroll Now
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 mb-6 text-center text-zinc-500 text-sm">
          <p>© {new Date().getFullYear()} KalawatiPutra Edu. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;