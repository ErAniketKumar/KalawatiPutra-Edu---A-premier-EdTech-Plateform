const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    filename: { type: String, required: true },
    path: { type: String, required: true },
    suggestions: { type: String, default: '' },
    questions: {
        technical: [{ question: String, answer: String }],
        aptitude: [{ question: String, answer: String }],
        softSkills: [{ question: String, answer: String }],
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Resume', resumeSchema);