const express = require('express');
const { getAllArticles, approveArticle, denyArticle } = require('../../controllers/articles');
const adminAuth = require('../../middleware/adminAuth');

const router = express.Router();

router.get('/', adminAuth, getAllArticles);
router.put('/approve/:id', adminAuth, approveArticle);
router.put('/deny/:id', adminAuth, denyArticle);
module.exports = router;