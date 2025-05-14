const express = require('express');
const router = express.Router();
const { composeEmail, getAllPrompts } = require('../controllers/emailController');
const auth = require('../middleware/auth');

// Protect all routes with auth middleware
router.use(auth);

router.post('/compose', composeEmail);
router.get('/prompts', getAllPrompts);

module.exports = router;
