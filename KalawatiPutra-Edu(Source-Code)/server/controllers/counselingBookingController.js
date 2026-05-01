const CounselingBooking = require('../models/CounselingBooking');

// Create a new counseling booking
const createCounselingBooking = async (req, res) => {
    try {
        const { name, email, phone, preferredDate, preferredTime, sessionType, message } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !preferredDate || !preferredTime) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Check if the preferred date is not in the past
        const selectedDate = new Date(preferredDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        if (selectedDate < currentDate) {
            return res.status(400).json({
                success: false,
                message: 'Please select a future date for your session'
            });
        }

        // Create new booking
        const newBooking = new CounselingBooking({
            name,
            email,
            phone,
            preferredDate: selectedDate,
            preferredTime,
            sessionType: sessionType || 'video',
            message: message || ''
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: 'Counseling session booked successfully!',
            data: {
                bookingId: savedBooking._id,
                name: savedBooking.name,
                email: savedBooking.email,
                preferredDate: savedBooking.preferredDate,
                preferredTime: savedBooking.preferredTime,
                sessionType: savedBooking.sessionType,
                status: savedBooking.status
            }
        });

    } catch (error) {
        console.error('Error creating counseling booking:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to book counseling session. Please try again later.'
        });
    }
};

// Get all counseling bookings (admin only)
const getCounselingBookings = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }

        const skip = (page - 1) * limit;

        const bookings = await CounselingBooking.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await CounselingBooking.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: bookings,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / limit),
                totalBookings: total,
                hasNext: page * limit < total,
                hasPrev: page > 1
            }
        });

    } catch (error) {
        console.error('Error fetching counseling bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch counseling bookings'
        });
    }
};

// Update booking status (admin only)
const updateCounselingBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedBooking = await CounselingBooking.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: updatedBooking
        });

    } catch (error) {
        console.error('Error updating counseling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
};

// Delete a booking (admin only)
const deleteCounselingBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await CounselingBooking.findByIdAndDelete(id);

        if (!deletedBooking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Booking deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting counseling booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking'
        });
    }
};

module.exports = {
    createCounselingBooking,
    getCounselingBookings,
    updateCounselingBookingStatus,
    deleteCounselingBooking
};
