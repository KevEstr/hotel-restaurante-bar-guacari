const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createClient,
    getClients,
    getClient,
    updateClient,
    deleteClient,
    updateClientReservationStatus
} = require("../controllers/client");

// VALIDATORS
const { runValidation } = require("../validators");
const { clientCreateValidator } = require("../validators/client");

//ROUTES
router
    .route("/")
    .post(protect, clientCreateValidator, runValidation, createClient)
    .get(protect, getClients);

router
    .route("/:id")
    .get(protect, getClient)
    .put(protect, updateClient)
    .delete(protect, deleteClient);

router.put('/:id/updateReservationStatus', updateClientReservationStatus);


module.exports = router;
