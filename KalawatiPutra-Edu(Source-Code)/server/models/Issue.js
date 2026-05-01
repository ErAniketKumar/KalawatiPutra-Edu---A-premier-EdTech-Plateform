const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  issueType: {
    type: String,
    enum: ['major', 'minor', 'feature'],
    required: true,
  },
  fullName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 10,
  },
  status: {
    type: String,
    enum: ['to-do', 'in-progress', 'resolved'],
    default: 'to-do',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Issue', issueSchema);