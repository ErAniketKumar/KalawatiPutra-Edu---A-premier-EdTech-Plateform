import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Toaster, toast } from "sonner";
import hljs from "highlight.js";
import "highlight.js/styles/night-owl.css"; // Dark theme for code highlighting
import { ClipboardCopy, Download, Calendar, User, Tag, ChevronLeft, Maximize2, X } from "lucide-react";

function ArticleDetail() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [magnifiedImage, setMagnifiedImage] = useState(null);
  const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${VITE_API_URL}/articles/${id}`)
      .then((res) => {
        setArticle(res.data);
        setLoading(false);
        setTimeout(() => {
          document.querySelectorAll("pre code").forEach((block) => {
            hljs.highlightElement(block);
          });
        }, 100);
      })
      .catch((err) => {
        console.error("Error fetching article:", err);
        setLoading(false);
        toast.error("Failed to load article");
      });
  }, [id]);

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code)
      .then(() => {
        toast.success("Code copied to clipboard!");
      })
      .catch((err) => {
        toast.error("Failed to copy code");
        console.error("Error copying code:", err);
      });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const openMagnifiedImage = (img) => {
    setMagnifiedImage(img);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeMagnifiedImage = () => {
    setMagnifiedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  // Structured Data for Article
  const articleSchema = article
    ? {
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

  if (!article) {
    return (
      <div className="bg-black min-h-screen flex items-center justify-center text-emerald-500">
        <div className="text-center p-8 bg-zinc-900 rounded-lg border border-emerald-800/50 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Article Not Found</h2>
          <p className="text-zinc-400">The article you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 flex items-center justify-center gap-2 bg-emerald-700 text-white px-4 py-2 rounded-md hover:bg-emerald-600 transition duration-300"
          >
            <ChevronLeft size={16} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

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
        <title>{`${article.title} - KalawatiPutra Edu`}</title>
        <meta
          name="description"
          content={article.content.replace(/<[^>]+>/g, "").substring(0, 160)}
        />
        <meta
          name="keywords"
          content={`coding article, DSA tutorial, ${article.title}, KalawatiPutra Edu, ${article.tags?.join(", ")}`}
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content={article.author?.name || "KalawatiPutra Edu"} />
        <link rel="canonical" href={`https://kalawatiputra.com/article/${article._id}`} />
        <meta property="og:title" content={`${article.title} - KalawatiPutra Edu`} />
        <meta
          property="og:description"
          content={article.content.replace(/<[^>]+>/g, "").substring(0, 160)}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://kalawatiputra.com/article/${article._id}`} />
        <meta
          property="og:image"
          content={
            article.images && article.images[0]
              ? article.images[0]
              : "https://kalawatiputra.com/images/kalawatiputra-og.jpg"
          }
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${article.title} - KalawatiPutra Edu`} />
        <meta
          name="twitter:description"
          content={article.content.replace(/<[^>]+>/g, "").substring(0, 160)}
        />
        <meta
          name="twitter:image"
          content={
            article.images && article.images[0]
              ? article.images[0]
              : "https://kalawatiputra.com/images/kalawatiputra-og.jpg"
          }
        />
        {articleSchema && (
          <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
        )}
      </Helmet>

      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => window.history.back()}
          className="group flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition duration-300 mb-6"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
          Back to Articles
        </button>

        <div className="bg-zinc-900 rounded-xl shadow-2xl border border-emerald-900/30 overflow-hidden">
          {/* Article Header */}
          <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-8 border-b border-emerald-900/20">
            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{article.title}</h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-emerald-200">
              <div className="flex items-center gap-1">
                <User size={14} />
                <span>{article.author?.name || "KalawatiPutra Edu"}</span>
              </div>

              {article.createdAt && (
                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  <span>{formatDate(article.createdAt)}</span>
                </div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div className="flex items-center gap-1 flex-wrap mt-2 md:mt-0">
                  <Tag size={14} />
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-emerald-900/40 px-2 py-0.5 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Article Content */}
          <div className="p-8">
            <div className="max-h-[600px] overflow-y-auto pr-4 custom-scrollbar">
              <div
                className="prose prose-invert prose-emerald max-w-none text-zinc-300 prose-headings:text-emerald-300 prose-a:text-emerald-400 prose-strong:text-emerald-200 prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-emerald-900/20"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </div>
        </div>

        {/* Code Snippets Section */}
        {article.codeSnippets && article.codeSnippets.length > 0 && (
          <div className="mt-8 bg-zinc-900 rounded-xl shadow-lg border border-emerald-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-6 border-b border-emerald-900/20 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Code Snippets</h2>
              <button
                onClick={() => handleCopyCode(article.codeSnippets.join('\n\n'))}
                className="flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded transition-colors duration-200 text-sm"
              >
                <ClipboardCopy size={14} />
                Copy All
              </button>
            </div>

            <div className="p-6">
              <div className="bg-zinc-950 rounded-lg border border-emerald-900/20 overflow-hidden">
                <pre className="p-4 m-0 overflow-x-auto max-h-[500px] overflow-y-auto custom-scrollbar">
                  <code className="!bg-transparent">{article.codeSnippets.join('\n\n')}</code>
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Image Gallery Section */}
        {article.images && article.images.length > 0 && (
          <div className="mt-8 bg-zinc-900 rounded-xl shadow-lg border border-emerald-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-6 border-b border-emerald-900/20">
              <h2 className="text-2xl font-semibold text-white">Images</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {article.images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-zinc-950 p-2 rounded-lg border border-emerald-900/20 overflow-hidden hover:border-emerald-500 transition-colors duration-300 group relative"
                  >
                    <img
                      src={img}
                      alt={`Article image ${index + 1} - ${article.title}`}
                      className="w-full h-60 object-cover rounded"
                      loading="lazy"
                    />
                    <button
                      onClick={() => openMagnifiedImage(img)}
                      className="absolute bottom-4 right-4 bg-black/70 hover:bg-emerald-700 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
                      aria-label="Magnify image"
                    >
                      <Maximize2 size={18} className="text-white" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PDF Resources Section */}
        {article.pdfs && article.pdfs.length > 0 && (
          <div className="mt-8 bg-zinc-900 rounded-xl shadow-lg border border-emerald-900/30 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-900/70 to-zinc-900 p-6 border-b border-emerald-900/20">
              <h2 className="text-2xl font-semibold text-white">PDF Resources</h2>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {article.pdfs.map((pdf, index) => (
                  <a
                    key={index}
                    href={pdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between bg-zinc-950 p-4 rounded-lg border border-emerald-900/20 hover:border-emerald-500 hover:bg-zinc-900 transition-all duration-300 group"
                  >
                    <span className="text-emerald-300 group-hover:text-emerald-200">
                      PDF Resource {index + 1}
                    </span>
                    <Download size={18} className="text-emerald-500 group-hover:text-emerald-300 group-hover:translate-y-0.5 transition-all duration-300" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Image Magnifier Modal */}
        {magnifiedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="relative max-w-6xl w-full mx-auto">
              <button
                onClick={closeMagnifiedImage}
                className="absolute -top-12 right-0 text-white hover:text-emerald-400 transition-colors duration-300"
                aria-label="Close magnified view"
              >
                <X size={24} />
              </button>

              <div className="bg-zinc-950 border border-emerald-800/30 rounded-lg overflow-hidden shadow-2xl">
                <div className="relative">
                  <img
                    src={magnifiedImage}
                    alt="Magnified view"
                    className="w-full max-h-[80vh] object-contain"
                  />
                </div>
              </div>
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
}

export default ArticleDetail;