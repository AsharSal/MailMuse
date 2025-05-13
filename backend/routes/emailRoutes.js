const express = require('express');
const router = express.Router();
const { composeEmail } = require('../controllers/emailController');

router.post('/compose', composeEmail);

module.exports = router;
