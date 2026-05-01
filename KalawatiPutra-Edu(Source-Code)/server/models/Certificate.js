const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true,
  },
  issueDate: {
    type: Date,
    default: Date.now,
  },
  type: {
    type: String,
    enum: ['DSA', 'Welcome', 'Workshop'],
    required: true,
  },
  workshopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workshop',
    required: function() {
      return this.type === 'Workshop';
    },
  },
});

module.exports = mongoose.model('Certificate', certificateSchema);