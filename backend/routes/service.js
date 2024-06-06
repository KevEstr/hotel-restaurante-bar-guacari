const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    getServices,
    getAllServices,
    createService,
    getService,
    updateService,
    deleteService,
} = require("../controllers/service");

// VALIDATORS
const { serviceCreateValidator } = require("../validators/service");
const { runValidation } = require("../validators");

//ROUTES
router
    .route("/")
    .get(protect, getServices)
    .post(protect, serviceCreateValidator, runValidation, createService);

router.route("/all").get(protect, getAllServices);

router
    .route("/:id")
    .get(protect, getService)
    .put(protect, updateService)
    .delete(protect, deleteService);

module.exports = router;
