const asyncHandler = require("express-async-handler");
const Client = require("../models").Client;
const Reservation = require("../models").Reservation;
const Service = require("../models").Service;


const { Op } = require("sequelize");

//@desc     Create a client
//@route    POST /api/clients
//@access   Private/user
exports.createClient = asyncHandler(async (req, res) => {
    const { name, address, phone, email, dni, agreementId, has_reservation} = req.body;
    const createdClient = await Client.create({
        name,
        address,
        phone,
        email,
        dni,
        agreementId,
        has_reservation,
    });
    res.status(201).json(createdClient);
});

//@desc     Get all clients with pagination
//@route    GET /api/clients
//@access   Private/user
exports.getClients = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;
    const hasReservation = req.query.has_reservation === "true";
    let options = {
        include: {
            model: Reservation,
            as: "reservation",
            include: {
                model: Service,
                as: "service",
            },
        },
        attributes: {
            exclude: ["updatedAt"],
        },
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options.where = {
            [Op.or]: [
                { id: { [Op.like]: `%${keyword}%` } },
                { name: { [Op.like]: `%${keyword}%` } },
                { address: { [Op.like]: `%${keyword}%` } },
                { phone: { [Op.like]: `%${keyword}%` } },
                { email: { [Op.like]: `%${keyword}%` } },
                { dni: { [Op.like]: `%${keyword}%` } },
                { agreementId: { [Op.like]: `%${keyword}%` } },
            ],
        };
    }

    if (hasReservation) {
        options.where = {
            ...options.where,
            has_reservation: true,
        };
    }

    const count = await Client.count({ ...options });
    const clients = await Client.findAll({ ...options });

    res.json({ clients, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get client by ID
//@route    GET /api/clients/:id
//@access   Private/user
exports.getClient = asyncHandler(async (req, res) => {
    const client = await Client.findByPk(req.params.id, {
        include: {
            model: Reservation,
            as: "reservation",
            include: {
                model: Service,
                as: "service",
            },
        },
    });

    if (client) {
        res.json(client);
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
});

//@desc     Update client
//@route    PUT /api/clients/:id
//@access   Private/user
exports.updateClient = asyncHandler(async (req, res) => {
    const { name, address, phone, email, dni, agreementId, has_reservation } = req.body;

    const client = await Client.findByPk(req.params.id);

    if (client) {
        client.name = name;
        client.address = address;
        client.phone = phone;
        client.email = email;
        client.dni = dni;
        client.agreementId = agreementId
        client.has_reservation = has_reservation;
        
        const updatedClient = await client.save();
        res.json(updatedClient);
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
});

//@desc     Delete a client
//@route    DELETE /api/clients/:id
//@access   Private/user
exports.deleteClient = asyncHandler(async (req, res) => {
    const client = await Client.findByPk(req.params.id);

    if (client) {
        await client.destroy();
        res.json({ message: "Client removed" });
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
});

exports.updateClientReservationStatus = asyncHandler(async (req, res) => {
    const { has_reservation } = req.body;

    const client = await Client.findByPk(req.params.id);

    if (client) {
        client.has_reservation = has_reservation;

        const updatedClient = await client.save();
        res.json(updatedClient);
    } else {
        res.status(404);
        throw new Error("Client not found");
    }
});
