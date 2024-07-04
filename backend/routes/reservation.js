const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { Reservation } = require('../models');
const {
    createReservation,
    getReservations,
    getReservation,
    updateReservation,
    deleteReservation,
    updateReservationToPaid,
    getClientReservations,
    getRoomsByReservation,
    getStatistics,
} = require("../controllers/reservation");

// VALIDATORS
const { runValidation } = require("../validators");
const { reservationCreateValidator } = require("../validators/reservation");

//ROUTES

router.route("/statistics").get(getStatistics);

router
    .route("/")
    .post(protect, reservationCreateValidator, runValidation, createReservation)
    .get(protect, getReservations);

router
    .route("/:id")
    .get(protect, getReservation)
    .put(protect, updateReservation)

router.post("/:id/pay", protect, updateReservationToPaid);

router.route('/client/:id').get(protect, getClientReservations);

router.get("/:reservationId/rooms", protect, getRoomsByReservation);

router.delete("/:reservationId", protect, deleteReservation);

module.exports = router;
