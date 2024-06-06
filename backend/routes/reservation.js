const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const {
    createReservation,
    getReservations,
    getReservation,
    updateReservation,
    deleteReservation,
    updateReservationEnd,
    getClientReservations,
    getRoomsByReservation
} = require("../controllers/reservation");

// VALIDATORS
const { runValidation } = require("../validators");
const { reservationCreateValidator } = require("../validators/reservation");

//ROUTES
router
    .route("/")
    .post(protect, reservationCreateValidator, runValidation, createReservation)
    .get(protect, getReservations);

router
    .route("/:id")
    .get(protect, getReservation)
    .put(protect, updateReservation)

router.post("/:id/pay", protect, updateReservationEnd);

router.route('/client/:id').get(protect, getClientReservations);

router.get("/:reservationId/rooms", protect, getRoomsByReservation);


module.exports = router;
