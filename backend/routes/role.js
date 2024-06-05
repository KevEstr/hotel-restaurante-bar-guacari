const express = require('express');
const router = express.Router();
const { getRoles, getAllRoles } = require('../controllers/role');
const { protect, admin } = require('../middleware/authMiddleware');

router.route("/").get(protect, getRoles);


module.exports = router;