const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
    createRoom,
    getRooms,
    getRoom,
    updateRoom,
    deleteRoom,
    updateRoomStatus,
    getAllRooms
} = require("../controllers/room");

// VALIDATORS
const { runValidation } = require("../validators");
const { roomCreateValidator } = require("../validators/room");

// ROUTES
router.route('/roomStatus/:id').put(protect, updateRoomStatus);

router
.route("/all")
.get(protect, getAllRooms);

router
    .route("/")
    .post(protect, roomCreateValidator, runValidation, createRoom)
    .get(protect, getRooms);

router
    .route("/:id")
    .get(protect, getRoom)
    .put(protect, updateRoom)
    .delete(protect, deleteRoom);

module.exports = router;
