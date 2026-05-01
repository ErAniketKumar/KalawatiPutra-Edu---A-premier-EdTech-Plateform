const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const auth = require('../middleware/auth');
const admin = require('../middleware/adminAuth');

// Public Routes
router.get('/', problemController.getProblems);
router.get('/stats', problemController.getProblemStats);

// Protected Routes - User
router.get('/progress', auth, problemController.getUserProgress);
router.get('/submissions/all', auth, problemController.getAllUserSubmissions);
router.get('/submissions/:problemId', auth, problemController.getUserSubmissions);
router.get('/:slug', auth, problemController.getProblemBySlug);

// Code Execution
router.post('/run', auth, problemController.runCode);
router.post('/run-samples', auth, problemController.runWithSamples);
router.post('/submit', auth, problemController.submitCode);

// Admin Routes
router.post('/', auth, admin, problemController.createProblem);
router.put('/:id', auth, admin, problemController.updateProblem);
router.delete('/:id', auth, admin, problemController.deleteProblem);

module.exports = router;
