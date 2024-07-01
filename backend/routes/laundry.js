const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createLaundry,
    getLaundries,
    getLaundry,
    updateLaundry,
    deleteLaundry,
} = require("../controllers/laundry");

// VALIDATORS
const { runValidation } = require("../validators");
const { laundryCreateValidator } = require("../validators/laundry");

//ROUTES
router
    .route("/")
    .post(protect, laundryCreateValidator, runValidation, createLaundry)
    .get(protect, getLaundries);

router
    .route("/:id")
    .get(protect, getLaundry)
    .put(protect, updateLaundry)
    .delete(protect, deleteLaundry);


module.exports = router;
