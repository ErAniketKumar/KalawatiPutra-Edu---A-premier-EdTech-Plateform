const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    about: { type: String },
    courses: [{ type: String }],
    contact: { type: String },
    website: { type: String },
    feeStructure: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('College', collegeSchema);