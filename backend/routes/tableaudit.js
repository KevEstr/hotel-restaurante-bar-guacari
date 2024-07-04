// routes/tableAuditRoutes.js
const express = require('express');
const { getTableAuditLogs } = require('../controllers/tableaudit');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');

router.route("/").get(protect, getTableAuditLogs);

module.exports = router;