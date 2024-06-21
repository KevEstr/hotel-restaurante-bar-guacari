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
    updateReservationEnd,
    getClientReservations,
    getRoomsByReservation,
    getAllReservations,
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

router.post("/:id/pay", protect, updateReservationEnd);

router.route('/client/:id').get(protect, getClientReservations);

router.get("/:reservationId/rooms", protect, getRoomsByReservation);

router.route('/').get(protect, admin, getAllReservations);

router.delete('/:id', protect, async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;

    console.log('Solicitud DELETE recibida en el backend');

    try {
        const reservation = await Reservation.findByPk(id);

        if (!reservation) {
            return res.status(404).json({ message: 'Reservación no encontrada' });
        }

        // Eliminar la reservación
        console.log('Reservación encontrada, procediendo a eliminarla');
        await reservation.destroy({ concept: reason, userId: req.user.id });

        res.json({ message: 'Reservación eliminada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la reservación' });
    }
});


module.exports = router;
