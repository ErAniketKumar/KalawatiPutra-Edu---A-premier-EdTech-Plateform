const mongoose = require('mongoose');

// Language ID to name mapping for Judge0
const LANGUAGE_MAP = {
    50: 'C',
    54: 'C++',
    62: 'Java',
    63: 'JavaScript',
    71: 'Python',
    82: 'SQL'
};

const submissionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        required: true
    },
    languageId: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Compilation Error', 'Runtime Error', 'Memory Limit Exceeded', 'Internal Error'],
        default: 'Pending'
    },
    executionTime: {
        type: Number,
        default: 0
    },
    memoryUsed: {
        type: Number,
        default: 0
    },
    passedTestCases: {
        type: Number,
        default: 0
    },
    totalTestCases: {
        type: Number,
        default: 0
    },
    errorDetails: {
        type: String
    },
    failedTestCase: {
        input: String,
        expectedOutput: String,
        actualOutput: String
    }
}, { timestamps: true });

// Pre-save hook to set language name from ID
submissionSchema.pre('save', function(next) {
    if (this.languageId && (!this.language || this.language === 'Unknown')) {
        this.language = LANGUAGE_MAP[this.languageId] || 'Unknown';
    }
    next();
});

module.exports = mongoose.model('Submission', submissionSchema);
module.exports.LANGUAGE_MAP = LANGUAGE_MAP;
