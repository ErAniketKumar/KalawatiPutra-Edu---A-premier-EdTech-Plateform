const mongoose = require('mongoose');

const dsapracticeSchema = new mongoose.Schema({
    company: { type: String, required: true },
    question: { type: String, required: true },
    link: { type: String }, // GFG or LeetCode URL
    ytLink: {type: String}, // Youtube URL
    topic: { 
        type: String, 
        enum: [
            'array', 'string', 'linkedlist', 'stack', 'queue', 'tree', 
            'dp', 'recursion', 'binarysearch', 'sorting', 'graph', 
            'hashing', 'heap', 'trie', 'greedy', 'backtracking','twopointers','slidingwindow','bitmanipulation', 'segmenttree', 'matrix', 'maths', 'game theory', 'divideandconquer',
        ], 
        required: true 
    },
    difficulty: {
        type: String,
        enum: ['basic', 'easy', 'medium', 'hard'],
        required: true
    },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Dsapractice', dsapracticeSchema);