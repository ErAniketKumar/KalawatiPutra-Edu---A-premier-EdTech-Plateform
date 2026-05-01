const express = require('express');
const router = express.Router();
const { createWorkshop, getWorkshops } = require('../../controllers/admin/workshopController');
const auth = require('../../middleware/auth');
const adminAuth = require('../../middleware/adminAuth');

router.post('/create', auth, adminAuth, createWorkshop);
router.get('/list', auth, adminAuth, getWorkshops);

module.exports = router;