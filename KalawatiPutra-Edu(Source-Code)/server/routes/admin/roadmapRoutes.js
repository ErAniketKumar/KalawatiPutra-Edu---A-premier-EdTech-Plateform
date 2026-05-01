const express = require('express');
const router = express.Router();
const adminAuth = require('../../middleware/adminAuth');
const upload = require('../../middleware/upload');
const { createRoadmap, getRoadmaps, updateRoadmap, deleteRoadmap } = require('../../controllers/admin/roadmapController');

router.post('/', adminAuth, upload.array('files', 5), createRoadmap);
router.get('/', getRoadmaps);
router.put('/:id', adminAuth, upload.array('files', 5), updateRoadmap);
router.delete('/:id', adminAuth, deleteRoadmap);

module.exports = router;