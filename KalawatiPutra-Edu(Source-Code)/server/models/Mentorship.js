const mongoose = require('mongoose');

const mentorshipSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    linkedin: { type: String },
    photo: { type: String }, // File path for mentor photo
    experience: { type: String },
    domain: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Mentorship', mentorshipSchema);