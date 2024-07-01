const express = require('express');
const router = express.Router();
const { createOrder, getInvoiceById } = require('../controllers/paidorder');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post( createOrder );
router.route("/:id").get(protect, getInvoiceById);

module.exports = router;
