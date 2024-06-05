const express = require('express');
const { getServices, createService } = require('../controllers/service');
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.route("/").get(protect,getServices).post(protect, createService)

module.exports = router;
