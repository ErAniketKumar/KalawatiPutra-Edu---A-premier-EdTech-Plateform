import React, { useState, useEffect } from 'react';
import { getRoadmaps } from '../../api';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Image,
  ArrowRight,
  Star,
  Users,
  CheckCircle,
  BookOpen,
  Search,
  Filter,
  Grid,
  List,
  X,
  Play,
  Award,
  Target,
  TrendingUp,
  Clock,
  Download,
  Menu
} from 'lucide-react';

// Import the enhanced components
import RoadmapSidebar from '../../components/roadmap/RoadmapSidebar';
import RoadmapProgress from '../../components/roadmap/RoadmapProgress';

const Roadmap = () => {
  const [roadmaps, setRoadmaps] = useState([]);
  const [selectedRoadmap, setSelectedRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProgress, setUserProgress] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showDetailedProgress, setShowDetailedProgress] = useState(false);
  const [showLearningModal, setShowLearningModal] = useState(false);
  const [selectedLearningStep, setSelectedLearningStep] = useState(0);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const res = await getRoadmaps();
        setRoadmaps(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, []);

  // Load user progress from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('roadmapProgress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  // Save progress to localStorage
  const saveProgress = (roadmapId, progress) => {
    const newProgress = { ...userProgress, [roadmapId]: progress };
    setUserProgress(newProgress);
    localStorage.setItem('roadmapProgress', JSON.stringify(newProgress));
  };

  // Start roadmap progress
  const startRoadmap = (roadmap) => {
    const progress = {
      id: roadmap._id,
      title: roadmap.subject,
      startedAt: new Date().toISOString(),
      completedSteps: [],
      totalSteps: roadmap.files ? roadmap.files.length : 1,
      progress: 0
    };
    saveProgress(roadmap._id, progress);
    setSelectedRoadmap(roadmap);
  };

  // Start learning experience
  const startLearning = (roadmap) => {
    const progress = userProgress[roadmap._id];
    if (progress) {
      // Continue from where user left off
      setSelectedLearningStep(progress.completedSteps?.length || 0);
    } else {
      // Start from beginning
      setSelectedLearningStep(0);
      startRoadmap(roadmap); // Initialize progress if not already done
    }
    setShowLearningModal(true);
    setSelectedRoadmap(roadmap);
  };

  // Mark step as completed and move to next
  const completeStep = (roadmapId, stepIndex) => {
    const progress = userProgress[roadmapId] || {
      id: roadmapId,
      title: selectedRoadmap.subject,
      startedAt: new Date().toISOString(),
      completedSteps: [],
      totalSteps: selectedRoadmap.files ? selectedRoadmap.files.length : 1,
      progress: 0
    };

    if (!progress.completedSteps.includes(stepIndex)) {
      progress.completedSteps.push(stepIndex);
      progress.progress = (progress.completedSteps.length / progress.totalSteps) * 100;
      saveProgress(roadmapId, progress);
    }

    // Move to next step
    if (stepIndex + 1 < progress.totalSteps) {
      setSelectedLearningStep(stepIndex + 1);
    }
  };

  // Get progress percentage for a roadmap
  const getProgressPercentage = (roadmapId) => {
    const progress = userProgress[roadmapId];
    return progress ? progress.progress : 0;
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const getFileUrl = (file) => {
    if (file.startsWith('http')) return file;
    return `${API_BASE_URL}${file}`;
  };

  // Scroll to top when selecting/deselecting roadmap to avoid blank-page feel
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedRoadmap]);

  // Get unique categories from roadmaps
  const categories = ['all', ...new Set(roadmaps.map(roadmap => {
    if (roadmap.category) return roadmap.category;
    const subject = roadmap.subject.toLowerCase();
    if (subject.includes('web') || subject.includes('frontend') || subject.includes('backend')) return 'web development';
    if (subject.includes('data') || subject.includes('ml') || subject.includes('ai')) return 'data science';
    if (subject.includes('mobile') || subject.includes('app')) return 'mobile development';
    if (subject.includes('devops') || subject.includes('cloud')) return 'devops';
    return 'programming';
  }))];

  // Filter roadmaps based on search and category
  const filteredRoadmaps = roadmaps.filter(roadmap => {
    const matchesSearch = roadmap.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (roadmap.content && roadmap.content.toLowerCase().includes(searchTerm.toLowerCase()));

    const roadmapCategory = roadmap.category || (
      roadmap.subject.toLowerCase().includes('web') ? 'web development' :
        roadmap.subject.toLowerCase().includes('data') ? 'data science' :
          roadmap.subject.toLowerCase().includes('mobile') ? 'mobile development' :
            roadmap.subject.toLowerCase().includes('devops') ? 'devops' : 'programming'
    );

    const matchesCategory = selectedCategory === 'all' || roadmapCategory === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Wave animation component
  const WaveBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute bottom-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#10B981"
          fillOpacity="0.1"
          d="M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        >
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,128L48,149.3C96,171,192,213,288,208C384,203,480,149,576,154.7C672,160,768,224,864,229.3C960,235,1056,181,1152,170.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z;
              M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,138.7C672,128,768,160,864,181.3C960,203,1056,213,1152,197.3C1248,181,1344,139,1392,117.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </path>
      </svg>
    </div>
  );

  // Search and Filter Section
  const SearchAndFilter = () => (
    <motion.div
      initial={{ opacity: 0.5, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3 }}
      className="mb-8 sm:mb-12"
    >
      <div className="flex flex-col gap-4 sm:gap-6">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden self-start bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 px-3 sm:px-4 py-2 rounded-lg sm:rounded-xl text-sm sm:text-base font-medium transition-all flex items-center gap-2"
        >
          <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          Categories
        </button>

        {/* Search and Controls Row */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 items-stretch sm:items-center">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              placeholder="Search roadmaps..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent backdrop-blur-sm text-white placeholder-gray-400 text-sm sm:text-base"
            />
          </div>

          {/* Controls Group */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
            {/* Category Filter */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Filter className="text-gray-400 w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 sm:flex-none bg-gray-800/50 border border-gray-700 rounded-lg sm:rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 backdrop-blur-sm text-sm sm:text-base min-w-0"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-800/50 rounded-lg sm:rounded-xl p-1 border border-gray-700 self-center">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <Grid className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 sm:p-2 rounded-md sm:rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white' : 'text-gray-400 hover:text-white'}`}
              >
                <List className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  // Roadmap Card Component
  const RoadmapCard = ({ roadmap, index }) => {
    const getIconForSubject = (subject) => {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes('web') || subjectLower.includes('frontend')) return '🌐';
      if (subjectLower.includes('backend')) return '⚙️';
      if (subjectLower.includes('data') || subjectLower.includes('ml')) return '📊';
      if (subjectLower.includes('mobile')) return '📱';
      if (subjectLower.includes('devops')) return '🚀';
      if (subjectLower.includes('security')) return '🔒';
      return '💻';
    };

    const getDifficultyLevel = (subject) => {
      const subjectLower = subject.toLowerCase();
      if (subjectLower.includes('advanced') || subjectLower.includes('expert')) return 'Expert';
      if (subjectLower.includes('intermediate')) return 'Intermediate';
      return 'Beginner';
    };

    const getDifficultyColor = (level) => {
      switch (level) {
        case 'Expert': return 'text-red-400 bg-red-500/10 border-red-500/20';
        case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
        default: return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      }
    };

    const difficulty = roadmap.difficulty || getDifficultyLevel(roadmap.subject);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className={`group relative overflow-hidden transition-all duration-300 cursor-pointer ${viewMode === 'grid'
          ? 'bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-glow-sm'
          : 'bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 mb-4 flex items-center gap-6 hover:border-emerald-500/50'
          }`}
        whileHover={{ y: -5, scale: viewMode === 'grid' ? 1.02 : 1.01 }}
        onClick={() => setSelectedRoadmap(roadmap)}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-green-500/5 to-emerald-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

        {viewMode === 'grid' ? (
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="text-4xl">{getIconForSubject(roadmap.subject)}</div>
              <div className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </div>
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors">
              {roadmap.subject}
            </h3>

            {/* Description */}
            {roadmap.content && (
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {roadmap.content.substring(0, 150)}...
              </p>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-700/50">
              <div className="flex items-center text-gray-400 text-sm">
                <BookOpen className="w-4 h-4 mr-2" />
                {roadmap.files ? roadmap.files.length : 0} Resources
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ) : (
          <div className="relative z-10 flex items-center gap-6 w-full">
            <div className="text-3xl">{getIconForSubject(roadmap.subject)}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {roadmap.subject}
                </h3>
                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(difficulty)}`}>
                  {difficulty}
                </div>
              </div>
              {roadmap.content && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {roadmap.content.substring(0, 200)}...
                </p>
              )}
            </div>
            <div className="flex items-center gap-4 text-gray-400 text-sm">
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                {roadmap.files ? roadmap.files.length : 0}
              </div>
              <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-900 to-black text-white min-h-screen overflow-hidden">
      <WaveBackground />

      {/* Sidebar */}
      {!selectedRoadmap && (
        <RoadmapSidebar
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      )}
      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${selectedRoadmap ? 'w-full px-0' : 'lg:pl-80'}`}>
        <div className="container mx-auto relative z-10 py-8 sm:py-12 lg:py-16 px-3 sm:px-4 lg:px-6">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0.3, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12 sm:mb-16 relative px-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-center mb-6 sm:mb-8"
              style={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Learning Roadmaps
            </motion.h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-400 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
              Step-by-step guides and paths to learn different tools or technologies.
              Choose your path and start your journey to becoming a skilled developer.
            </p>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4 lg:gap-6 text-gray-400 px-2 sm:px-0">
              <div className="flex items-center bg-gray-800/30 px-3 sm:px-4 py-2 rounded-full border border-emerald-500/20 text-sm sm:text-base">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-emerald-400" />
                <span>{roadmaps.length}+ Learning Paths</span>
              </div>
              <div className="flex items-center bg-gray-800/30 px-3 sm:px-4 py-2 rounded-full border border-emerald-500/20 text-sm sm:text-base">
                <Star className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-yellow-400" />
                <span>Expert Curated</span>
              </div>
              <div className="flex items-center bg-gray-800/30 px-3 sm:px-4 py-2 rounded-full border border-emerald-500/20 text-sm sm:text-base">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                <span>Industry Aligned</span>
              </div>
            </div>
          </motion.div>

          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-emerald-400 py-20"
            >
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="text-gray-400 mt-6 text-lg">Loading amazing roadmaps...</p>
            </motion.div>
          ) : selectedRoadmap ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-gray-900/60 backdrop-blur-xl border border-emerald-500/20 rounded-3xl overflow-hidden shadow-2xl relative mb-12"
            >
              {/* Detail View Header */}
              <div className="flex items-center justify-between p-6 sm:p-8 border-b border-gray-700/50 bg-gray-800/40">
                <div className="flex items-center gap-4 sm:gap-6">
                  <button
                    onClick={() => setSelectedRoadmap(null)}
                    className="p-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-2xl transition-all border border-emerald-500/20 group"
                    title="Back to all roadmaps"
                  >
                    <ArrowRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl sm:text-4xl">
                      {selectedRoadmap.subject?.toLowerCase().includes('web') ? '🌐' :
                        selectedRoadmap.subject?.toLowerCase().includes('backend') ? '⚙️' :
                          selectedRoadmap.subject?.toLowerCase().includes('data') ? '📊' :
                            selectedRoadmap.subject?.toLowerCase().includes('mobile') ? '📱' :
                              selectedRoadmap.subject?.toLowerCase().includes('devops') ? '🚀' :
                                selectedRoadmap.subject?.toLowerCase().includes('security') ? '🔒' : '💻'}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight">{selectedRoadmap.subject}</h2>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          {selectedRoadmap.files?.length || 0} Professional Resources
                        </span>
                        {userProgress[selectedRoadmap._id] && (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 border border-blue-500/20 text-blue-400">
                            {Math.round(getProgressPercentage(selectedRoadmap._id))}% Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRoadmap(null)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl transition-all text-sm font-medium border border-gray-600/50"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>

              {/* Detail View Content */}
              <div className="p-6 sm:p-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                  {/* Left Column - Main Info */}
                  <div className="lg:col-span-2 space-y-8">
                    {/* Progress Track */}
                    {userProgress[selectedRoadmap._id] && (
                      <div className="p-6 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-2xl border border-blue-500/20">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-semibold text-gray-200 uppercase tracking-wider">Your Progress</span>
                          <span className="text-2xl font-bold text-emerald-400">{Math.round(getProgressPercentage(selectedRoadmap._id))}%</span>
                        </div>
                        <div className="w-full bg-gray-700/50 rounded-full h-4 relative overflow-hidden">
                          <motion.div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${getProgressPercentage(selectedRoadmap._id)}%` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div className="prose prose-invert max-w-none">
                      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-emerald-400" />
                        Roadmap Overview
                      </h3>
                      <p className="text-gray-300 text-lg leading-relaxed bg-gray-800/20 p-6 rounded-2xl border border-gray-700/30">
                        {selectedRoadmap.content || "Experience a comprehensive, step-by-step learning journey designed by industry experts to take you from foundational concepts to advanced mastery."}
                      </p>
                    </div>

                    {/* Resources Grid */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <List className="w-5 h-5 text-emerald-400" />
                        Curated Learning Modules
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {selectedRoadmap.files?.map((file, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -4, scale: 1.02 }}
                            className="group p-5 bg-gray-800/40 border border-gray-700/50 rounded-2xl hover:border-emerald-500/40 hover:bg-gray-800/60 transition-all cursor-pointer"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${file.endsWith('.pdf') ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                {file.endsWith('.pdf') ? <FileText className="w-6 h-6" /> : <Image className="w-6 h-6" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">Module {idx + 1}</p>
                                <p className="text-gray-400 text-xs mt-1">
                                  {file.endsWith('.pdf') ? 'Interactive Study Guide' : 'Visual Learning Aid'}
                                </p>
                              </div>
                              <a
                                href={getFileUrl(file)}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 text-gray-500 hover:text-emerald-400 transition-colors"
                              >
                                <Download className="w-5 h-5" />
                              </a>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Actions \u0026 Quick Info */}
                  <div className="space-y-6">
                    <div className="p-6 bg-gray-800/40 border border-gray-700/50 rounded-2xl sticky top-8">
                      <h4 className="text-lg font-bold text-white mb-6">Take Action</h4>
                      <div className="space-y-4">
                        <button
                          onClick={() => startLearning(selectedRoadmap)}
                          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-3"
                        >
                          {userProgress[selectedRoadmap._id] ? (
                            <>
                              <TrendingUp className="w-5 h-5" />
                              Resume Learning Path
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              Initialize Roadmap
                            </>
                          )}
                        </button>
                        <div className="flex flex-col gap-3">
                          <button
                            onClick={() => setShowDetailedProgress(true)}
                            className="py-4 px-4 bg-violet-500/10 hover:bg-violet-500/20 text-violet-400 border border-violet-500/20 rounded-xl font-bold text-base transition-all flex items-center justify-center gap-2"
                          >
                            <TrendingUp className="w-5 h-5" />
                            Module Logs & Progress
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 pt-8 border-t border-gray-700/50 space-y-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Complexity</span>
                          <span className="text-emerald-400 font-bold">{selectedRoadmap.difficulty || "Standard"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Total Duration</span>
                          <span className="text-white font-bold">Estimated {selectedRoadmap.estimatedDuration || "40h"}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">Certificate</span>
                          <span className={`${selectedRoadmap.isCertificateAvailable !== false ? "text-amber-400" : "text-gray-500"} font-bold`}>
                            {selectedRoadmap.isCertificateAvailable !== false ? "Available" : "Not Provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div>
              <SearchAndFilter />

              {/* Roadmaps Grid/List */}
              <motion.div
                className={
                  viewMode === 'grid'
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12"
                    : "space-y-3 sm:space-y-4 mb-8 sm:mb-12"
                }
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.2 }}
              >
                {filteredRoadmaps.length > 0 ? (
                  filteredRoadmaps.map((roadmap, index) => (
                    <RoadmapCard key={roadmap._id} roadmap={roadmap} index={index} />
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="col-span-full text-center py-12 sm:py-20 px-4"
                  >
                    <div className="text-4xl sm:text-6xl mb-4 sm:mb-6">🔍</div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-300 mb-2 sm:mb-4">No roadmaps found</h3>
                    <p className="text-gray-400 text-sm sm:text-base">Try adjusting your search terms or filters</p>
                  </motion.div>
                )}
              </motion.div>

              {/* Stats Section */}
              {!loading && roadmaps.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-12 sm:mt-20 text-center px-4"
                >
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">{roadmaps.length}+</div>
                      <div className="text-gray-400 text-xs sm:text-sm lg:text-base">Learning Paths</div>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">100%</div>
                      <div className="text-gray-400 text-xs sm:text-sm lg:text-base">Free Access</div>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">24/7</div>
                      <div className="text-gray-400 text-xs sm:text-sm lg:text-base">Available</div>
                    </div>
                    <div className="bg-gray-800/30 backdrop-blur-sm border border-emerald-500/20 rounded-lg sm:rounded-xl p-3 sm:p-4 lg:p-6">
                      <div className="text-2xl sm:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">Expert</div>
                      <div className="text-gray-400 text-xs sm:text-sm lg:text-base">Curated</div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Modal components are now only used for overlay functionality while in list view if needed, 
                  but primary detail view is now integrated above */}


              {/* Enhanced Progress Modal is handled separately at the bottom */}
              <AnimatePresence>
                {/* Previous Progress Tracking Modal was here */}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        {/* Global ScrollTop is used instead of local FAB */}

        {/* Enhanced Progress Modal */}
        <AnimatePresence>
          {showDetailedProgress && selectedRoadmap && (
            <RoadmapProgress
              roadmap={selectedRoadmap}
              onClose={() => setShowDetailedProgress(false)}
            />
          )}
        </AnimatePresence>

        {/* Learning Experience Modal */}
        <AnimatePresence>
          {showLearningModal && selectedRoadmap && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[9999] flex items-center justify-center p-2 sm:p-4"
              onClick={() => setShowLearningModal(false)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-gray-900/98 backdrop-blur-xl border border-emerald-500/30 rounded-2xl w-[95vw] sm:w-full sm:max-w-lg md:max-w-4xl lg:max-w-6xl max-h-[92vh] sm:max-h-[90vh] flex flex-col relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Learning Modal Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 lg:p-6 border-b border-gray-700/50 flex-shrink-0 gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex-shrink-0">
                      <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-base sm:text-xl lg:text-2xl font-bold text-emerald-400 line-clamp-1">
                        {selectedRoadmap.subject} - Learning Path
                      </h2>
                      <p className="text-gray-400 text-xs sm:text-sm">
                        Step {selectedLearningStep + 1} of {selectedRoadmap.files?.length || 1}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLearningModal(false)}
                    className="p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400 hover:text-white flex-shrink-0"
                    aria-label="Close learning modal"
                  >
                    <X className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>

                {/* Learning Content */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6 custom-scrollbar">
                  {selectedRoadmap.files && selectedRoadmap.files.length > 0 ? (
                    <div className="space-y-4 sm:space-y-6">
                      {/* Progress Indicator */}
                      <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-300">Learning Progress</span>
                          <span className="text-sm text-emerald-400">
                            {Math.round(((selectedLearningStep) / selectedRoadmap.files.length) * 100)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 sm:h-3">
                          <motion.div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-2 sm:h-3 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${((selectedLearningStep) / selectedRoadmap.files.length) * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                      </div>

                      {/* Current Learning Step */}
                      <div className="bg-gray-800/30 border border-emerald-500/20 rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">
                          Step {selectedLearningStep + 1}: Learning Resource
                        </h3>

                        {/* Current Resource Display */}
                        {selectedRoadmap.files[selectedLearningStep] && (
                          <div className="space-y-4">
                            {selectedRoadmap.files[selectedLearningStep].endsWith('.pdf') ? (
                              <div className="border border-gray-700 rounded-lg overflow-hidden">
                                <div className="bg-gray-800/50 p-4 flex items-center gap-3">
                                  <FileText className="w-6 h-6 text-red-400" />
                                  <div className="flex-1">
                                    <h4 className="font-medium text-white">PDF Resource</h4>
                                    <p className="text-sm text-gray-400">Study material for this step</p>
                                  </div>
                                  <a
                                    href={getFileUrl(selectedRoadmap.files[selectedLearningStep])}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                                  >
                                    <Download className="w-4 h-4" />
                                    Open PDF
                                  </a>
                                </div>
                              </div>
                            ) : (
                              <div className="relative rounded-lg overflow-hidden border border-gray-700">
                                <img
                                  src={getFileUrl(selectedRoadmap.files[selectedLearningStep])}
                                  alt={`Learning step ${selectedLearningStep + 1}`}
                                  className="w-full h-64 sm:h-96 object-contain bg-gray-900"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Step Navigation */}
                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                          <button
                            onClick={() => setSelectedLearningStep(Math.max(0, selectedLearningStep - 1))}
                            disabled={selectedLearningStep === 0}
                            className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-700 disabled:opacity-50 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Previous Step
                          </button>

                          <button
                            onClick={() => completeStep(selectedRoadmap._id, selectedLearningStep)}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2"
                          >
                            <CheckCircle className="w-4 h-4" />
                            {selectedLearningStep === selectedRoadmap.files.length - 1 ? 'Complete Course' : 'Mark Complete & Next'}
                          </button>
                        </div>
                      </div>

                      {/* Learning Steps Overview */}
                      <div className="bg-gray-800/30 rounded-lg p-4 sm:p-6">
                        <h3 className="text-lg font-semibold text-white mb-4">Learning Steps</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {selectedRoadmap.files.map((file, index) => {
                            const isCompleted = userProgress[selectedRoadmap._id]?.completedSteps?.includes(index);
                            const isCurrent = index === selectedLearningStep;
                            return (
                              <button
                                key={index}
                                onClick={() => setSelectedLearningStep(index)}
                                className={`p-3 rounded-lg text-left transition-all ${isCurrent
                                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                                  : isCompleted
                                    ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                                    : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700'
                                  }`}
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  {isCompleted ? (
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                  ) : isCurrent ? (
                                    <Play className="w-4 h-4 text-emerald-400" />
                                  ) : (
                                    <BookOpen className="w-4 h-4 text-gray-400" />
                                  )}
                                  <span className="text-sm font-medium">Step {index + 1}</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                  {file.endsWith('.pdf') ? 'PDF Resource' : 'Image Resource'}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-bold text-gray-300 mb-2">No Learning Resources</h3>
                      <p className="text-gray-400">This roadmap doesn't have specific learning materials yet.</p>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Roadmap;