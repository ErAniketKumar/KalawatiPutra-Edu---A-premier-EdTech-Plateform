const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const { createCollege, getColleges, updateCollege, deleteCollege } = require('../../controllers/admin/collegeController');

router.post('/', adminAuth, createCollege);
router.get('/', getColleges);
router.put('/:id', adminAuth, updateCollege);
router.delete('/:id', adminAuth, deleteCollege);

module.exports = router;