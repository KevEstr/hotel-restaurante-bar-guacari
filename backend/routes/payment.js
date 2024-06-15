const express = require('express');
const router = express.Router();
const { getPayments, getAllPayments } = require('../controllers/payment');
const { protect, admin } = require('../middleware/authMiddleware');

router.route("/").get(protect, getPayments);

module.exports = router;