const express = require('express');
const router = express.Router();
const { generateCertificate, verifyCertificate,verifyWorkshopCode } = require('../controllers/certificateController');
const auth = require('../middleware/auth');

// router.get('/generate', auth, generateCertificate);
// router.post('/verify', verifyCertificate);

// module.exports = router;


// Routes
router.get('/generate', auth, generateCertificate);
router.post('/verify', verifyCertificate);
router.post('/verify-code', auth, verifyWorkshopCode);
module.exports = router;