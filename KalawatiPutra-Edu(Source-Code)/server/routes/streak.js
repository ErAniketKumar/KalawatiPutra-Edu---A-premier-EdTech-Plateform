const express = require('express');
const router = express.Router();
const { getUserStreaks } = require('../controllers/streakController');
const authMiddleware = require('../middleware/auth');

router.get('/streaks', authMiddleware, getUserStreaks);

module.exports = router;