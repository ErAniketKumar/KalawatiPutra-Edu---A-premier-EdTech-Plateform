const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const { createDsapractice, getDsapractice, updateDsapractice, deleteDsapractice } = require('../../controllers/admin/dsapracticeController');

router.post('/', adminAuth, createDsapractice);
router.get('/', getDsapractice);
router.put('/:id', adminAuth, updateDsapractice);
router.delete('/:id', adminAuth, deleteDsapractice);

module.exports = router;