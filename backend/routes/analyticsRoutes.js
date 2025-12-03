const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');
const { getAnalytics } = require('../controllers/analyticsController');

router.get('/', authenticateToken, requireAdmin, getAnalytics);

module.exports = router;

