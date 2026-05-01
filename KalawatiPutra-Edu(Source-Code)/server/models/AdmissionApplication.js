const mongoose = require('mongoose');

const admissionApplicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    dob: { type: Date, required: true },
    fatherName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    courses: [{ type: String }],
    collegeId: { type: mongoose.Schema.Types.ObjectId, ref: 'College', required: true },
    referenceId: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdmissionApplication', admissionApplicationSchema);