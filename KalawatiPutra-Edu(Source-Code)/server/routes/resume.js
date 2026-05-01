const express = require('express');
const router = express.Router();
const { uploadResume, screenResume, generateQuestions } = require('../controllers/resume');
const resumeUpload = require('../middleware/resumeUpload');
const auth = require('../middleware/auth');

try {
  router.post('/upload', auth, resumeUpload.single('resume'), uploadResume);
  router.post('/screen', auth, screenResume);
  router.post('/questions', auth, generateQuestions);
} catch (err) {
  console.error('Error registering Resume routes:', err.message);
}

module.exports = router;