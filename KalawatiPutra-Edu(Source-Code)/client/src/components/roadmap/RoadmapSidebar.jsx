import React from 'react';
import { motion } from 'framer-motion';
import {
    Code,
    Database,
    Smartphone,
    Globe,
    Server,
    Shield,
    Brain,
    Palette,
    Settings,
    Zap
} from 'lucide-react';

const RoadmapSidebar = ({ categories, selectedCategory, onCategorySelect, isOpen, onToggle }) => {
    const categoryIcons = {
        'all': Globe,
        'web development': Code,
        'data science': Database,
        'mobile development': Smartphone,
        'backend': Server,
        'frontend': Palette,
        'devops': Settings,
        'security': Shield,
        'ai/ml': Brain,
        'programming': Zap
    };

    const [isLargeScreen, setIsLargeScreen] = React.useState(false);

    React.useEffect(() => {
        const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
        checkScreen();
        window.addEventListener('resize', checkScreen);
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    const sidebarVariants = {
        open: {
            x: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        },
        closed: {
            x: "-100%",
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30
            }
        }
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={onToggle}
                />
            )}

            {/* Sidebar */}
            <motion.div
                variants={sidebarVariants}
                initial={false}
                animate={isLargeScreen || isOpen ? "open" : "closed"}
                className="fixed left-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700/50 z-50 lg:translate-x-0"
            >
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-white">Categories</h2>
                        <button
                            onClick={onToggle}
                            className="lg:hidden text-gray-400 hover:text-white transition-colors"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2">
                        {categories.map((category) => {
                            const Icon = categoryIcons[category] || Code;
                            const isSelected = selectedCategory === category;

                            return (
                                <motion.button
                                    key={category}
                                    onClick={() => {
                                        onCategorySelect(category);
                                        if (window.innerWidth < 1024) {
                                            onToggle();
                                        }
                                    }}
                                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-200 ${isSelected
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span className="font-medium capitalize">
                                        {category === 'all' ? 'All Roadmaps' : category}
                                    </span>
                                    {isSelected && (
                                        <motion.div
                                            layoutId="activeCategory"
                                            className="ml-auto w-2 h-2 bg-emerald-400 rounded-full"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {/* Stats */}
                    <div className="mt-8 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50">
                        <h3 className="text-sm font-semibold text-gray-400 mb-3">Quick Stats</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Total Paths</span>
                                <span className="text-white font-medium">{categories.length - 1}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Difficulty Levels</span>
                                <span className="text-white font-medium">3</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Updated</span>
                                <span className="text-emerald-400 font-medium">Recently</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default RoadmapSidebar;
