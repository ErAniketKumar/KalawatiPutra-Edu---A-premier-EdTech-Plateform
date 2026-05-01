import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    CheckCircle,
    Circle,
    Clock,
    Trophy,
    Target
} from 'lucide-react';

const RoadmapProgress = ({ roadmap, onClose }) => {
    // Use actual steps from roadmap if available, otherwise fallback to helpful placeholders
    const generateSteps = (roadmap) => {
        if (roadmap.files && roadmap.files.length > 0) {
            return roadmap.files.map((file, index) => {
                const fileName = file.split('/').pop().split('-').slice(1).join(' ').split('.')[0] || `Module ${index + 1}`;
                return {
                    id: index,
                    title: fileName.charAt(0).toUpperCase() + fileName.slice(1),
                    description: `Professional resource for ${roadmap.subject}`,
                    difficulty: index === 0 ? 'Beginner' : index < roadmap.files.length / 2 ? 'Intermediate' : 'Advanced',
                    estimatedTime: 'Approx. 2-3 hours',
                    resource: file
                };
            });
        }
        return [
            { id: 0, title: 'Foundations', description: `Core concepts of ${roadmap.subject}`, difficulty: 'Beginner', estimatedTime: '5 hours' },
            { id: 1, title: 'Deep Dive', description: 'Advanced implementation details', difficulty: 'Advanced', estimatedTime: '10 hours' },
        ];
    };

    const steps = generateSteps(roadmap);

    // Sync with actual user progress if it exists
    const [completedSteps, setCompletedSteps] = useState(() => {
        const saved = localStorage.getItem('roadmapProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            if (progress[roadmap._id] && progress[roadmap._id].completedSteps) {
                return new Set(progress[roadmap._id].completedSteps);
            }
        }
        return new Set();
    });

    const progress = (completedSteps.size / steps.length) * 100;

    const toggleStep = (stepId) => {
        const newCompleted = new Set(completedSteps);
        if (newCompleted.has(stepId)) {
            newCompleted.delete(stepId);
        } else {
            newCompleted.add(stepId);
        }
        setCompletedSteps(newCompleted);

        // Also sync back to localStorage to keep it consistent with Roadmap.jsx
        const saved = localStorage.getItem('roadmapProgress');
        if (saved) {
            const progress = JSON.parse(saved);
            const roadmapProgress = progress[roadmap._id] || {
                id: roadmap._id,
                title: roadmap.subject,
                startedAt: new Date().toISOString(),
                totalSteps: steps.length
            };
            roadmapProgress.completedSteps = Array.from(newCompleted);
            roadmapProgress.progress = (newCompleted.size / steps.length) * 100;

            const updatedAllProgress = { ...progress, [roadmap._id]: roadmapProgress };
            localStorage.setItem('roadmapProgress', JSON.stringify(updatedAllProgress));
        }
    };

    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Beginner': return 'text-emerald-400 bg-emerald-500/10';
            case 'Intermediate': return 'text-yellow-400 bg-yellow-500/10';
            case 'Advanced': return 'text-orange-400 bg-orange-500/10';
            case 'Expert': return 'text-red-400 bg-red-500/10';
            default: return 'text-gray-400 bg-gray-500/10';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-[9999] flex items-center justify-center p-2 sm:p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: 20 }}
                className="bg-gray-900/98 backdrop-blur-xl border border-gray-700/50 rounded-xl sm:rounded-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-auto relative mx-2 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-gray-900/98 backdrop-blur-xl p-3 sm:p-4 lg:p-6 border-b border-gray-700/50 flex-shrink-0 z-10">
                    <div className="flex items-start sm:items-center justify-between gap-2 sm:gap-4">
                        <div className="min-w-0 flex-1">
                            <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1 sm:mb-2 truncate">{roadmap.subject} Progress</h2>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-400">
                                <div className="flex items-center gap-2">
                                    <Target className="w-4 h-4" />
                                    <span>{Math.round(progress)}% Complete</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{steps.length} Steps</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-400">Overall Progress</span>
                            <span className="text-sm font-medium text-white">{Math.round(progress)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-3">
                            <motion.div
                                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.8, ease: "easeInOut" }}
                            />
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Achievement Badge */}
                    {progress >= 100 && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="mb-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl"
                        >
                            <div className="flex items-center gap-3">
                                <Trophy className="w-8 h-8 text-yellow-400" />
                                <div>
                                    <h3 className="text-lg font-bold text-yellow-400">Congratulations!</h3>
                                    <p className="text-gray-300">You've completed the {roadmap.subject} roadmap!</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Steps */}
                    <div className="space-y-4">
                        {steps.map((step, index) => {
                            const isCompleted = completedSteps.has(step.id);
                            const isNext = !isCompleted && index === 0 || (index > 0 && completedSteps.has(steps[index - 1].id) && !isCompleted);

                            return (
                                <motion.div
                                    key={step.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={`relative p-4 rounded-xl border transition-all duration-300 cursor-pointer ${isCompleted
                                        ? 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20'
                                        : isNext
                                            ? 'bg-blue-500/10 border-blue-500/30 hover:bg-blue-500/20 ring-1 ring-blue-500/20'
                                            : 'bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50'
                                        }`}
                                    onClick={() => toggleStep(step.id)}
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Step Icon */}
                                        <div className="flex-shrink-0 mt-1">
                                            {isCompleted ? (
                                                <CheckCircle className="w-6 h-6 text-green-400" />
                                            ) : (
                                                <Circle className={`w-6 h-6 ${isNext ? 'text-blue-400' : 'text-gray-500'}`} />
                                            )}
                                        </div>

                                        {/* Step Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div>
                                                    <h3 className={`font-semibold mb-1 ${isCompleted ? 'text-green-400' : isNext ? 'text-blue-400' : 'text-white'
                                                        }`}>
                                                        {step.title}
                                                    </h3>
                                                    <p className="text-gray-400 text-sm mb-2">{step.description}</p>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(step.difficulty)}`}>
                                                            {step.difficulty}
                                                        </span>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {step.estimatedTime}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Number */}
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isCompleted
                                            ? 'bg-green-500/20 text-green-400'
                                            : isNext
                                                ? 'bg-blue-500/20 text-blue-400'
                                                : 'bg-gray-700/50 text-gray-500'
                                            }`}>
                                            {index + 1}
                                        </div>
                                    </div>

                                    {/* Progress Line */}
                                    {index < steps.length - 1 && (
                                        <div className="absolute left-8 top-12 w-0.5 h-8 bg-gray-700" />
                                    )}
                                </motion.div>
                            );
                        })}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-4">
                        <button className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300">
                            Continue Learning
                        </button>
                        {progress > 0 && (
                            <button
                                onClick={() => setCompletedSteps(new Set())}
                                className="px-6 py-3 border border-gray-700 text-gray-300 rounded-xl hover:border-gray-600 transition-colors"
                            >
                                Reset Progress
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default RoadmapProgress;
