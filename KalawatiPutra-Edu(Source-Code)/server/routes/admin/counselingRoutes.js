const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const { createCounseling, getCounselingPosts, updateCounseling, deleteCounseling } = require('../../controllers/admin/counselingController');


try {
  router.post('/', adminAuth, createCounseling);
  router.get('/', getCounselingPosts);
  router.put('/:id', adminAuth, updateCounseling);
  router.delete('/:id', adminAuth, deleteCounseling);

} catch (err) {
  console.error('Error registering Counseling routes:', err.message);
}

module.exports = router;