const asyncHandler = require("express-async-handler");
const Room = require("../models").Room;
const Reservation = require("../models").Reservation;
const RoomReservation = require("../models").RoomReservation;

const { Op, Sequelize  } = require("sequelize");

//@desc     Create a ingredient
//@route    POST /api/ingredients
//@access   Private/ingredient

exports.createRoom = asyncHandler(async (req, res) => {
    const { name, active_status} = req.body;
        const createdRoom = await Room.create({ name, active_status });
        res.status(201).json(createdRoom);
});

//@desc     Get all ingredients
//@route    GET /api/ingredients
//@access   Private/user
exports.getRooms = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {};

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }
    const count = await Room.count({ ...options });
    const rooms = await Room.findAll({
        ...options,
        include: [{
            model: Reservation,
            as: "reservations",
            through: {
                model: RoomReservation,
                attributes: [],
            }
        }]
    });

    res.json({ rooms, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get ingredient by ID
//@route    GET /api/ingredients/:id
//@access   Private/user

exports.getRoom = asyncHandler(async (req, res) => {
    const room = await Room.findByPk(req.params.id);
    
    if (room) {
        res.json(room);
    } else {
        res.status(404);
        throw new Error("Room not found");
    }
});

//@desc     Update a ingredient
//@route    PUT /api/ingredients/:id
//@access   Private/user

exports.updateRoom = asyncHandler(async (req, res) => {
    const { name, active_status} = req.body;

    const room = await Room.findByPk(req.params.id);

    if (room) {
        if (name) {
            room.name = name;
        }
        room.active_status = active_status;
        const updatedRoom = await room.save();
        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error("Room not found");
    }
});


//@desc     Delete a ingredient
//@route    DELETE /api/ingredients/:id
//@access   Private/user
exports.deleteRoom = asyncHandler(async (req, res) => {
    const room = await Room.findByPk(req.params.id);

    if (room) {
        await room.destroy();
        res.json({ message: "Room removed" });
    } else {
        res.status(404);
        throw new Error("Room not found");
    }
});

exports.updateRoomStatus = asyncHandler(async (req, res) => {
    const {active_status} = req.body;

    const room = await Room.findByPk(req.params.id);

    if (room) {
        room.active_status = active_status;
        const updatedRoom = await room.save();
        res.json(updatedRoom);
    } else {
        res.status(404);
        throw new Error("Room not found");
    }
});

exports.getAllRooms = asyncHandler(async (req, res) => {
    const rooms = await Room.findAll({
        include: [
            {
                model: Reservation,
                as: "reservations",
                through: {
                    attributes: []
                },
                where: {
                    id: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT MAX(Reservations.id) 
                            FROM Reservations
                            INNER JOIN RoomReservations ON Reservations.id = RoomReservations.reservationId
                            WHERE RoomReservations.roomId = Room.id
                        )`)
                    }
                },
                required: false // Para incluir habitaciones sin reservas
            }
        ],
    });
    res.json(rooms);
});