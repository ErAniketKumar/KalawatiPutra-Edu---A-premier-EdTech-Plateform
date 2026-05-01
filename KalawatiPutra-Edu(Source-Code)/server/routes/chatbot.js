const express = require('express');
const { submitLead } = require('../controllers/chatbot');

const router = express.Router();

router.post('/lead', submitLead);



module.exports = router;