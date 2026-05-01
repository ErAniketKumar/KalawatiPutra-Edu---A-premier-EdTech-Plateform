const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  activities: [{
    type: String,
    enum: ['blog_creation', 'dsa_solution', 'code_submission', 'user_login', 'profile_update','google_login'],
  }],
}, { timestamps: true });

// Ensure unique streak entry per user per day
streakSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Streak', streakSchema);