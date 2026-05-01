import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Toaster, toast } from "sonner";

function BlogsArticles() {
  const [articles, setArticles] = useState([]);
  const [tips, setTips] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [articleLikes, setArticleLikes] = useState({});
  const [likedArticles, setLikedArticles] = useState({});
  const [pinnedArticles, setPinnedArticles] = useState(() => {
    const saved = localStorage.getItem("pinnedArticles");
    return saved ? JSON.parse(saved) : [];
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("latest");
  const POLL_INTERVAL = 2000;

  const VITE_API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Check if user is admin by decoding JWT
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        setIsAdmin(decoded.role === "admin");
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, []);

  const fetchArticles = async (pageNum, searchQuery) => {
    setLoading(true);
    try {
      const res = await axios.get(`${VITE_API_URL}/articles`, {
        params: { page: pageNum, limit: 6, search: searchQuery },
      });
      if (pageNum === 1) {
        setArticles(res.data.articles);
        setTips(
          res.data.articles.filter((article) => article.tags.includes("tips"))
        );
      } else {
        setArticles((prev) => [...prev, ...res.data.articles]);
        setTips((prev) => [
          ...prev,
          ...res.data.articles.filter((article) =>
            article.tags.includes("tips")
          ),
        ]);
      }
      setTotalPages(res.data.totalPages);

      if (pageNum === 1 && searchQuery) {
        toast.success(`Found ${res.data.articles.length} articles matching "${searchQuery}"`, {
          className: "bg-[#1E1E1E] border border-emerald-500 text-white",
        });
      }
    } catch (err) {
      console.error("Error fetching articles:", err);
      toast.error("Failed to fetch articles. Please try again later.", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchLikes = async () => {
    const token = localStorage.getItem("token");
    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const updatedLikes = {};
    const updatedLiked = {};

    await Promise.all(
      articles.map(async (article) => {
        try {
          const res = await axios.get(
            `${VITE_API_URL}/articles/${article._id}`,
            { headers }
          );
          updatedLikes[article._id] = res.data.likes || 0;
          if (res.data.likedBy && token) {
            const userId = JSON.parse(atob(token.split(".")[1])).userId;
            updatedLiked[article._id] = res.data.likedBy.includes(userId);
          } else {
            updatedLiked[article._id] = false;
          }
        } catch {
          updatedLikes[article._id] = 0;
          updatedLiked[article._id] = false;
        }
      })
    );

    setArticleLikes(updatedLikes);
    setLikedArticles(updatedLiked);
  };

  const handlePinAction = async (article, isPinned) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to pin articles", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
      return;
    }

    if (article.isPinnedByAdmin && !isAdmin) {
      toast.error("Cannot unpin admin-pinned article", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (isPinned) {
        const endpoint = isAdmin && article.isPinnedByAdmin ? `/articles/${article._id}/admin-unpin` : `/articles/${article._id}/unpin`;
        await axios.post(`${VITE_API_URL}${endpoint}`, {}, { headers });
        if (isAdmin && article.isPinnedByAdmin) {
          setArticles((prev) =>
            prev.map((a) =>
              a._id === article._id ? { ...a, isPinnedByAdmin: false } : a
            )
          );
          setTips((prev) =>
            prev.map((a) =>
              a._id === article._id ? { ...a, isPinnedByAdmin: false } : a
            )
          );
        } else {
          setPinnedArticles((prev) => prev.filter((id) => id !== article._id));
        }
        toast.success("Article unpinned", {
          className: "bg-[#1E1E1E] border border-emerald-500 text-white",
        });
      } else {
        const endpoint = isAdmin ? `/articles/${article._id}/admin-pin` : `/articles/${article._id}/pin`;
        await axios.post(`${VITE_API_URL}${endpoint}`, {}, { headers });
        if (isAdmin) {
          setArticles((prev) =>
            prev.map((a) =>
              a._id === article._id ? { ...a, isPinnedByAdmin: true } : a
            )
          );
          setTips((prev) =>
            prev.map((a) =>
              a._id === article._id ? { ...a, isPinnedByAdmin: true } : a
            )
          );
        } else {
          setPinnedArticles((prev) => [...prev, article._id]);
        }
        toast.success("Article pinned", {
          className: "bg-[#1E1E1E] border border-emerald-500 text-white",
        });
      }
      localStorage.setItem("pinnedArticles", JSON.stringify(pinnedArticles));
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to update pin status. Please try again.", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
    }
  };

  // Update localStorage when pinnedArticles change
  useEffect(() => {
    localStorage.setItem("pinnedArticles", JSON.stringify(pinnedArticles));
  }, [pinnedArticles]);

  // Fetch articles on search change
  useEffect(() => {
    fetchArticles(1, search);
  }, [search]);

  // Fetch likes when articles change
  useEffect(() => {
    if (articles.length > 0) {
      fetchLikes();
    }
  }, [articles]);

  // Poll for like updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (articles.length > 0) {
        fetchLikes();
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [articles]);

  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage((prev) => prev + 1);
      fetchArticles(page + 1, search);
    }
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleLikeAction = async (article, isLiked) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to like articles", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };
    try {
      if (isLiked) {
        const res = await axios.post(
          `${VITE_API_URL}/articles/${article._id}/unlike`,
          {},
          { headers }
        );
        setArticleLikes((prev) => ({
          ...prev,
          [article._id]: res.data.likes,
        }));
        setLikedArticles((prev) => ({
          ...prev,
          [article._id]: false,
        }));
        toast.success("Article unliked", {
          className: "bg-[#1E1E1E] border border-emerald-500 text-white",
        });
      } else {
        const res = await axios.post(
          `${VITE_API_URL}/articles/${article._id}/like`,
          {},
          { headers }
        );
        setArticleLikes((prev) => ({
          ...prev,
          [article._id]: res.data.likes,
        }));
        setLikedArticles((prev) => ({
          ...prev,
          [article._id]: true,
        }));
        toast.success("Article liked", {
          className: "bg-[#1E1E1E] border border-emerald-500 text-white",
        });
      }
    } catch (err) {
      toast.error("Failed to update like. Please try again.", {
        className: "bg-[#1E1E1E] border border-red-500 text-white",
      });
    }
  };

  const articleSchema = articles.map((article) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.content.replace(/<[^>]+>/g, "").substring(0, 200),
    author: {
      "@type": "Person",
      name: article.author?.name || "KalawatiPutra Edu",
    },
    publisher: {
      "@type": "Organization",
      name: "KalawatiPutra Edu",
      logo: {
        "@type": "ImageObject",
        url: "https://kalawatiputra.com/images/kalawatiputra-logo.png",
      },
    },
    datePublished: article.createdAt,
    image:
      article.images && article.images[0]
        ? article.images[0]
        : "https://kalawatiputra.com/images/placeholder-article.jpg",
    url: `https://kalawatiputra.com/article/${article._id}`,
  }));

  const renderArticleCard = (article) => (
    <article
      key={article._id}
      className="bg-gradient-to-br from-gray-900 to-[#111] rounded-xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-102 hover:shadow-2xl border border-gray-800 hover:border-emerald-500 group relative"
    >
      {article.images && article.images[0] ? (
        <div className="relative overflow-hidden h-52">
          <img
            src={`${article.images[0]}`}
            alt={`${article.title} - KalawatiPutra Edu`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      ) : (
        <div className="w-full h-52 bg-gradient-to-br from-gray-800 to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-600 via-transparent to-transparent"></div>
        </div>
      )}
      <div className="absolute top-4 right-4 bg-emerald-500 text-black text-xs font-bold px-2 py-1 rounded-full">
        {article.tags?.[0] || "Article"}
      </div>
      {article.isPinnedByAdmin ? (
        <div className="absolute top-4 left-4 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          Admin Pinned
        </div>
      ) : pinnedArticles.includes(article._id) ? (
        <div className="absolute top-4 left-4 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
          Pinned
        </div>
      ) : null}
      <div className="p-6 relative">
        <h2 className="text-2xl font-bold mb-3 text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
          {article.title}
        </h2>
        <p className="text-gray-300 mb-6 line-clamp-3 text-sm">
          {article.content.replace(/<[^>]+>/g, "")}
        </p>
        <div className="flex justify-between items-center">
          <Link
            to={`/article/${article._id}`}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm flex items-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/20"
          >
            Read More
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePinAction(article, pinnedArticles.includes(article._id) || article.isPinnedByAdmin)}
              disabled={article.isPinnedByAdmin && !isAdmin}
              className={`focus:outline-none transition-colors flex items-center gap-1 ${
                article.isPinnedByAdmin && !isAdmin
                  ? "text-gray-500 cursor-not-allowed"
                  : (pinnedArticles.includes(article._id) || article.isPinnedByAdmin)
                    ? "text-yellow-500"
                    : "text-gray-400 hover:text-yellow-500"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={(pinnedArticles.includes(article._id) || article.isPinnedByAdmin) ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15.172 7l-6.586 6.586a2 2 0 002.828 2.828L17 10.828V17h2V7h-10z"
                />
              </svg>
            </button>
            <button
              onClick={() => handleLikeAction(article, likedArticles[article._id])}
              className={`focus:outline-none transition-colors flex items-center gap-1 ${
                likedArticles[article._id]
                  ? "text-red-500"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill={likedArticles[article._id] ? "currentColor" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <span className="font-medium">
                {articleLikes[article._id] || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );

  // Sort articles: admin-pinned first, then user-pinned, then regular
  const sortedArticles = [...articles].sort((a, b) => {
    if (a.isPinnedByAdmin && !b.isPinnedByAdmin) return -1;
    if (!a.isPinnedByAdmin && b.isPinnedByAdmin) return 1;
    const aPinned = pinnedArticles.includes(a._id);
    const bPinned = pinnedArticles.includes(b._id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  const sortedTips = [...tips].sort((a, b) => {
    if (a.isPinnedByAdmin && !b.isPinnedByAdmin) return -1;
    if (!a.isPinnedByAdmin && b.isPinnedByAdmin) return 1;
    const aPinned = pinnedArticles.includes(a._id);
    const bPinned = pinnedArticles.includes(b._id);
    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;
    return 0;
  });

  return (
    <div className="bg-gradient-to-br from-gray-900 to-black text-white min-h-screen py-16 px-4 overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1E1E1E",
            color: "#ffffff",
            border: "1px solid #10b981",
          },
          duration: 3000,
        }}
      />
      <Helmet>
        <title>Blog Articles - KalawatiPutra Edu</title>
        <meta
          name="description"
          content="Explore the latest articles on coding, career growth, DSA, and MNC interview preparation from KalawatiPutra Edu."
        />
        <meta
          name="keywords"
          content="coding articles, DSA tutorials, MNC interview tips, career growth, KalawatiPutra Edu blog, software engineering"
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="KalawatiPutra Edu" />
        <link rel="canonical" href="https://kalawatiputra.com/blogs-articles" />
        <meta property="og:title" content="Blog Articles - KalawatiPutra Edu" />
        <meta
          property="og:description"
          content="Explore the latest articles on coding, career growth, DSA, and MNC interview preparation from KalawatiPutra Edu."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://kalawatiputra.com/blogs-articles"
        />
        <meta
          property="og:image"
          content="https://kalawatiputra.com/images/kalawatiputra-og.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Blog Articles - KalawatiPutra Edu"
        />
        <meta
          name="twitter:description"
          content="Explore the latest articles on coding, career growth, DSA, and MNC interview preparation from KalawatiPutra Edu."
        />
        <meta
          name="twitter:image"
          content="https://kalawatiputra.com/images/kalawatiputra-og.jpg"
        />
        {articleSchema.map((schema, index) => (
          <script key={`article-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      <div className="container mx-auto max-w-7xl">
        {/* Hero Section */}
        <div className="relative mb-16 rounded-2xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/90 to-gray-900/90 z-10"></div>
          <div className="absolute inset-0 bg-[url('https://kalawatiputra.com/images/placeholder-article.jpg')] bg-cover bg-center opacity-40"></div>
          <div className="relative z-20 py-16 px-8 md:px-16 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent">
              KalawatiPutra Tech Blog
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-200 mb-8">
              Explore the latest articles on coding, career growth, DSA, and interview preparation for top tech companies
            </p>
            <div className="relative max-w-xl mx-auto">
              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search articles by title..."
                className="w-full px-6 py-4 bg-black/50 backdrop-blur-md text-white rounded-full border-2 border-emerald-500/30 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all pl-12 text-lg"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/80 backdrop-blur-md p-1 rounded-full border border-gray-800">
            <button
              onClick={() => setActiveTab("latest")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === "latest"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Latest Articles
            </button>
            <button
              onClick={() => setActiveTab("tips")}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === "tips"
                  ? "bg-emerald-600 text-white shadow-lg"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              Tips & Tricks
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === "latest" && (
          <>
            {sortedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedArticles.map((article) => renderArticleCard(article))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
                {loading ? (
                  <div className="flex flex-col items-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
                    <p className="text-gray-300 text-lg">Loading articles...</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-4">
                    <svg className="w-16 h-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-gray-300 text-lg">No articles found. Try a different search term.</p>
                  </div>
                )}
              </div>
            )}
            {page < totalPages && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className={`bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-8 py-3 rounded-full hover:from-emerald-500 hover:to-emerald-600 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-900 font-medium shadow-lg hover:shadow-xl ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Load More
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </span>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === "tips" && (
          <>
            {sortedTips.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sortedTips.map((tip) => renderArticleCard(tip))}
              </div>
            ) : (
              <div className="text-center p-12 bg-gradient-to-br from-gray-900 to-black rounded-2xl border border-gray-800 shadow-xl">
                <div className="flex flex-col items-center space-y-4">
                  <svg className="w-16 h-16 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <p className="text-gray-300 text-lg">No tips available at the moment.</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default BlogsArticles;