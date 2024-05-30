const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createAgreement,
    getAgreement,
    getAgreements,
    updateAgreement,
    deleteAgreement,
} = require("../controllers/agreement");

// VALIDATORS
const { agreementCreateValidator } = require("../validators/agreement");
const { runValidation } = require("../validators");

//ROUTES
router
    .route("/")
    .get(protect, getAgreements)
    .post(protect, agreementCreateValidator, runValidation, createAgreement);

router
    .route("/:id")
    .get(protect, getAgreement)
    .put(protect, updateAgreement)
    .delete(protect, deleteAgreement);

module.exports = router;
