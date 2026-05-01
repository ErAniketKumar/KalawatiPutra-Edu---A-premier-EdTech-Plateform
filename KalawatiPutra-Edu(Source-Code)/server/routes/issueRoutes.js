const express = require('express');
const router = express.Router();
const issueController = require('../controllers/issueController');
const auth = require('../middleware/auth'); // Assuming existing auth middleware
const adminAuth = require('../middleware/adminAuth'); // Assuming existing admin auth middleware

// Route to submit an issue
router.post('/submit', issueController.submitIssue);

// Route to get all issues (admin only)
router.get('/', auth, adminAuth, issueController.getAllIssues);

// Route to update issue status (admin only)
router.put('/:id/status', auth, adminAuth, issueController.updateIssueStatus);

// Route to delete an issue (admin only)
router.delete('/:id', auth, adminAuth, issueController.deleteIssue);

module.exports = router;