const express = require('express');
const router = express.Router();
const { submitAdmissionApplication, getAllAdmissionApplications } = require('../controllers/admissionController');

router.post('/applications', submitAdmissionApplication);
router.get('/applications', getAllAdmissionApplications);

module.exports = router;