const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
    subject: { type: String, required: true },
    content: { type: String }, // Text content
    category: { type: String, default: 'programming' },
    difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Expert'], default: 'Beginner' },
    estimatedDuration: { type: String, default: '40h' },
    isCertificateAvailable: { type: Boolean, default: true },
    files: [{ type: String }], // Array of file paths (PDF, images)
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);