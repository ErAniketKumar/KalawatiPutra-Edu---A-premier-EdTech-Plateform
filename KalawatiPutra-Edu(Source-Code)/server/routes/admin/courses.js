const express = require('express');
const { getCourses } = require('../../controllers/courses');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router.get('/', adminAuth, getCourses);

module.exports = router;