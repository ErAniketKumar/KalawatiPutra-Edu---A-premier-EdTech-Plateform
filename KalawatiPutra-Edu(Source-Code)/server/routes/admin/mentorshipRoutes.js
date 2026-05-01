const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const upload = require('../../middleware/upload');
const { createMentorship, getMentorships, updateMentorship, deleteMentorship } = require('../../controllers/admin/mentorshipController');

try {
  router.post('/', adminAuth, upload.single('photo'), createMentorship);
  router.get('/', getMentorships);
  router.put('/:id', adminAuth, upload.single('photo'), updateMentorship);
  router.delete('/:id', adminAuth, deleteMentorship);


} catch (err) {
  console.error('Error registering Mentorship routes:', err.message);
}

module.exports = router;