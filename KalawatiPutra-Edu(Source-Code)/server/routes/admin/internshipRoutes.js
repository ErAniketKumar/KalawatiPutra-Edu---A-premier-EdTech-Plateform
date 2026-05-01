const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const { createInternship, getInternships, updateInternship, deleteInternship } = require('../../controllers/admin/internshipController');

try {
  router.post('/', adminAuth, createInternship);
  router.get('/', getInternships);
  router.put('/:id', adminAuth, updateInternship);
  router.delete('/:id', adminAuth, deleteInternship);
  
} catch (err) {
  console.error('Error registering Internship routes:', err.message);
}

module.exports = router;