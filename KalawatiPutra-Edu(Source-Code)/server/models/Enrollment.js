// filepath: server/models/Enrollment.js
const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    enrolledAt: { type: Date, default: Date.now },
    completedTopics: [{ type: mongoose.Schema.Types.ObjectId }], // Track completed topics
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);


