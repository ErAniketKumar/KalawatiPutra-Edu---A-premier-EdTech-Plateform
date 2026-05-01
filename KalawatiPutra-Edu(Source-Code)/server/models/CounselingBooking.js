const mongoose = require('mongoose');

const counselingBookingSchema = new mongoose.Schema({
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
                    ['09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'].includes(v);
            },
            message: 'Please enter a valid time format (HH:MM)'
        }
    },
    sessionType: {
        type: String,
        required: [true, 'Session type is required'],
        enum: ['video', 'audio', 'phone', 'in-person'],
        default: 'video'
    },
    message: {
        type: String,
        trim: true,
        maxlength: [500, 'Message cannot exceed 500 characters']
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
counselingBookingSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const CounselingBooking = mongoose.model('CounselingBooking', counselingBookingSchema);

module.exports = CounselingBooking;
