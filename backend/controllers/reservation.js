const asyncHandler = require("express-async-handler");
const Reservation = require("../models").Reservation;
const { Op } = require("sequelize");
const Client = require("../models").Client;
const Room = require("../models").Room;
const Payment = require("../models").Payment;
const RoomReservation = require("../models").RoomReservation;
const { ReservationService } = require("../models");
const Service = require("../models").Service
const Agreement = require("../models").Agreement;
const { AgreementService, ReservationAudit } = require("../models");
const { User } = require("../models").User;

const {
    updateRoom
} = require("../utils/reservation");

//@desc     Create a Order
//@route    POST /api/orders
//@access   Private/user
exports.createReservation = asyncHandler(async (req, res) => {
    const { price, start_date, end_date, quantity, clientId, note, paymentId, is_paid, rooms, total, services } = req.body;

    const createdReservation = await Reservation.create({
        price,
        start_date,
        end_date,
        quantity,
        clientId,
        userId: req.user.id,
        note,
        paymentId,
        is_paid,
        total,
    });

    const payment = await Payment.findByPk(paymentId);
    if (payment) {
        payment.total_accumulated += total;
        await payment.save();
    }

    // Calculate the number of nights
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const numberOfNights = Math.round(Math.abs((endDate - startDate) / oneDay));

    if (services && services.length > 0) {
        await Promise.all(services.map(async (service) => {
            const maxLimitPerStay = numberOfNights * service.maxLimit;
            await ReservationService.create({
                reservationId: createdReservation.id,
                serviceId: service.id,
                maxLimit: maxLimitPerStay,
                availableQuota: maxLimitPerStay
            });
        }));
    }

    const client = await Client.findByPk(clientId);
    if (client) {
        client.reservationId = createdReservation.id;
        await client.save();
    }

    console.log("CREATED RESERVATION: ",createdReservation);
    console.log("CLIENT: ",client);

    if (rooms && rooms.length > 0) {
        await Promise.all(rooms.map(async (roomId) => {
            await RoomReservation.create({
                reservationId: createdReservation.id,
                roomId,
                active_status: true,
            });

            const room = await Room.findByPk(roomId);
            room.active_status = true;
            await room.save();
        }));
    }

    res.status(201).json(createdReservation);
});

//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/user

exports.getReservations = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;

    console.log("Backend received keyword:", keyword, "and pageNumber:", page);

    let options = {
        include: [
            { model: Client, as: "client" },
            { model: Room, as: "room" },
            {
                model: Service,
                as: "service",
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

    console.log("Reservations found:", reservations);
    console.log("Total reservations count:", count);

    res.json({ reservations, page, pages: Math.ceil(count / pageSize) });
});

exports.getReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
      include: [
        {
          model: Client,
          as: 'client'
        },
        { 
          model: Service, 
          as: 'service', 
          through: ReservationService, 
          include: [
            {
              model: Agreement,
              as: 'agreement',
              through: AgreementService,
            },
          ],
        },
        {
          model: Room,
          as: 'room',
          through: {
            model: RoomReservation,
            where: { reservationId: req.params.id }  // Condición para incluir solo registros relevantes
          }
        }
      ]
    });
  
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404);
      throw new Error("reservation not found");
    }
});


exports.updateReservation = asyncHandler(async (req, res) => {
    const reservation = await Reservation.findByPk(req.params.id, {
        include: { all: true, nested: true },
    });

    if (reservation) {
        const { price, start_date, end_date, quantity, clientId, note, paymentId, is_paid, total, services} = req.body;

        if (price !== undefined) reservation.price = price;
        if (start_date !== undefined) reservation.start_date = start_date;
        if (end_date !== undefined) reservation.end_date = end_date;
        if (quantity !== undefined) reservation.quantity = quantity;
        if (clientId !== undefined) reservation.clientId = clientId;
        if (note !== undefined) reservation.note = note;
        if (paymentId !== undefined) reservation.paymentId = paymentId;
        if (is_paid !== undefined) reservation.is_paid = is_paid;
        if (total !== undefined) reservation.total = total;
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
      // Guardar los datos de la reservación en la tabla de auditoría
      await ReservationAudit.create({
        reservationId: reservation.id,
        concept: req.body.reason,
        deletedAt: new Date(),
        deletedBy: req.user.id,
      });

        if (reservation.rooms && reservation.rooms.length > 0) {
            for (let room of reservation.rooms) {
              room.active_status = false;
              await room.save();
            }
          }
  
      // Eliminar la reservación
      await reservation.destroy();
      res.json({ message: 'Reservation removed' });
    } else {
      res.status(404);
      throw new Error('Reservation not found');
    }
  });

//@desc     Get statistics
//@route    POST /api/orders/statistics
//@access   Private/user
exports.getStatistics = asyncHandler(async (req, res) => {
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();

    const sales = await Reservation.findAll({
        where: {
            is_paid: true,
        },
        limit: 5,
        include: { all: true, nested: true },
    });

    const totalSales = await Reservation.sum("total", {
        where: {
            is_paid: true,
        },
    });

    const totalReservationsPaid = await Reservation.count({
        where: {
            is_paid: true,
        },
    });

    const todaySales = await Reservation.sum("total", {
        where: {
            updatedAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW,
            },
            is_paid: true,
        },
    });

    const reservations = await Reservation.findAll({
        where: {
            [Op.or]: [{ is_paid: false }],
        },
        include: { all: true, nested: true },
        attributes: {
            exclude: ["userId", "clientId", "roomId"],
        },
    });

    res.json({
        statistics: {
            total: totalSales,
            today: todaySales,
            reservations: totalReservationsPaid,
        },
        sales,
        reservations,
    });
});

exports.updateReservationEnd = asyncHandler(async (req, res) => {
    console.log("req.params.id: ", req.params.id);

    try {
        const reservation = await Reservation.findByPk(req.params.id, {
            include: {
                model: Room,
                as: 'room',
                through: {
                  model: RoomReservation,
                  where: { reservationId: req.params.id }  // Condición para incluir solo registros relevantes
                }
              }
        });

        console.log("RESERVATION END: ", reservation);

        if (reservation) {
            await Promise.all(reservation.room.map(async (room) => {
                room.active_status = false;
                await room.save();
            }));

            reservation.is_paid = true;

            const updatedReservation = await reservation.save();
            res.json(updatedReservation);
        } else {
            res.status(404);
            throw new Error('Reservation not found');
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

exports.getClientReservations = asyncHandler(async (req, res) => {
    const clientId = req.params.id;
    const reservations = await Reservation.findAll({ where: { clientId } });
    if (reservations) {
        res.json(reservations);
    } else {
        res.status(404);
        throw new Error('Reservations not found');
    }
});

exports.getRoomsByReservation = asyncHandler(async (req, res) => {
    try {
        const reservationId = req.params.reservationId;
        const rooms = await RoomReservation.findAll({
            where: { reservationId },
            include: [
                {
                    model: Room,
                    as: 'room',
                },
            ],
        });

        res.json(rooms.map(roomReservation => roomReservation.room));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

exports.getAllReservations = asyncHandler(async (req, res) => {
    const keyword = req.query.keyword ? {
        client: {
            $regex: req.query.keyword,
            $options: 'i',
        },
    } : {};

    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Reservation.countDocuments({ ...keyword });
    const reservations = await Reservation.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ reservations, page, pages: Math.ceil(count / pageSize) });
});
