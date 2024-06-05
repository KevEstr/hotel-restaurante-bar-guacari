const asyncHandler = require("express-async-handler");
const Reservation = require("../models").Reservation;
const { Op } = require("sequelize");
const Client = require("../models").Client;
const Room = require("../models").Room;
const RoomReservation = require("../models").RoomReservation;
const { ReservationService } = require("../models");
const Service = require("../models").Service
const Agreement = require("../models").Agreement;
const { AgreementService } = require("../models");
const { User } = require("../models").User;





const {
    updateRoom
} = require("../utils/reservation");

//@desc     Create a Order
//@route    POST /api/orders
//@access   Private/user
exports.createReservation = asyncHandler(async (req, res) => {
    //get data from request
    const {price, start_date, end_date, quantity, clientId, roomId, note, paymentId, is_paid, services} = req.body;
    console.log("Cuerpo de la solicitud:", req.body);


    try {
        const createdReservation = await Reservation.create({
            price,
            start_date,
            end_date,
            quantity,
            roomId: roomId,
            clientId: clientId,
            userId: req.user.id,
            note: note,
            paymentId: paymentId,
            is_paid: is_paid,
                });

        // Create the entry in the RoomReservation table
        await RoomReservation.create({
            roomId,
            reservationId: createdReservation.id,
            active_status: true,
        });

        const room = await Room.findByPk(roomId);
        if (room) {
            room.active_status = true;
            await room.save();
        }

        if (services && services.length > 0) {
            await Promise.all(services.map(async (service) => {
                await ReservationService.create({
                    reservationId: createdReservation.id,
                    serviceId: service.id,
                    maxLimit: service.maxLimit,
                });
            }));
        }

        //update table to occupied
        await updateRoom(createdReservation.roomId, true);

        res.status(201).json(createdReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Error creating reservation", services });
    }
});

//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/user

exports.getReservations = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {
        include: [
            { model: Client, as: "client" },
            { model: Room, as: "room" },
            {
                model: Service,
                as: "services",
                through: {
                    model: ReservationService,
                    attributes: ["maxLimit"],
                },
            },
        ],
        attributes: {
            exclude: ["userId", "clientId", "roomId", "updatedAt"],
        },
        reservation: [["id", "DESC"]],
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    const count = await Reservation.count({ ...options });
    const reservations = await Reservation.findAll({ ...options });

    res.json({ reservations, page, pages: Math.ceil(count / pageSize) });
});

exports.getReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: 'client'
        },
        { model: Service, as: "service", through: ReservationService, include: [
            {
              model: Agreement,
              as: "agreement",
              through: AgreementService,
            },
          ],},
      ]
    });
  
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404);
      throw new Error("reservation not found");
    }
  });

//@desc     Get order by ID
//@route    GET /api/order/:id
//@access   Private/user
/*exports.getReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        {
          model: Client, 
          as: 'client', 
        },
        {
          model: Service, 
          as: 'services', 
          through: {
            model: ReservationService, 
          },
          include: [
            {
              model: Agreement, 
              as: 'agreements', 
            },
          ],
        },
      ],
    });
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404);
      throw new Error("reservation not found");
    }
  });*/

//@desc     Update order to paid
//@route    POST /api/orders/:id/pay
//@access   Private/user

//@desc     Update order
//@route    PUT /api/orders/:id
//@access   Private/user

exports.updateReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });

    if (reservation) {
        const { price, start_date, end_date, quantity, clientId, roomId, note, paymentId, is_paid, services } = req.body;

        if (price !== undefined) reservation.price = price;
        if (start_date !== undefined) reservation.start_date = start_date;
        if (end_date !== undefined) reservation.end_date = end_date;
        if (quantity !== undefined) reservation.quantity = quantity;
        if (clientId !== undefined) reservation.clientId = clientId;
        if (roomId !== undefined) reservation.roomId = roomId;
        if (note !== undefined) reservation.note = note;
        if (paymentId !== undefined) reservation.paymentId = paymentId;
        if (is_paid !== undefined) reservation.is_paid = is_paid;
        await ReservationService.destroy({ where: { reservationId: reservation.id } });

        if (services && services.length > 0) {
            await Promise.all(services.map(async (service) => {
                await ReservaServicio.create({
                    reservationId: reserva.id,
                    serviceId: service.id,
                    maxLimit: service.maxLimit,
                });
            }));
        }

        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } else {
        res.status(404);
        throw new Error("Reservation not found");
    }
});




//@desc     Update order to delivered
//@route    POST /api/orders/:id/delivery
//@access   Private/user

//@desc     Delete a order
//@route    DELETE /api/orders/:id
//@access   Private/user

exports.deleteReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
        await reservation.destroy();
        res.json({ message: "Reservation removed" });
    } else {
        res.status(404);
        throw new Error("Reservation not found");
    }
});

//@desc     Get statistics
//@route    POST /api/orders/statistics
//@access   Private/user
exports.getStatisticsReservation = asyncHandler(async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const sales = await Reservation.findAll({
        where: {
            active_status: true,
        },
        limit: 5,
        include: { all: true, nested: true },
    });

    const reservations = await Reservation.findAll({
        where: {
            [Op.or]: [{ active_status: false }],
        },
        include: { all: true, nested: true },
        attributes: {
            exclude: ["userId", "clientId", "roomId"],
        },
    });

})


exports.updateReservationEnd = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id);

    if (reservation) {
        if (reservation.roomId) {
            const room = await Room.findByPk(reservation.roomId);
            room.active_status = false;
            room.save();
        }

        reservation.is_paid = true;
        const updatedReservation = await reservation.save();
        res.json(updatedReservation);
    } else {
        res.status(404);
        throw new Error("Reservation not found");
    }
});
