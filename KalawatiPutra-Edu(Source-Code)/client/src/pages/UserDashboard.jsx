import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserArticles, getProfileStats, deleteArticle } from '../api';

function UserDashboard() {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [solvedProblems, setSolvedProblems] = useState(0);
  const [profileStats, setProfileStats] = useState({
    enrolledCourses: { total: 0, list: [] },
    createdArticles: 0,
    certificates: 0,
    profileCompleteness: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const articlesRes = await getUserArticles();
        setArticles(articlesRes.data);

        console.log('Fetching profile stats with token:', token);
        const statsRes = await getProfileStats();
        if (statsRes.data && typeof statsRes.data === 'object' && 'enrolledCourses' in statsRes.data) {
          setProfileStats(statsRes.data);
        } else {
          console.error('Invalid profile stats response:', statsRes.data);
          setError('Failed to load profile stats: Invalid response from server');
        }
      } catch (err) {
        console.error('Fetch error:', err.response?.data || err.message);
        setError(err.response?.data?.msg || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    let count = 0;
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('status-') && localStorage.getItem(key) === 'solved') {
        count++;
      }
    });
    setSolvedProblems(count);

    fetchData();
  }, [navigate]);

  const handleDeleteArticle = async (id) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      try {
        const token = localStorage.getItem('token');
        await deleteArticle(id);
        setArticles(articles.filter((article) => article._id !== id));
      } catch (err) {
        setError('Failed to delete article');
      }
    }
  };

  // Profile Completion Pie Chart Component
  const ProfileCompletionChart = ({ percentage }) => {
    const radius = 45;
    const strokeWidth = 8;
    const normalizedRadius = radius - strokeWidth * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
      <div className="relative w-32 h-32 mx-auto">
        <svg className="transform -rotate-90 w-32 h-32">
          <circle
            cx="64"
            cy="64"
            r={normalizedRadius}
            stroke="rgba(16, 185, 129, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx="64"
            cy="64"
            r={normalizedRadius}
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#34D399" />
              <stop offset="100%" stopColor="#6EE7B7" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold text-emerald-400">{percentage}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.3); }
          50% { box-shadow: 0 0 40px rgba(16, 185, 129, 0.5); }
        }
        
        @keyframes slideInUp {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        .card-modern {
          background: linear-gradient(145deg, rgba(0,0,0,0.8), rgba(31,41,55,0.4));
          backdrop-filter: blur(20px);
          border: 1px solid rgba(16, 185, 129, 0.2);
          animation: slideInUp 0.6s ease-out;
        }
        
        .stat-card {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          border: 1px solid rgba(16, 185, 129, 0.3);
          transition: all 0.3s ease;
        }
        
        .stat-card:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 20px 40px rgba(16, 185, 129, 0.2);
          border-color: rgba(16, 185, 129, 0.6);
        }
        
        .floating-icon {
          animation: float 3s ease-in-out infinite;
        }
        
        .glow-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
          border: 1px solid rgba(16, 185, 129, 0.5);
          transition: all 0.3s ease;
        }
        
        .glow-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.3), rgba(6, 182, 212, 0.3));
        }
        
        .glow-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .glow-button:hover::before {
          left: 100%;
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #10B981, #34D399, #6EE7B7);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradient-shift 3s ease infinite;
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .loading-spinner {
          background: conic-gradient(from 0deg, transparent, #10B981, transparent);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        .table-row {
          background: linear-gradient(135deg, rgba(0,0,0,0.6), rgba(31,41,55,0.3));
          border-bottom: 1px solid rgba(16, 185, 129, 0.1);
          transition: all 0.3s ease;
        }
        
        .table-row:hover {
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
          transform: translateX(5px);
          border-left: 3px solid #10B981;
        }
      `}</style>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-xl opacity-5 animate-pulse"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="floating-icon inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-2xl flex items-center justify-center shadow-2xl">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-6xl font-bold gradient-text mb-4">
            Dashboard
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Welcome back! Here's your learning journey at a glance
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card-modern rounded-2xl p-6 mb-8 border-red-500/30 bg-gradient-to-r from-red-900/20 to-red-800/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-red-300 text-lg">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center h-96">
            <div className="loading-spinner w-16 h-16 mb-8"></div>
            <div className="w-12 h-12 border-4 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin mb-4"></div>
            <p className="text-emerald-400 text-lg animate-pulse">Loading your dashboard...</p>
          </div>
        ) : (
          <>
            {/* Profile Stats Section */}
            <div className="card-modern rounded-3xl p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold gradient-text">Profile Overview</h2>
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Enrolled Courses Card */}
                <div className="stat-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-emerald-400">{profileStats?.enrolledCourses?.total ?? 0}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Enrolled Courses</h3>
                  {profileStats?.enrolledCourses?.list?.length > 0 ? (
                    <div className="space-y-2">
                      {profileStats.enrolledCourses.list.slice(0, 2).map((course, index) => (
                        <div key={index} className="bg-black/30 rounded-lg p-2">
                          <p className="text-sm text-gray-300 font-medium truncate">{course.title}</p>
                          <p className="text-xs text-gray-500">{new Date(course.enrolledAt).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-sm">No courses yet</p>
                  )}
                </div>

                {/* Created Articles Card */}
                <div className="stat-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-emerald-400">{profileStats?.createdArticles ?? 0}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">Created Articles</h3>
                  <p className="text-gray-400 text-sm">Your published content</p>
                </div>

                {/* Solved Problems Card */}
                <div className="stat-card rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <span className="text-3xl font-bold text-emerald-400">{solvedProblems}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-2">DSA Problems</h3>
                  <p className="text-gray-400 text-sm">Successfully solved</p>
                </div>

                {/* Profile Completion Card */}
                <div className="stat-card rounded-2xl p-6">
                  <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-200 mb-4">Profile Completion</h3>
                    <ProfileCompletionChart percentage={profileStats?.profileCompleteness ?? 0} />
                    <div className="mt-4 text-center">
                      <p className="text-sm text-gray-400">Certificates: <span className="text-emerald-400 font-semibold">{profileStats?.certificates ?? 0}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Articles Section */}
            <div className="card-modern rounded-3xl p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
                <div className="flex items-center mb-4 sm:mb-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center mr-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h2 className="text-3xl font-bold gradient-text">My Articles</h2>
                </div>
                <Link
                  to="/create-article"
                  className="glow-button px-6 py-3 rounded-xl font-semibold text-emerald-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create New Article
                </Link>
              </div>

              {articles.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-300 mb-4">No Articles Yet</h3>
                  <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                    Start sharing your knowledge with the community by creating your first article.
                  </p>
                  <Link
                    to="/create-article"
                    className="glow-button inline-flex items-center px-8 py-4 rounded-xl font-semibold text-emerald-300"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Create Your First Article
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-emerald-500/20">
                        <th className="text-left py-4 px-6 text-emerald-400 font-semibold">Title</th>
                        <th className="text-left py-4 px-6 text-emerald-400 font-semibold">Tags</th>
                        <th className="text-left py-4 px-6 text-emerald-400 font-semibold">Created</th>
                        <th className="text-left py-4 px-6 text-emerald-400 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {articles.map((article, index) => (
                        <tr key={article._id} className="table-row">
                          <td className="py-4 px-6">
                            <h4 className="font-semibold text-gray-200 text-lg">{article.title}</h4>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-wrap gap-2">
                              {article.tags.map((tag, i) => (
                                <span
                                  key={i}
                                  className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-500/30"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-400">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex space-x-4">
                              <Link
                                to={`/edit-article/${article._id}`}
                                className="flex items-center text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteArticle(article._id)}
                                className="flex items-center text-red-400 hover:text-red-300 transition-colors"
                              >
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;