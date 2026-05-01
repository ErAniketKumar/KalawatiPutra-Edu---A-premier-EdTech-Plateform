const MentorshipBooking = require('../models/MentorshipBooking');
const Mentorship = require('../models/Mentorship');

// Create a new mentorship booking
const createMentorshipBooking = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            mentorId,
            mentorName,
            sessionType,
            preferredDate,
            preferredTime,
            topic,
            experience,
            goals,
            specialRequests
        } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !mentorId || !preferredDate || !preferredTime || !topic || !experience || !goals) {
            return res.status(400).json({
                success: false,
                message: 'Please fill in all required fields'
            });
        }

        // Verify mentor exists
        const mentor = await Mentorship.findById(mentorId);
        if (!mentor) {
            return res.status(404).json({
                success: false,
                message: 'Selected mentor not found'
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
        const newBooking = new MentorshipBooking({
            name,
            email,
            phone,
            mentorId,
            mentorName: mentorName || mentor.name,
            sessionType: sessionType || 'one-on-one',
            preferredDate: selectedDate,
            preferredTime,
            topic,
            experience,
            goals,
            specialRequests: specialRequests || ''
        });

        const savedBooking = await newBooking.save();

        res.status(201).json({
            success: true,
            message: 'Mentorship session booked successfully!',
            data: {
                bookingId: savedBooking._id,
                name: savedBooking.name,
                email: savedBooking.email,
                mentorName: savedBooking.mentorName,
                sessionType: savedBooking.sessionType,
                preferredDate: savedBooking.preferredDate,
                preferredTime: savedBooking.preferredTime,
                topic: savedBooking.topic,
                status: savedBooking.status
            }
        });

    } catch (error) {
        console.error('Error creating mentorship booking:', error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to book mentorship session. Please try again later.'
        });
    }
};

// Get all mentorship bookings (admin only)
const getMentorshipBookings = async (req, res) => {
    try {
        const { status, mentorId, page = 1, limit = 10 } = req.query;

        const filter = {};
        if (status && status !== 'all') {
            filter.status = status;
        }
        if (mentorId) {
            filter.mentorId = mentorId;
        }

        const skip = (page - 1) * limit;

        const bookings = await MentorshipBooking.find(filter)
            .populate('mentorId', 'name email domain')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await MentorshipBooking.countDocuments(filter);

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
        console.error('Error fetching mentorship bookings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch mentorship bookings'
        });
    }
};

// Update booking status (admin only)
const updateMentorshipBookingStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status value'
            });
        }

        const updatedBooking = await MentorshipBooking.findByIdAndUpdate(
            id,
            { status, updatedAt: Date.now() },
            { new: true }
        ).populate('mentorId', 'name email domain');

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
        console.error('Error updating mentorship booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update booking status'
        });
    }
};

// Delete a booking (admin only)
const deleteMentorshipBooking = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedBooking = await MentorshipBooking.findByIdAndDelete(id);

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
        console.error('Error deleting mentorship booking:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete booking'
        });
    }
};

// Get booking statistics (admin only)
const getBookingStats = async (req, res) => {
    try {
        const totalBookings = await MentorshipBooking.countDocuments();
        const pendingBookings = await MentorshipBooking.countDocuments({ status: 'pending' });
        const confirmedBookings = await MentorshipBooking.countDocuments({ status: 'confirmed' });
        const completedBookings = await MentorshipBooking.countDocuments({ status: 'completed' });

        // Get popular mentors
        const popularMentors = await MentorshipBooking.aggregate([
            { $group: { _id: '$mentorId', count: { $sum: 1 }, mentorName: { $first: '$mentorName' } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // Get bookings by session type
        const sessionTypes = await MentorshipBooking.aggregate([
            { $group: { _id: '$sessionType', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalBookings,
                pendingBookings,
                confirmedBookings,
                completedBookings,
                popularMentors,
                sessionTypes
            }
        });

    } catch (error) {
        console.error('Error fetching booking stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch booking statistics'
        });
    }
};

module.exports = {
    createMentorshipBooking,
    getMentorshipBookings,
    updateMentorshipBookingStatus,
    deleteMentorshipBooking,
    getBookingStats
};
