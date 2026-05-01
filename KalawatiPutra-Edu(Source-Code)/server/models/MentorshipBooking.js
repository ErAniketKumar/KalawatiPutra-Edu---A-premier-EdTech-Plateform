const mongoose = require('mongoose');

const mentorshipBookingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: [2, 'Name must be at least 2 characters long'],
        maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
        lowercase: true
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [/^\+?[\d\s-()]{10,}$/, 'Please enter a valid phone number']
    },
    mentorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentorship',
        required: [true, 'Mentor selection is required']
    },
    mentorName: {
        type: String,
        required: [true, 'Mentor name is required']
    },
    sessionType: {
        type: String,
        required: [true, 'Session type is required'],
        enum: ['one-on-one', 'group', 'workshop', 'career-review'],
        default: 'one-on-one'
    },
    preferredDate: {
        type: Date,
        required: [true, 'Preferred date is required']
    },
    preferredTime: {
        type: String,
        required: [true, 'Preferred time is required'],
        validate: {
            validator: function (v) {
                // Accept both time format (HH:MM) and predefined slots
                return /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(v) ||
                    ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'].includes(v);
            },
            message: 'Please enter a valid time format (HH:MM)'
        }
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        trim: true,
        maxlength: [200, 'Topic cannot exceed 200 characters']
    },
    experience: {
        type: String,
        required: [true, 'Experience level is required'],
        enum: ['beginner', 'intermediate', 'experienced', 'senior', 'student']
    },
    goals: {
        type: String,
        required: [true, 'Goals are required'],
        trim: true,
        maxlength: [1000, 'Goals cannot exceed 1000 characters']
    },
    specialRequests: {
        type: String,
        trim: true,
        maxlength: [500, 'Special requests cannot exceed 500 characters']
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'completed', 'cancelled'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
mentorshipBookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const MentorshipBooking = mongoose.model('MentorshipBooking', mentorshipBookingSchema);

module.exports = MentorshipBooking;
