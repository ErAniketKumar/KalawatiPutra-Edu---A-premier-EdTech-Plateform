const express = require('express');
const router = express.Router();
const {
    createMentorshipBooking,
    getMentorshipBookings,
    updateMentorshipBookingStatus,
    deleteMentorshipBooking,
    getBookingStats
} = require('../controllers/mentorshipBookingController');
const adminAuth = require('../middleware/adminAuth');

// Public route - create a new mentorship booking
router.post('/', createMentorshipBooking);

// Admin routes - protected
router.get('/', adminAuth, getMentorshipBookings);
router.get('/stats', adminAuth, getBookingStats);
router.put('/:id/status', adminAuth, updateMentorshipBookingStatus);
router.delete('/:id', adminAuth, deleteMentorshipBooking);

module.exports = router;
