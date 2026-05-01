import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Helmet } from "react-helmet-async";
import {
    ChevronDown,
    Search,
    Filter,
    Code,
    CheckCircle,
    BookOpen,
    ExternalLink,
    Edit,
    Youtube,
    AlertTriangle,
    RefreshCw,
    X,
    BarChart3,
    Calendar,
    BookMarked,
    ArrowRight,
    Clock,
    CheckSquare,
    PlusCircle,
    Target,
    Bookmark,
    Star,
    Activity,
    Play,
    ChevronRight,
    Pause // Added missing Pause icon
} from 'lucide-react';

// Custom SearchX icon since it's not available in lucide-react
const SearchX = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
        <line x1="8" y1="8" x2="14" y2="14" />
        <line x1="8" y1="14" x2="14" y2="8" />
    </svg>
);

const DSAPractice = () => {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterTopic, setFilterTopic] = useState(null);
    const [filterDifficulty, setFilterDifficulty] = useState(null);
    const [filterCompany, setFilterCompany] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const [notes, setNotes] = useState({});
    const [status, setStatus] = useState({});
    const [showNoteDialog, setShowNoteDialog] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);
    const [solvedCount, setSolvedCount] = useState(0);
    const [inProgressCount, setInProgressCount] = useState(0);
    const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
    const [topicProgress, setTopicProgress] = useState({});
    const [searchQuery, setSearchQuery] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [activeTopics, setActiveTopics] = useState({});
    const [dailyStreak, setDailyStreak] = useState(0);
    const [showTutorial, setShowTutorial] = useState(false);
    const [viewMode, setViewMode] = useState("topics"); // topics, all, favorites
    const [favorites, setFavorites] = useState({});
    const [currentGoal, setCurrentGoal] = useState(0);
    const [showGoalDialog, setShowGoalDialog] = useState(false);
    const [tempGoal, setTempGoal] = useState(1); // Added tempGoal state
    const [studyTimer, setStudyTimer] = useState(0);
    const [timerActive, setTimerActive] = useState(false);
    const [timerInterval, setTimerInterval] = useState(null);
    const [completedToday, setCompletedToday] = useState(0);
    const [showStatsDialog, setShowStatsDialog] = useState(false);
    const [lastStudiedDate, setLastStudiedDate] = useState(null);

    const VITE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await axios.get(`${VITE_API_URL}/admin/dsapractice`);
                setQuestions(res.data);
                setTotalQuestionsCount(res.data.length);
                // Initialize topic progress
                const initialTopicProgress = {};
                res.data.forEach(q => {
                    if (!initialTopicProgress[q.topic]) {
                        initialTopicProgress[q.topic] = { total: 0, solved: 0, inProgress: 0 };
                    }
                    initialTopicProgress[q.topic].total += 1;
                });
                setTopicProgress(initialTopicProgress);
            } catch (err) {
                console.error("Error fetching DSA questions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();

        // Load any saved app state from localStorage
        loadAppState();

        // Check if this is first visit
        const hasVisited = localStorage.getItem('dsa-practice-visited');
        if (!hasVisited) {
            setShowTutorial(true);
            localStorage.setItem('dsa-practice-visited', 'true');
        }

        // Calculate daily streak
        calculateDailyStreak();

        // Track completed questions today
        trackCompletedToday();
    }, []);

    // Timer functionality
    useEffect(() => {
        if (timerActive) {
            const interval = setInterval(() => {
                setStudyTimer(prev => prev + 1);
            }, 1000);
            setTimerInterval(interval);
            return () => clearInterval(interval);
        } else if (timerInterval) {
            clearInterval(timerInterval);
            setTimerInterval(null);
        }
    }, [timerActive]);

    const startTimer = () => {
        setTimerActive(true);
    };

    const stopTimer = () => {
        setTimerActive(false);
        // Save study time to localStorage
        const totalStudyTime = parseInt(localStorage.getItem('dsa-practice-study-time') || '0') + studyTimer;
        localStorage.setItem('dsa-practice-study-time', totalStudyTime.toString());
    };

    const resetTimer = () => {
        setTimerActive(false);
        setStudyTimer(0);
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTotalStudyTime = () => {
        const savedTime = parseInt(localStorage.getItem('dsa-practice-study-time') || '0');
        return formatTime(savedTime + (timerActive ? studyTimer : 0));
    };

    const calculateDailyStreak = () => {
        const lastStudied = localStorage.getItem('dsa-practice-last-studied');
        const streak = parseInt(localStorage.getItem('dsa-practice-streak') || '0');

        if (!lastStudied) {
            setDailyStreak(0);
            return;
        }

        const today = new Date().toDateString();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toDateString();

        setLastStudiedDate(new Date(lastStudied));

        if (lastStudied === today) {
            // Already studied today
            setDailyStreak(streak);
        } else if (lastStudied === yesterdayString) {
            // Studied yesterday, update streak if solve a problem today
            setDailyStreak(streak);
        } else {
            // Streak broken
            localStorage.setItem('dsa-practice-streak', '0');
            setDailyStreak(0);
        }
    };

    const updateDailyStreak = () => {
        const today = new Date().toDateString();
        const lastStudied = localStorage.getItem('dsa-practice-last-studied');

        if (lastStudied !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();

            let newStreak = 1;
            if (lastStudied === yesterdayString) {
                // Continuing the streak
                newStreak = parseInt(localStorage.getItem('dsa-practice-streak') || '0') + 1;
            }

            localStorage.setItem('dsa-practice-streak', newStreak.toString());
            localStorage.setItem('dsa-practice-last-studied', today);
            setDailyStreak(newStreak);
            setLastStudiedDate(new Date());
        }
    };

    const trackCompletedToday = () => {
        const today = new Date().toDateString();
        const completedToday = JSON.parse(localStorage.getItem(`dsa-practice-completed-${today}`) || '[]');
        setCompletedToday(completedToday.length);
    };

    const updateCompletedToday = (questionId) => {
        const today = new Date().toDateString();
        const completedToday = JSON.parse(localStorage.getItem(`dsa-practice-completed-${today}`) || '[]');

        if (!completedToday.includes(questionId)) {
            completedToday.push(questionId);
            localStorage.setItem(`dsa-practice-completed-${today}`, JSON.stringify(completedToday));
            setCompletedToday(completedToday.length);
        }
    };

    const loadAppState = () => {
        // Load saved goal
        const savedGoal = parseInt(localStorage.getItem('dsa-practice-goal') || '0');
        setCurrentGoal(savedGoal);
        setTempGoal(savedGoal || 1);

        // Load favorites
        const savedFavorites = JSON.parse(localStorage.getItem('dsa-practice-favorites') || '{}');
        setFavorites(savedFavorites);

        // Load notes and status
        questions.forEach((q) => {
            const savedNote = localStorage.getItem(`note-${q._id}`);
            const savedStatus = localStorage.getItem(`status-${q._id}`);
            if (savedNote) setNotes((prev) => ({ ...prev, [q._id]: savedNote }));
            if (savedStatus) setStatus((prev) => ({ ...prev, [q._id]: savedStatus }));
        });
    };

    const toggleFavorite = (questionId) => {
        const newFavorites = { ...favorites };
        newFavorites[questionId] = !newFavorites[questionId];

        if (!newFavorites[questionId]) {
            delete newFavorites[questionId];
        }

        setFavorites(newFavorites);
        localStorage.setItem('dsa-practice-favorites', JSON.stringify(newFavorites));
    };

    const saveGoal = () => {
        if (!isNaN(tempGoal) && tempGoal > 0) {
            setCurrentGoal(tempGoal);
            localStorage.setItem('dsa-practice-goal', tempGoal.toString());
        }
        setShowGoalDialog(false);
    };

    const handleNoteChange = (questionId, note) => {
        setNotes({ ...notes, [questionId]: note });
        localStorage.setItem(`note-${questionId}`, note);
    };

    const handleStatusChange = (questionId, value, topic) => {
        const newStatus = { ...status, [questionId]: value };
        setStatus(newStatus);
        localStorage.setItem(`status-${questionId}`, value);

        // Update solved count and in-progress count
        const newSolvedCount = Object.values(newStatus).filter(
            (s) => s === "solved"
        ).length;

        const newInProgressCount = Object.values(newStatus).filter(
            (s) => s === "in-progress"
        ).length;

        setSolvedCount(newSolvedCount);
        setInProgressCount(newInProgressCount);

        // Update topic progress
        const newTopicProgress = { ...topicProgress };

        // First, revert previous status
        if (status[questionId] === "solved") {
            newTopicProgress[topic].solved -= 1;
        } else if (status[questionId] === "in-progress") {
            newTopicProgress[topic].inProgress -= 1;
        }

        // Then update with new status
        if (value === "solved") {
            newTopicProgress[topic].solved += 1;
            // Update streak if solving for the first time today
            updateDailyStreak();
            // Update completed today count
            updateCompletedToday(questionId);
        } else if (value === "in-progress") {
            newTopicProgress[topic].inProgress += 1;
        }

        setTopicProgress(newTopicProgress);
    };

    const handleYouTubeClick = (ytLink) => {
        if (ytLink) {
            window.open(ytLink, "_blank", "noopener,noreferrer");
        } else {
            alert("No YouTube solution available for this question");
        }
    };

    useEffect(() => {
        let solved = 0;
        let inProgress = 0;
        const newTopicProgress = { ...topicProgress };

        questions.forEach((q) => {
            const savedNote = localStorage.getItem(`note-${q._id}`);
            const savedStatus = localStorage.getItem(`status-${q._id}`);

            if (savedNote) setNotes((prev) => ({ ...prev, [q._id]: savedNote }));
            if (savedStatus) {
                setStatus((prev) => ({ ...prev, [q._id]: savedStatus }));
                if (savedStatus === "solved") {
                    solved++;
                    if (newTopicProgress[q.topic]) {
                        newTopicProgress[q.topic].solved += 1;
                    }
                } else if (savedStatus === "in-progress") {
                    inProgress++;
                    if (newTopicProgress[q.topic]) {
                        newTopicProgress[q.topic].inProgress += 1;
                    }
                }
            }
        });

        setSolvedCount(solved);
        setInProgressCount(inProgress);
        setTopicProgress(newTopicProgress);
    }, [questions]);

    const toggleTopic = (topic) => {
        setActiveTopics(prev => ({
            ...prev,
            [topic]: !prev[topic]
        }));
    };

    const topics = [
        { value: "array", label: "Array" },
        { value: "string", label: "String" },
        { value: "linkedlist", label: "Linked List" },
        { value: "stack", label: "Stack" },
        { value: "queue", label: "Queue" },
        { value: "tree", label: "Tree" },
        { value: "dp", label: "Dynamic Programming" },
        { value: "recursion", label: "Recursion" },
        { value: "binarysearch", label: "Binary Search" },
        { value: "sorting", label: "Sorting" },
        { value: "graph", label: "Graph" },
        { value: "hashing", label: "Hashing" },
        { value: "heap", label: "Heap" },
        { value: "trie", label: "Trie" },
        { value: "greedy", label: "Greedy" },
        { value: "backtracking", label: "Backtracking" },
        { value: "twopointers", label: "Two Pointers" },
        { value: "slidingwindow", label: "Sliding Window" },
        { value: "bitmanipulation", label: "Bit Manipulation" },
        { value: "segmenttree", label: "Segment Tree" },
        { value: "matrix", label: "Matrix" },
        { value: "maths", label: "Mathematics" },
        { value: "gametheory", label: "Game Theory" },
        { value: "divideandconquer", label: "Divide and Conquer" }
    ];

    const difficulties = [
        { value: "basic", label: "Basic" },
        { value: "easy", label: "Easy" },
        { value: "medium", label: "Medium" },
        { value: "hard", label: "Hard" }
    ];

    const statusOptions = [
        { value: "all", label: "All" },
        { value: "solved", label: "Solved" },
        { value: "in-progress", label: "In Progress" },
        { value: "unsolved", label: "Unsolved" }
    ];

    const companies = [
        ...new Set(
            questions.flatMap((q) => q.company.split(",").map((c) => c.trim()))
        )
    ].map((company) => ({
        value: company,
        label: company
    })).filter(company => company.value);

    const filteredQuestions = questions.filter((q) => {
        const matchesTopic = filterTopic ? q.topic === filterTopic.value : true;
        const matchesDifficulty = filterDifficulty ? q.difficulty.toLowerCase() === filterDifficulty.value : true;
        const matchesCompany = filterCompany
            ? q.company.split(",").map((c) => c.trim()).includes(filterCompany.value)
            : true;
        const matchesSearch = searchQuery.trim() === ""
            ? true
            : q.question.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by status
        let matchesStatus = true;
        if (filterStatus) {
            if (filterStatus.value === "solved") {
                matchesStatus = status[q._id] === "solved";
            } else if (filterStatus.value === "in-progress") {
                matchesStatus = status[q._id] === "in-progress";
            } else if (filterStatus.value === "unsolved") {
                matchesStatus = !status[q._id] || status[q._id] === "unsolved";
            }
        }

        // Filter by favorites if in favorites view
        const matchesFavorites = viewMode === "favorites" ? favorites[q._id] : true;

        return (
            matchesTopic &&
            matchesDifficulty &&
            matchesCompany &&
            matchesSearch &&
            matchesStatus &&
            matchesFavorites
        );
    });

    const openNoteDialog = (questionId) => {
        setSelectedQuestionId(questionId);
        setShowNoteDialog(true);
    };

    const closeNoteDialog = () => {
        setShowNoteDialog(false);
        setSelectedQuestionId(null);
    };

    const handleSaveNote = (e) => {
        e.preventDefault();
        const noteInput = e.target.elements.noteInput.value;
        if (noteInput !== null && selectedQuestionId) {
            handleNoteChange(selectedQuestionId, noteInput);
        }
        closeNoteDialog();
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "basic":
                return "bg-blue-500";
            case "easy":
                return "bg-emerald-500";
            case "medium":
                return "bg-amber-500";
            case "hard":
                return "bg-red-500";
            default:
                return "bg-gray-500";
        }
    };

    const getDifficultyBadgeStyle = (difficulty) => {
        switch (difficulty.toLowerCase()) {
            case "basic":
                return "bg-blue-500/10 text-blue-500 border border-blue-500/30";
            case "easy":
                return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30";
            case "medium":
                return "bg-amber-500/10 text-amber-500 border border-amber-500/30";
            case "hard":
                return "bg-red-500/10 text-red-500 border border-red-500/30";
            default:
                return "bg-gray-500/10 text-gray-500 border border-gray-500/30";
        }
    };

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            backgroundColor: '#0f172a',
            borderColor: '#334155',
            borderRadius: '0.5rem',
            boxShadow: 'none',
            '&:hover': {
                borderColor: '#60a5fa',
            },
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: '#0f172a',
            borderRadius: '0.5rem',
            border: '1px solid #334155',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.3)',
            overflow: 'hidden',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#1e40af' : state.isFocused ? '#1e293b' : '#0f172a',
            color: state.isSelected ? 'white' : '#e2e8f0',
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: '#1e293b',
            },
        }),
        singleValue: (provided) => ({
            ...provided,
            color: 'white',
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#94a3b8',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#60a5fa',
            '&:hover': {
                color: '#93c5fd',
            },
        }),
        indicatorSeparator: (provided) => ({
            ...provided,
            backgroundColor: '#334155',
        }),
    };

    // Calculate overall progress percentage
    const overallProgressPercentage = totalQuestionsCount > 0
        ? Math.round((solvedCount / totalQuestionsCount) * 100)
        : 0;

    // Calculate daily goal progress
    const dailyGoalPercentage = currentGoal > 0
        ? Math.min(100, Math.round((completedToday / currentGoal) * 100))
        : 0;

    // Compute difficulty stats for stats dialog
    const difficultyStats = {
        basic: { total: 0, solved: 0, percentage: 0 },
        easy: { total: 0, solved: 0, percentage: 0 },
        medium: { total: 0, solved: 0, percentage: 0 },
        hard: { total: 0, solved: 0, percentage: 0 },
    };

    questions.forEach(q => {
        const difficulty = q.difficulty.toLowerCase();
        if (difficultyStats[difficulty]) {
            difficultyStats[difficulty].total += 1;
            if (status[q._id] === "solved") {
                difficultyStats[difficulty].solved += 1;
            }
        }
    });

    Object.keys(difficultyStats).forEach(difficulty => {
        const stats = difficultyStats[difficulty];
        stats.percentage = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;
    });

    // Compute top topics for stats dialog
    const topicStats = Object.keys(topicProgress).map(topic => ({
        name: topic,
        total: topicProgress[topic].total,
        solved: topicProgress[topic].solved,
        percentage: topicProgress[topic].total > 0
            ? Math.round((topicProgress[topic].solved / topicProgress[topic].total) * 100)
            : 0,
    }));

    const topTopics = topicStats
        .sort((a, b) => b.percentage - a.percentage || b.total - a.total)
        .slice(0, 5);

    // Total study time for stats dialog
    const totalStudyTime = parseInt(localStorage.getItem('dsa-practice-study-time') || '0') + (timerActive ? studyTimer : 0);

    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "KalawatiPutra Edu",
        url: "https://kalawatiputra.com",
        logo: "https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/kalawatiputra-logo.png",
        description: "KalawatiPutra Edu offers DSA practice, coding interview preparation, and career counseling.",
        sameAs: [
            "https://www.linkedin.com/company/kalawatiputra-edu",
            "https://twitter.com/kalawatiputra",
        ],
    };

    const itemListSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "DSA Practice Questions",
        description: "A collection of Data Structures and Algorithms practice questions for coding interview preparation.",
        itemListElement: filteredQuestions.map((q, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
                "@type": "CreativeWork",
                name: q.question,
                description: `A ${q.difficulty} DSA question on ${q.topic} asked by ${q.company}.`,
                url: q.link || "https://kalawatiputra.com/dsapractice",
                sameAs: q.ytLink ? [q.ytLink] : undefined,
            },
        })),
    };

    const getSelectedQuestion = () => {
        return questions.find(q => q._id === selectedQuestionId) || {};
    };

    // Get a recommended question - prioritizing in-progress questions, then balancing difficulty
    const getRecommendedQuestion = () => {
        // First check for any in-progress questions
        const inProgressQuestions = questions.filter(q => status[q._id] === "in-progress");
        if (inProgressQuestions.length > 0) {
            return inProgressQuestions[Math.floor(Math.random() * inProgressQuestions.length)];
        }

        // Otherwise look for unsolved questions with a bias towards easier ones if beginner, 
        // or a mix if more advanced
        const unsolvedQuestions = questions.filter(q => !status[q._id] || status[q._id] === "unsolved");

        if (unsolvedQuestions.length === 0) return null;

        // Determine user level based on % solved
        const userLevel = overallProgressPercentage < 10 ? "beginner" :
            overallProgressPercentage < 40 ? "intermediate" : "advanced";

        let weightedQuestions = [];

        if (userLevel === "beginner") {
            // Beginners get more easy questions
            unsolvedQuestions.forEach(q => {
                const difficulty = q.difficulty.toLowerCase();
                if (difficulty === "basic") weightedQuestions.push(...Array(5).fill(q));
                else if (difficulty === "easy") weightedQuestions.push(...Array(3).fill(q));
                else if (difficulty === "medium") weightedQuestions.push(q);
                // Hard questions get default weight of 1
            });
        } else if (userLevel === "intermediate") {
            // Intermediate users get more medium questions
            unsolvedQuestions.forEach(q => {
                const difficulty = q.difficulty.toLowerCase();
                if (difficulty === "basic") weightedQuestions.push(q);
                else if (difficulty === "easy") weightedQuestions.push(...Array(3).fill(q));
                else if (difficulty === "medium") weightedQuestions.push(...Array(5).fill(q));
                else if (difficulty === "hard") weightedQuestions.push(...Array(2).fill(q));
            });
        } else {
            // Advanced users get more hard questions
            unsolvedQuestions.forEach(q => {
                const difficulty = q.difficulty.toLowerCase();
                if (difficulty === "basic") weightedQuestions.push(q);
                else if (difficulty === "easy") weightedQuestions.push(q);
                else if (difficulty === "medium") weightedQuestions.push(...Array(3).fill(q));
                else if (difficulty === "hard") weightedQuestions.push(...Array(5).fill(q));
            });
        }

        return weightedQuestions[Math.floor(Math.random() * weightedQuestions.length)];
    };

    const recommendedQuestion = getRecommendedQuestion();

    return (
        <div className="bg-gradient-to-br from-gray-900 to-black text-slate-200 min-h-screen font-['Outfit', sans-serif]">
            <Helmet>
                <title>DSA Practice | KalawatiPutra Edu</title>
                <meta
                    name="description"
                    content="Practice Data Structures and Algorithms with curated questions at KalawatiPutra Edu. Filter by topic and company to prepare for coding interviews."
                />
                <meta
                    name="keywords"
                    content="DSA practice, coding interview questions, data structures, algorithms, KalawatiPutra Edu, tech interview preparation"
                />
                <meta name="robots" content="index, follow" />
                <meta name="author" content="KalawatiPutra Edu" />
                <link rel="canonical" href="https://kalawatiputra.com/dsapractice" />
                <meta property="og:title" content="DSA Practice | KalawatiPutra Edu" />
                <meta
                    property="og:description"
                    content="Master DSA with practice questions at KalawatiPutra Edu. Filter by topic and company to ace coding interviews."
                />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://kalawatiputra.com/dsapractice" />
                <meta
                    property="og:image"
                    content="https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/dsapractice-og.jpg"
                />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="DSA Practice | KalawatiPutra Edu" />
                <meta
                    name="twitter:description"
                    content="Master DSA with practice questions at KalawatiPutra Edu. Filter by topic and company to ace coding interviews."
                />
                <meta
                    name="twitter:image"
                    content="https://res.cloudinary.com/dyv8xdud5/image/upload/v1730547995/kalawatiPutra/dsapractice-og.jpg"
                />
                <link
                    href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <style>{`
                    body {
                        font-family: 'Outfit', sans-serif;
                        background-color: #020617;
                    }

                    .custom-scrollbar::-webkit-scrollbar {
                        width: 5px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: rgba(15, 23, 42, 0.3);
                        border-radius: 10px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: rgba(96, 165, 250, 0.5);
                        border-radius: 10px;
                    }

                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: rgba(96, 165, 250, 0.7);
                    }

                    .grid-pattern {
                        background-image: radial-gradient(rgba(96, 165, 250, 0.1) 1px, transparent 1px);
                        background-size: 20px 20px;
                    }

                    .wave-pattern {
                        background-image: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264.888-.14 1.56-.08 2.97-.223 4.275-.481 1.718-.043 3.422-.384 5.1-.993 1.65-.601 3.396-1.253 5.038-1.89 1.712-.655 3.486-1.306 5.299-1.89.92-.303 1.78-.604 2.602-.893 2.21-.725 4.315-1.407 6.244-2.055 1.928-.648 3.676-1.247 5.211-1.786 1.536-.54 2.857-1.012 3.927-1.458 1.07-.445 1.856-.775 2.318-.894.478-.121.689-.17.633-.148.694-.301 1.648-.688 2.702-1.15 1.05-.45 2.2-.984 3.22-1.563.83-.47 1.6-.96 2.24-1.463.58-.452 1.04-.84 1.29-1.14.25-.293.37-.487.41-.57.02-.07.03-.12.03-.12l.48.38c.39.163.8.383.13.65.055.276.09.615.09 1.013 0 .807-.15 1.756-.47 2.786-.31 1.02-.81 2.094-1.5 3.15l.13.001c-.7.115-.13.228-.19.342l-.21.033c-.05.092-.096.182-.14.27-.14.27-.29.54-.42.8-.38.69-.75 1.35-.78 1.41h.06c-.1.19-.23.39-.37.59-.07.11-.15.22-.22.34-.14.19-.29.38.22.34-.14.19-.29.38-.44.57-.04.06-.08.11-.13.17v.01l-.02.02c-.36.49-.75.97-1.17 1.45-.21.24-.43.47-.65.71-.22.24-.44.47-.67.71-1.36 1.38-2.26 2.13-2.64 2.44-.06.05-.1.08-.12.1v.01h-.01c-.08.06-.11.09-.11.09v.07c.04.07.11.19.21.37.25.39.63.95 1.11 1.62.24.33.5.67.78 1.01.29.35.6.69.92 1.02.33.33.67.65 1.03.95.35.3.72.57 1.09.8.75.47 1.52.82 2.26 1.02.74.2 1.45.27 2.08.18.63-.1 1.17-.35 1.57-.77.41-.42.67-.99.77-1.7.05-.39.05-.81.01-1.26-.05-.46-.15-.94-.31-1.44-.81-2.49-2.85-5.58-5.1-9.46 1.53-.3 2.99-.66 4.36-1.09 1.55-.48 3-.99 4.35-1.53 1.35-.53 2.59-1.08 3.72-1.64 1.11-

-.55 2.13-1.1 3.03-1.64.45-.27.86-.54 1.24-.8.42-.29.77-.57 1.08-.84.34-.29.6-.57.79-.85.25-.34.37-.68.36-1 0-.04-.01-.08-.02-.09-.91 1.15-2.89 2.38-5.61 3.74-1.37.68-2.91 1.39-4.63 2.13-.87.37-1.78.75-2.74 1.14-.96.39-1.96.79-2.99 1.19l-1.42-2.22c-1.34-2.03-2.76-4.08-4.21-6.12 2.62-.62 4.89-1.53 6.76-2.7 1.86-1.16 3.33-2.57 4.28-4.13.96-1.56 1.41-3.27 1.33-5-.08-1.75-.68-3.52-1.78-5.13-.1-.14-.21-.29-.31-.43-.11-.15-.22-.3-.34-.44-.12-.14-.24-.29-.37-.43-.13-.14-.27-.29-.41-.43-1.34-1.3-3.15-2.62-5.4-3.53-2.22-.92-4.95-1.42-8.05-.92-3.08.5-6.54 1.95-10.41 4.53-1.61 1.07-3.33 2.33-5.16 3.76-1.83 1.43-3.77 3.05-5.84 4.85-.05.03-.09.05-.12.02-.02-.02-.03-.07-.03-.15 0-.22.02-.55.06-.97.29-2.82 1.09-6.4 2.04-10.05.94-3.65 2.05-7.35 2.96-10.49.23-.79.44-1.52.64-2.2.19-.67.37-1.28.51-1.82.14-.53.25-.99.32-1.36.08-.38.12-.65.12-.81 0-.31-.11-.58-.35-.77-.23-.2-.57-.3-1-.3-.86 0-2 .36-3.47 1.14-1.47.79-3.24 2.05-5.31 3.85-2.06 1.79-4.39 4.14-7.03 7.11-2.64 2.97-5.56 6.56-8.79 10.89.09-1.44.14-2.38.14-2.8 0-1.41-.18-2.49-.51-3.22-.33-.74-.78-1.15-1.33-1.34-.55-.2-1.17-.19-1.87.04-.69.24-1.47.66-2.33 1.28-1.56 1.11-3.41 3.12-5.62 6.17-.2.03-.37.05-.51.05-.56 0-.99-.19-1.27-.52-.28-.32-.42-.76-.42-1.25 0-.29.04-.64.14-1.05.09-.42.21-.87.38-1.36.16-.49.35-1.01.57-1.57.21-.56.43-1.12.66-1.67.48-1.12.91-2.08 1.31-2.87.4-.8.71-1.43.95-1.89.23-.46.37-.74.4-.84.02-.09-.04-.33-.2-.69-.15-.34-.4-.73-.76-1.12-.35-.38-.82-.75-1.4-1.09-.57-.34-1.25-.59-2.02-.72-.25.22-.53.45-.84.67-.58.41-1.34.9-2.24 1.42-.91.53-1.95 1.07-3.09 1.63-1.15.57-2.37 1.1-3.65 1.59-.06 0-.08-.01-.06-.03 0-.01.04-.03.1-.06.06-.04.13-.07.22-.1.35-.2.66-.39.94-.59.28-.2.53-.39.72-.57.2-.18.36-.34.48-.49.09-.12.15-.23.17-.33.03-.34-.09-.63-.37-.86-.28-.22-.76-.39-1.44-.48-.56-.08-1.29-.09-2.17-.03-.88.07-1.82.21-2.82.43-1 .22-1.98.5-2.93.85s-1.8.73-2.54 1.15c-.44.25-.81.5-1.12.76-.31.25-.57.51-.76.76-.19.25-.32.51-.39.76-.05.21-.05.41-.01.58v.01c.03.04.08.09.16.19.09.09.2.21.35.34.14.14.3.29.49.47.17.17.37.36.59.55.22.2.44.4.69.6.24.2.5.4.77.58.25.18.52.36.78.53.27.17.54.33.8.48 2.65 1.47 5.27 2.23 7.99 2.3 2.72.07 5.53-.45 8.58-1.56-.7 1.2-1.32 2.37-1.88 3.54-.56 1.17-1.05 2.28-1.48 3.35-.43 1.07-.81 2.07-1.13 3.01-.96 2.79-1.56 5.31-1.79 7.53-.24 2.22-.19 4.15.13 5.69.32 1.57.89 2.71 1.67 3.34.6.49 1.34.7 2.12.6.78-.1 1.61-.47 2.39-1.1.76-.62 1.56-1.51 2.24-2.66.69-1.16 1.35-2.58 1.97-4.28-1.8 8.24-6.33 20.28-13.51 35.54 1.33-1.77 2.7-3.68 4.13-5.77 1.43-2.08 2.9-4.3 4.41-6.7 1.51-2.39 3.05-4.93 4.63-7.68s3.18-5.66 4.79-8.93c1.61-3.26 3.24-6.76 4.9-10.58 1.66-3.8 3.32-7.97 5.05-12.59 1.19.69 2.4 1.27 3.61 1.75 1.19.48 2.37.83 3.54 1.09 1.23.25 2.43.37 3.6.32 1.17-.05 2.3-.24 3.37-.58 1.08-.36 2.09-.9 3.04-1.61.94-.72 1.8-1.61 2.56-2.69.77-1.09 1.43-2.38 1.98-3.87.55-1.5.98-3.18 1.22-5.04.24-1.86.22-3.9-.13-6.12-.35-2.22-1.07

-4.6-2.16-7.15 2.19-1.9 4.36-3.8 6.46-5.65 2.12-1.87 4.17-3.7 6.14-5.49 1.97-1.79 3.86-3.54 5.67-5.25 1.81-1.7 3.55-3.37 5.2-4.99 1.66-1.62 3.24-3.2 4.74-4.73 1.49-1.53 2.92-3.01 4.25-4.46.77.42 1.43.94 1.96 1.56.54.61.96 1.3 1.24 2.05.29.75.43 1.54.4 2.37-.05 1.27-.47 2.54-1.29 3.75-.83 1.21-2.05 2.35-3.69 3.38-1.41.89-3.17 1.7-5.28 2.4-.5.16-1.04.33-1.6.49-.56.16-1.15.31-1.76.46-.6.15-1.24.29-1.89.42-.64.13-1.3.25-1.98.37 1.33 1.83 2.64 3.66 3.91 5.5 1.28 1.84 2.53 3.68 3.75 5.53 1.22 1.85 2.41 3.7 3.56 5.55 1.16 1.85 2.27 3.7 3.34 5.55.17-.05.37-.1.6-.17 1.08-.32 2.39-.75 3.9-1.31 1.5-.55 3.17-1.21 4.99-1.99 1.82-.77 3.77-1.67 5.84-2.7 2.08-1.02 4.27-2.16 6.56-3.45 2.3-1.29 4.68-2.71 7.16-4.29-1.41 3.96-2.65 7.32-3.71 10.08-1.06 2.75-1.95 4.94-2.67 6.56-.71 1.62-1.26 2.66-1.62 3.15-.9 1.3-1.68 2.27-2.34 2.94-.66.67-1.19 1.04-1.59 1.12-.4.08-.67-.13-.81-.63-.14-.5-.13-1.31.01-2.44.06-.46.14-.97.24-1.53.1-.55.21-1.15.34-1.79.13-.64.26-1.29.41-1.98.14-.68.29-1.39.44-2.09 0-.02-.01-.03-.02-.04s-.03-.01-.05-.01c-.03 0-.14.09-.35.26-.21.16-.47.38-.8.66 0 0-.52.45-1.48 1.22-.96.77-2.17 1.69-3.61 2.73-1.44 1.03-3.12 2.15-5.02 3.36-1.9 1.21-3.96 2.45-6.16 3.73-.22.12-.43.25-.65.36-.21.12-.43.24-.64.36-.43.23-.85.47-1.28.69-.43.22-.85.44-1.28.66 0 0-.84.41-2.19 1.02-1.35.62-3.18 1.41-5.37 2.28-1.1.43-2.3.89-3.58 1.35-1.28.46-2.64.92-4.07 1.38-142.46-2.9.91-4.42 1.34-1.52.43-3.08.84-4.67 1.21-1.58.37-3.19.7-4.81.99-1.63.28-3.25.51-4.89.67.12.28.28.62.49 1.04.21.42.46.89.73 1.4.27.52.56 1.07.87 1.63.31.57.63 1.15.95 1.73.32.59.64 1.17.96 1.73.32.57.62 1.12.9 1.63.28.52.53.99.75 1.41.22.42.41.77.54 1.05l.19.37c.06.13.11.21.13.26.03.04.04.06.04.06 0 .01-.05-.04-.14-.14 0 0-.97-.87-2.61-2.17-.4-.31-.83-.65-1.29-1.01z' fill='%23314770' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
                    }
                `}</style>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(itemListSchema),
                    }}
                />
            </Helmet>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2 flex items-center">
                                <BookOpen className="mr-2 text-blue-500" size={28} />
                                DSA Practice
                            </h1>
                            <p className="text-slate-400 max-w-xl">
                                Master Data Structures and Algorithms with this curated list of coding interview questions. Track your progress and become interview-ready.
                            </p>
                        </div>
                        <div className="mt-4 lg:mt-0 flex flex-col md:flex-row gap-3">
                            {/* Study Timer */}
                            <div className="flex items-center mr-4 bg-slate-900 p-2 rounded-lg border border-slate-800">
                                <Clock className="text-blue-500 mr-2" size={20} />
                                <div className="text-lg font-mono">{formatTime(studyTimer)}</div>
                                <div className="ml-2 flex gap-1">
                                    {!timerActive ? (
                                        <button
                                            onClick={startTimer}
                                            className="bg-blue-600 hover:bg-blue-700 text-white p-1 rounded"
                                        >
                                            <Play size={14} />
                                        </button>
                                    ) : (
                                        <button
                                            onClick={stopTimer}
                                            className="bg-amber-600 hover:bg-amber-700 text-white p-1 rounded"
                                        >
                                            <Pause size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={resetTimer}
                                        className="bg-slate-700 hover:bg-slate-600 text-white p-1 rounded"
                                    >
                                        <RefreshCw size={14} />
                                    </button>
                                </div>
                            </div>

                            {/* Stats Button */}
                            <button
                                onClick={() => setShowStatsDialog(true)}
                                className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <BarChart3 className="mr-2 text-blue-500" size={20} />
                                View Stats
                            </button>

                            {/* Daily Goal */}
                            <div
                                onClick={() => setShowGoalDialog(true)}
                                className="bg-slate-800 hover:bg-slate-700 cursor-pointer text-white px-4 py-2 rounded-lg flex items-center"
                            >
                                <Target className="mr-2 text-blue-500" size={20} />
                                <div>
                                    <div className="text-sm text-slate-400">Daily Goal: {completedToday}/{currentGoal || '?'}</div>
                                    <div className="w-full bg-slate-700 rounded-full h-1.5 mt-1">
                                        <div
                                            className="bg-blue-600 rounded-full h-1.5"
                                            style={{ width: `${dailyGoalPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="bg-slate-900 rounded-lg p-4 shadow-md border border-slate-800">
                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-3">
                            <div className="flex items-center mb-3 md:mb-0">
                                <div className="flex items-center bg-slate-800 p-1 rounded-lg mr-4">
                                    <div className="bg-blue-600 text-white px-3 py-1 rounded-md">
                                        {solvedCount}
                                    </div>
                                    <div className="text-slate-300 px-3">
                                        Solved
                                    </div>
                                </div>
                                <div className="flex items-center bg-slate-800 p-1 rounded-lg mr-4">
                                    <div className="bg-amber-600 text-white px-3 py-1 rounded-md">
                                        {inProgressCount}
                                    </div>
                                    <div className="text-slate-300 px-3">
                                        In Progress
                                    </div>
                                </div>
                                <div className="flex items-center bg-slate-800 p-1 rounded-lg">
                                    <div className="bg-slate-700 text-white px-3 py-1 rounded-md">
                                        {totalQuestionsCount - solvedCount - inProgressCount}
                                    </div>
                                    <div className="text-slate-300 px-3">
                                        Todo
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center mr-2">
                                    <Calendar className="text-blue-500 mr-1" size={16} />
                                    <span className="text-slate-400 text-sm mr-1">Streak:</span>
                                    <span className="text-white font-semibold">{dailyStreak} days</span>
                                </div>
                                {lastStudiedDate && (
                                    <div className="text-slate-500 text-xs">
                                        Last studied: {lastStudiedDate.toLocaleDateString()}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-2.5">
                            <div
                                className="bg-blue-600 rounded-full h-2.5 transition-all duration-500"
                                style={{ width: `${overallProgressPercentage}%` }}
                            ></div>
                        </div>
                        <div className="text-right mt-1 text-slate-400 text-sm">
                            {overallProgressPercentage}% Complete
                        </div>
                    </div>
                </div>

                {/* View Mode Controls */}
                <div className="mb-4 flex flex-wrap gap-2">
                    <button
                        onClick={() => setViewMode("topics")}
                        className={`px-4 py-2 rounded-lg flex items-center ${viewMode === "topics"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        <BookMarked className="mr-2" size={16} />
                        By Topics
                    </button>
                    <button
                        onClick={() => setViewMode("all")}
                        className={`px-4 py-2 rounded-lg flex items-center ${viewMode === "all"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        <Code className="mr-2" size={16} />
                        All Questions
                    </button>
                    <button
                        onClick={() => setViewMode("favorites")}
                        className={`px-4 py-2 rounded-lg flex items-center ${viewMode === "favorites"
                            ? "bg-blue-600 text-white"
                            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                            }`}
                    >
                        <Star className="mr-2" size={16} />
                        Favorites {Object.keys(favorites).length > 0 ? `(${Object.keys(favorites).length})` : ""}
                    </button>
                </div>

                {/* Recommended Question Card */}
                {recommendedQuestion && (
                    <div className="mb-6 bg-gradient-to-r from-blue-900/40 to-indigo-900/40 rounded-lg p-4 border border-blue-800/50">
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-lg font-semibold text-white flex items-center">
                                <Activity className="mr-2 text-blue-500" size={20} />
                                Recommended Question
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded ${getDifficultyBadgeStyle(recommendedQuestion.difficulty)}`}>
                                {recommendedQuestion.difficulty}
                            </span>
                        </div>

                        <h4 className="text-white font-medium mb-2">{recommendedQuestion.question}</h4>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <span className="bg-slate-800 text-blue-400 text-xs px-2 py-1 rounded">
                                {recommendedQuestion.topic}
                            </span>
                            {recommendedQuestion.company && (
                                <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                                    {recommendedQuestion.company}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {recommendedQuestion.link && (
                                <a
                                    href={recommendedQuestion.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-blue-700 hover:bg-blue-600 text-white text-sm px-3 py-1.5 rounded flex items-center"
                                >
                                    <ExternalLink size={14} className="mr-1" />
                                    Solve
                                </a>
                            )}
                            {recommendedQuestion.ytLink && (
                                <button
                                    onClick={() => handleYouTubeClick(recommendedQuestion.ytLink)}
                                    className="bg-red-700 hover:bg-red-600 text-white text-sm px-3 py-1.5 rounded flex items-center"
                                >
                                    <Youtube size={14} className="mr-1" />
                                    Solution
                                </button>
                            )}
                            <button
                                onClick={() => openNoteDialog(recommendedQuestion._id)}
                                className={`${notes[recommendedQuestion._id]
                                    ? "bg-emerald-700 hover:bg-emerald-600"
                                    : "bg-slate-700 hover:bg-slate-600"
                                    } text-white text-sm px-3 py-1.5 rounded flex items-center`}
                            >
                                <Edit size={14} className="mr-1" />
                                {notes[recommendedQuestion._id] ? "View Notes" : "Add Notes"}
                            </button>
                            <div className="ml-auto">
                                <select
                                    value={status[recommendedQuestion._id] || "unsolved"}
                                    onChange={(e) => handleStatusChange(
                                        recommendedQuestion._id,
                                        e.target.value,
                                        recommendedQuestion.topic
                                    )}
                                    className="bg-slate-800 text-white text-sm px-3 py-1.5 rounded border border-slate-700"
                                >
                                    <option value="unsolved">Not Started</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="solved">Solved</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filters */}
                {viewMode !== "topics" && (
                    <div className="mb-6">
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-slate-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search questions..."
                                    className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div>
                                <button
                                    className="w-full md:w-auto bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg flex items-center"
                                    onClick={() => setShowFilters(!showFilters)}
                                >
                                    <Filter className="mr-2" size={18} />
                                    Filters
                                    <ChevronDown
                                        className={`ml-2 transform transition-transform ${showFilters ? "rotate-180" : ""
                                            }`}
                                        size={18}
                                    />
                                </button>
                            </div>
                        </div>
                        {showFilters && (
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Topic</label>
                                    <Select
                                        options={topics}
                                        value={filterTopic}
                                        onChange={setFilterTopic}
                                        placeholder="Select Topic"
                                        isClearable
                                        styles={customSelectStyles}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Difficulty</label>
                                    <Select
                                        options={difficulties}
                                        value={filterDifficulty}
                                        onChange={setFilterDifficulty}
                                        placeholder="Select Difficulty"
                                        isClearable
                                        styles={customSelectStyles}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Company</label>
                                    <Select
                                        options={companies}
                                        value={filterCompany}
                                        onChange={setFilterCompany}
                                        placeholder="Select Company"
                                        isClearable
                                        styles={customSelectStyles}
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Status</label>
                                    <Select
                                        options={statusOptions}
                                        value={filterStatus}
                                        onChange={setFilterStatus}
                                        placeholder="Select Status"
                                        isClearable
                                        styles={customSelectStyles}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Content by View Mode */}
                {viewMode === "topics" ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic) => {
                                // Get topic data
                                const topicQuestions = questions.filter(q => q.topic === topic.value);
                                const solvedInTopic = topicQuestions.filter(q => status[q._id] === "solved").length;
                                const progressInTopic = topicQuestions.length > 0
                                    ? Math.round((solvedInTopic / topicQuestions.length) * 100)
                                    : 0;

                                return (
                                    <div
                                        key={topic.value}
                                        className="bg-slate-900 rounded-lg p-4 border border-slate-800 hover:border-slate-700 transition-all duration-200"
                                    >
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-lg font-semibold text-white">{topic.label}</h3>
                                            <span className="text-slate-400 text-sm">
                                                {solvedInTopic}/{topicQuestions.length}
                                            </span>
                                        </div>
                                        <div className="w-full bg-slate-800 rounded-full h-2 mb-3">
                                            <div
                                                className="bg-blue-600 rounded-full h-2"
                                                style={{ width: `${progressInTopic}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-500 text-sm">
                                                {progressInTopic}% complete
                                            </span>
                                            <button
                                                onClick={() => {
                                                    setFilterTopic(topic);
                                                    setViewMode('all');
                                                }}
                                                className="text-blue-500 hover:text-blue-400 text-sm flex items-center"
                                            >
                                                View Questions <ChevronRight size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Question List */}
                        <div className="bg-slate-900 rounded-lg border border-slate-800">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                        <tr className="bg-slate-800/50 border-b border-slate-700">
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Status</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Question</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Difficulty</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Topic</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Company</th>
                                            <th className="py-3 px-4 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {filteredQuestions.length > 0 ? (
                                            filteredQuestions.map((question) => (
                                                <tr key={question._id} className="hover:bg-slate-800/30">
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <select
                                                                value={status[question._id] || "unsolved"}
                                                                onChange={(e) => handleStatusChange(
                                                                    question._id,
                                                                    e.target.value,
                                                                    question.topic
                                                                )}
                                                                className="bg-slate-800 text-white text-sm px-2 py-1 rounded border border-slate-700"
                                                            >
                                                                <option value="unsolved">Not Started</option>
                                                                <option value="in-progress">In Progress</option>
                                                                <option value="solved">Solved</option>
                                                            </select>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex items-center">
                                                            <button
                                                                onClick={() => toggleFavorite(question._id)}
                                                                className="mr-2 text-slate-500 hover:text-yellow-500"
                                                            >
                                                                {favorites[question._id] ? (
                                                                    <Star className="fill-yellow-500 text-yellow-500" size={16} />
                                                                ) : (
                                                                    <Star size={16} />
                                                                )}
                                                            </button>
                                                            <span className="text-white">{question.question}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className={`text-xs px-2 py-1 rounded ${getDifficultyBadgeStyle(question.difficulty)}`}>
                                                            {question.difficulty}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <span className="bg-slate-800 text-blue-400 text-xs px-2 py-1 rounded">
                                                            {question.topic}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        {question.company ? (
                                                            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded">
                                                                {question.company}
                                                            </span>
                                                        ) : (
                                                            <span className="text-slate-500">-</span>
                                                        )}
                                                    </td>
                                                    <td className="py-3 px-4">
                                                        <div className="flex space-x-2">
                                                            {question.link && (
                                                                <a
                                                                    href={question.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="bg-blue-700 hover:bg-blue-600 text-white text-xs px-2 py-1 rounded flex items-center"
                                                                >
                                                                    <ExternalLink size={12} className="mr-1" />
                                                                    Solve
                                                                </a>
                                                            )}
                                                            {question.ytLink && (
                                                                <button
                                                                    onClick={() => handleYouTubeClick(question.ytLink)}
                                                                    className="bg-red-700 hover:bg-red-600 text-white text-xs px-2 py-1 rounded flex items-center"
                                                                >
                                                                    <Youtube size={12} className="mr-1" />
                                                                    Solution
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => openNoteDialog(question._id)}
                                                                className={`${notes[question._id]
                                                                    ? "bg-emerald-700 hover:bg-emerald-600"
                                                                    : "bg-slate-700 hover:bg-slate-600"
                                                                    } text-white text-xs px-2 py-1 rounded flex items-center`}
                                                            >
                                                                <Edit size={12} className="mr-1" />
                                                                {notes[question._id] ? "Notes" : "Add"}
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="py-4 px-4 text-center text-slate-400">
                                                    <div className="flex flex-col items-center">
                                                        <SearchX className="mb-2 text-slate-500" size={24} />
                                                        No questions match your filters.
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Note Dialog */}
                {showNoteDialog && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-2xl border border-slate-800">
                            <div className="flex justify-between items-center p-4 border-b border-slate-800">
                                <h3 className="text-xl font-semibold text-white">
                                    {getSelectedQuestion().question || "Add Notes"}
                                </h3>
                                <button
                                    onClick={closeNoteDialog}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSaveNote}>
                                <div className="p-4">
                                    <textarea
                                        id="noteInput"
                                        name="noteInput"
                                        placeholder="Add your notes, insights, or solution approach here..."
                                        rows="10"
                                        className="w-full bg-slate-800 text-white border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        defaultValue={notes[selectedQuestionId] || ""}
                                    ></textarea>
                                    <div className="text-xs text-slate-500 mt-1">
                                        Markdown is supported. You can use # for headers, * for lists, etc.
                                    </div>
                                </div>
                                <div className="flex justify-end p-4 border-t border-slate-800 gap-2">
                                    <button
                                        type="button"
                                        onClick={closeNoteDialog}
                                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center"
                                    >
                                        <CheckCircle className="mr-2" size={16} />
                                        Save Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Daily Goal Dialog */}
                {showGoalDialog && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-md border border-slate-800">
                            <div className="flex justify-between items-center p-4 border-b border-slate-800">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <Target className="mr-2 text-blue-500" size={20} />
                                    Set Daily Goal
                                </h3>
                                <button
                                    onClick={() => setShowGoalDialog(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-slate-400 mb-4">
                                    Set a daily goal for how many problems you want to solve each day.
                                </p>
                                <div className="flex items-center mb-4">
                                    <span className="text-slate-300 mr-4">Goal:</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max="20"
                                        className="w-16 bg-slate-800 text-white border border-slate-700 rounded-lg p-2 text-center focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                                        value={tempGoal}
                                        onChange={(e) => setTempGoal(parseInt(e.target.value))}
                                    />
                                    <span className="text-slate-300 ml-2">problems/day</span>
                                </div>
                                {tempGoal > 10 && (
                                    <div className="flex items-center text-amber-500 mb-4">
                                        <AlertTriangle size={16} className="mr-2" />
                                        <span className="text-sm">
                                            High goals are great, but ensure they're sustainable!
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end p-4 border-t border-slate-800 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowGoalDialog(false)}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={saveGoal}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center"
                                >
                                    <CheckCircle className="mr-2" size={16} />
                                    Set Goal
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Dialog */}
                {showStatsDialog && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-3xl border border-slate-800 custom-scrollbar max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center p-4 border-b border-slate-800">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <BarChart3 className="mr-2 text-blue-500" size={20} />
                                    Your Progress Stats
                                </h3>
                                <button
                                    onClick={() => setShowStatsDialog(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4">
                                {/* Overall Stats */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-white mb-3">Overall Progress</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="bg-slate-800 p-4 rounded-lg">
                                            <div className="text-slate-400 text-sm">Total Solved</div>
                                            <div className="text-2xl font-bold text-white">{solvedCount}</div>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-lg">
                                            <div className="text-slate-400 text-sm">Study Time</div>
                                            <div className="text-2xl font-bold text-white">{getTotalStudyTime()}</div>
                                        </div>
                                        <div className="bg-slate-800 p-4 rounded-lg">
                                            <div className="text-slate-400 text-sm">Daily Streak</div>
                                            <div className="text-2xl font-bold text-white">{dailyStreak} days</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Difficulty Breakdown */}
                                <div className="mb-6">
                                    <h4 className="text-lg font-semibold text-white mb-3">Difficulty Breakdown</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                        {Object.keys(difficultyStats).map((difficulty) => (
                                            <div key={difficulty} className="bg-slate-800 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-slate-400 capitalize">{difficulty}</span>
                                                    <span className="text-white">
                                                        {difficultyStats[difficulty].solved}/{difficultyStats[difficulty].total}
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getDifficultyColor(difficulty)}`}
                                                        style={{ width: `${difficultyStats[difficulty].percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Top Topics */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-3">Top Topics</h4>
                                    <div className="space-y-3">
                                        {topTopics.map((topic) => (
                                            <div key={topic.name} className="bg-slate-800 p-4 rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-slate-400 capitalize">{topic.name}</span>
                                                    <span className="text-white">
                                                        {topic.solved}/{topic.total} ({topic.percentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-slate-700 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{ width: `${topic.percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end p-4 border-t border-slate-800">
                                <button
                                    onClick={() => setShowStatsDialog(false)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tutorial Dialog */}
                {showTutorial && (
                    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 rounded-lg shadow-lg w-full max-w-2xl border border-slate-800">
                            <div className="flex justify-between items-center p-4 border-b border-slate-800">
                                <h3 className="text-xl font-semibold text-white flex items-center">
                                    <BookOpen className="mr-2 text-blue-500" size={20} />
                                    Welcome to DSA Practice
                                </h3>
                                <button
                                    onClick={() => setShowTutorial(false)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="p-4">
                                <p className="text-slate-300 mb-4">
                                    Here's how to get started with your DSA practice:
                                </p>
                                <ul className="list-disc list-inside text-slate-300 space-y-2 mb-4">
                                    <li>Use the search and filters to find questions by topic, difficulty, or company.</li>
                                    <li>Mark questions as "In Progress" or "Solved" to track your progress.</li>
                                    <li>Add notes to save your insights or solution approaches.</li>
                                    <li>Set a daily goal to stay consistent with your practice.</li>
                                    <li>Use the study timer to track your learning time.</li>
                                    <li>Check your stats to monitor your progress and identify areas for improvement.</li>
                                </ul>
                                <div className="flex justify-end gap-2">
                                    <button
                                        onClick={() => setShowTutorial(false)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded flex items-center"
                                    >
                                        Get Started
                                        <ArrowRight className="ml-2" size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DSAPractice;