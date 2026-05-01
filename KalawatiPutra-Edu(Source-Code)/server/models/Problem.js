const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,  // Markdown supported
        required: true
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard'],
        required: true
    },
    problemType: {
        type: String,
        enum: ['DSA', 'SQL'],
        default: 'DSA'
    },
    tags: [String],
    constraints: [String],
    inputFormat: {
        type: String,
        required: true
    },
    outputFormat: {
        type: String,
        required: true
    },
    // For SQL problems - schema definition
    sqlSchema: {
        type: String, // CREATE TABLE statements
        default: ''
    },
    sqlSeedData: {
        type: String, // INSERT statements for test data
        default: ''
    },
    sampleCases: [{
        input: String,
        output: String,
        explanation: String
    }],
    testCases: [{
        input: String,
        output: String,
        isHidden: {
            type: Boolean,
            default: true
        },
        weight: {
            type: Number,
            default: 1
        }
    }],
    defaultCode: [{
        language: String, // e.g., "javascript", "python", "cpp", "java", "c", "sql"
        code: String,
        driverCode: String
    }],
    timeLimit: {
        type: Number,
        default: 2.0
    },
    memoryLimit: {
        type: Number,
        default: 256000
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    solvedCount: {
        type: Number,
        default: 0
    },
    attemptCount: {
        type: Number,
        default: 0
    },
    acceptanceRate: {
        type: Number,
        default: 0
    },
    hints: [String],
    editorial: {
        type: String,
        default: ''
    },
    companies: [String],
    relatedProblems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }]
}, { timestamps: true });

// Update acceptance rate on save
problemSchema.pre('save', function(next) {
    if (this.attemptCount > 0) {
        this.acceptanceRate = Math.round((this.solvedCount / this.attemptCount) * 100);
    }
    next();
});

module.exports = mongoose.model('Problem', problemSchema);
