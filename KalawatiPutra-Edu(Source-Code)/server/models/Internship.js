const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
    company: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    requirements: [{ type: String }],
    stipend: { type: String },
    skills: [{ type: String }],
    deadline: { type: Date },
    applyLink: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Internship', internshipSchema);