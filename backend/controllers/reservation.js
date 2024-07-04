const asyncHandler = require("express-async-handler");
const Reservation = require("../models").Reservation;
const { Op } = require("sequelize");
const Client = require("../models").Client;
const Room = require("../models").Room;
const Payment = require("../models").Payment;
const RoomReservation = require("../models").RoomReservation;
const { ReservationService, TableAudit } = require("../models");
const Service = require("../models").Service
const Agreement = require("../models").Agreement;
const { AgreementService } = require("../models");
const { User } = require("../models").User;

const { ReservationAdvance } = require("../models");


const {
    updateRoom
} = require("../utils/reservation");

//@desc     Create a Order
//@route    POST /api/orders
//@access   Private/user
exports.createReservation = asyncHandler(async (req, res) => {
    try {
        const { price, start_date, end_date, quantity, clientId, note, paymentId, is_paid, rooms, total, services, pending_payment, advance } = req.body;

        console.log("Received reservation data:", req.body);
        console.log("Habitaciones recibidas:", rooms);

        const createdReservation = await Reservation.create({
            price,
            start_date,
            end_date,
            quantity,
            clientId,
            userId: req.user.id,
            note,
            paymentId: paymentId !== '' ? paymentId : null,
            is_paid,
            total,
            pending_payment,
            advance: advance !== '' ? advance : null,
        });

        console.log("Created reservation:", createdReservation);

        if (advance) {
            console.log("advance:", advance);
            await ReservationAdvance.create({
                reservationId: createdReservation.id,
                userId: req.user.id,
                paymentId: paymentId,
                advance: advance,
            });
        }

        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        const oneDay = 24 * 60 * 60 * 1000;
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

        console.log("CREATED RESERVATION:", createdReservation);
        console.log("CLIENT:", client);
        console.log("Habitaciones:", rooms);

        if (rooms && rooms.length > 0) {
            console.log("Processing rooms:", rooms);
            await Promise.all(rooms.map(async (roomId) => {
                if (!roomId) {
                    console.log("Room ID is undefined or null:", roomId);
                    return;
                }
                await RoomReservation.create({
                    reservationId: createdReservation.id,
                    roomId,
                    active_status: 1,
                });

                const room = await Room.findByPk(roomId);
                if (room) {
                    room.active_status = 1;
                    await room.save();
                    console.log("Updated room status for room with ID:", roomId);
                } else {
                    console.log("Room with ID not found:", roomId);
                }
            }));
        }

        res.status(201).json(createdReservation);
    } catch (error) {
        console.error("Error creating reservation:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});


//@desc     Get all orders
//@route    GET /api/orders
//@access   Private/user

exports.getReservations = asyncHandler(async (req, res) => {
    const pageSize = 20;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;
    const startDate = req.query.startDate ? new Date(req.query.startDate) : null;
    const endDate = req.query.endDate ? new Date(req.query.endDate) : null;
    const paymentId = req.query.paymentId ? Number(req.query.paymentId) : null;

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
            { model: ReservationAdvance, as: "advances" },

        ],
        reservation: [["id", "DESC"]],
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    const whereClause = {};

    if (startDate && endDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        whereClause.createdAt = {
            [Op.between]: [startOfDay, endOfDay],
        };
    }

    if (keyword) {
        whereClause[Op.or] = [
            { id: { [Op.like]: `%${keyword}%` } },
            { '$client.name$': { [Op.like]: `%${keyword}%` } },
        ];
    }

    if (paymentId) {
        whereClause.paymentId = paymentId;
    }

    options.where = whereClause;

    const count = await Reservation.count({ where: whereClause });
    const reservations = await Reservation.findAll(options);

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
            },
        },
        { model: ReservationAdvance, as: "advances" },
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

exports.deleteReservation = async (req, res) => {
    const { reservationId, userId, concept } = req.body;
    console.log('Datos recibidos en el backend:');
    console.log('reservationId:', reservationId);
    console.log('userId:', userId);
    console.log('concept:', concept);

    try {
        const reservation = await Reservation.findByPk(reservationId);
        
        if (!reservation) {
            console.log('Reservation not found');
            return res.status(404).json({ message: 'Reservation not found' });
        }

        console.log('Reservation encontrada:', reservation);

        await TableAudit.create({
            userId,
            reservationId: reservation.id,
            concept,
            is_delete: true,
        });

        console.log('Registro en TableAudit creado');

        // Encontrar todas las habitaciones asociadas a la reserva
        const roomReservations = await RoomReservation.findAll({
            where: { reservationId: reservationId }
        });

        if (roomReservations.length > 0) {
            const roomIds = roomReservations.map(rr => rr.roomId);
            
            // Actualizar el active_status de las habitaciones asociadas a 0
            await Room.update(
                { active_status: 0 },
                { where: { id: roomIds } }
            );

            console.log('active_status de las habitaciones asociadas actualizado a 0');

            // Eliminar las asociaciones en la tabla RoomReservation
            await RoomReservation.destroy({
                where: { reservationId: reservationId }
            });

            console.log('Asociaciones en RoomReservation eliminadas');
        } else {
            console.log('No se encontraron habitaciones asociadas a esta reserva');
        }

        await Client.update(
            { reservationId: null }, // Campo a actualizar
            { where: { reservationId: reservationId } } // Condición para actualizar
        );

        await ReservationAdvance.destroy({
            where: { reservationId: reservationId }
        });

        await reservation.destroy();
        
        console.log('Reservation eliminada');
        
        return res.status(200).json({ message: 'Reservation deleted successfully' });
    } catch (error) {
        console.log('Error al eliminar la reserva:', error);
        return res.status(500).json({ message: 'An error occurred', error: error.message, stack: error.stack });
    }
};


  

//@desc     Get statistics
//@route    POST /api/orders/statistics
//@access   Private/user
exports.getStatistics = asyncHandler(async (req, res) => {
    try {
        const TODAY_START = new Date().setHours(0, 0, 0, 0);
        const NOW = new Date();

        const sales = await Reservation.findAll({
            where: {
                is_paid: true,
            },
            limit: 5,
            include: [
                { model: Client, as: 'client', attributes: ['id', 'name'] },
                { model: Room, as: 'room', attributes: ['id', 'name'] }
            ],
        });

        const totalSales = await Reservation.sum("total", {
            where: {
                is_paid: true,
            },
        });

        const totalOrdersPaid = await Reservation.count({
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
                is_paid: false,
            },
            include: [
                { model: Client, as: 'client', attributes: ['id', 'name'] },
                { model: Room, as: 'room', attributes: ['id', 'name'] }
            ],
            attributes: {
                exclude: ["userId", "clientId", "roomId"],
            },
        });

        // Total de habitaciones no en mantenimiento
        const totalRooms = await Room.count({
            where: {
                active_status: {
                    [Op.ne]: 2, // Excluye habitaciones en mantenimiento (asumiendo 2 es el estado de mantenimiento)
                },
            },
        });

        // Habitaciones ocupadas
        const reservedRooms = await Room.count({
            where: {
                active_status: 1, // Asumiendo 1 es el estado para habitaciones ocupadas
            },
        });

        const response = {
            statistics: {
                total: totalSales,
                today: todaySales,
                reservations: totalOrdersPaid,
                totalRooms,
                reservedRooms,
            },
            sales,
            reservations,
        };

        console.log("Response data:", response);

        res.json(response);
    } catch (error) {
        console.error("Error fetching statistics: ", error);
        res.status(500).json({ message: error.message });
    }
});



exports.updateReservationToPaid = asyncHandler(async (req, res) => {
    const { paymentId, note, agreementId } = req.body; // Recibir paymentId desde la solicitud
    console.log("req.body: ", req.body);

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
                room.active_status = 0;
                await room.save();
            }));

            reservation.is_paid = true;
            reservation.paymentId = paymentId; // Asignar paymentId
            reservation.note += ' - '+ note; // Asignar nota

            if(paymentId===1){
                if(agreementId!==1){
                    reservation.pending_payment=0;
                }
                
            }
            else{
                reservation.pending_payment=0;
            }

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