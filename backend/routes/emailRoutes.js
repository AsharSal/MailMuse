const express = require('express');
const router = express.Router();
const { composeEmail, getAllPrompts } = require('../controllers/emailController');

router.post('/compose', composeEmail);
router.get('/prompts', getAllPrompts);

module.exports = router;
