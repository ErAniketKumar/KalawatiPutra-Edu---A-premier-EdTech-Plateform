const express = require('express');
const router = express.Router();
const {
    createCounselingBooking,
    getCounselingBookings,
    updateCounselingBookingStatus,
    deleteCounselingBooking
} = require('../controllers/counselingBookingController');
const adminAuth = require('../middleware/adminAuth');

// Public route - create a new counseling booking
router.post('/', createCounselingBooking);

// Admin routes - protected
router.get('/', adminAuth, getCounselingBookings);
router.put('/:id/status', adminAuth, updateCounselingBookingStatus);
router.delete('/:id', adminAuth, deleteCounselingBooking);

module.exports = router;
