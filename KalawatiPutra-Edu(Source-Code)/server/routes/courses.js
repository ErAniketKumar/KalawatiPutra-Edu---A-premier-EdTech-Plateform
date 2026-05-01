const express = require('express');
const router = express.Router();
const courses = require('../controllers/courses');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', courses.getCourses); // Enhanced with filtering, pagination, search
router.get('/slug/:slug', courses.getCourseBySlug); // Get course by slug
router.get('/stats', auth, courses.getCourseStats); // Admin only course statistics

// Course CRUD routes
router.post('/', auth, upload.any(), courses.createCourse); // Enhanced with file handling
router.get('/user', auth, courses.getUserCourses); // Get user's courses
router.get('/:id', courses.getCourseById); // Get course by ID
router.put('/:id', auth, upload.any(), courses.updateCourse); // Enhanced with file handling
router.delete('/:id', auth, courses.deleteCourse); // Delete course
router.patch('/:id/status', auth, courses.updateCourseStatus); // Admin only status update

// Enrollment routes
router.post('/:id/enroll', auth, courses.enrollCourse); // Enroll in course
router.get('/:id/content', auth, courses.getCourseContent); // Get course content for enrolled users
router.post('/:id/complete', auth, courses.markTopicComplete); // Mark topic as complete

module.exports = router;