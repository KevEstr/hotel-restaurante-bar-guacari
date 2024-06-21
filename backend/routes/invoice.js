const express = require('express');
const router = express.Router();
const { getInvoiceById } = require('../controllers/invoice');
const { protect, admin } = require('../middleware/authMiddleware');

router.route("/:id").get(protect, getInvoiceById);


module.exports = router;