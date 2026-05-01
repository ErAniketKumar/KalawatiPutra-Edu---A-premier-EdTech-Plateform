const express = require('express');
const router = express.Router();
const { createContact, getAllContacts, deleteContact } = require('../controllers/contactController');

// Public route for submitting contact form
router.post('/contact', createContact);

// Admin-only routes (assuming middleware for admin authentication)
router.get('/contacts', getAllContacts);
router.delete('/contacts/:id', deleteContact);

module.exports = router;