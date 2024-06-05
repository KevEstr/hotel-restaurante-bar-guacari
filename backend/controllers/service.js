const asyncHandler = require("express-async-handler");
const Service = require("../models").Service;
// const Order = require("../models").Order;
const { Op } = require("sequelize");

//@desc     Create a table
//@route    POST /api/tables
//@access   Private/user

exports.createService = asyncHandler(async (req, res) => {
    const name = req.body.name;
    const createdService = await Service.create({ name });
    res.status(201).json(createdService);
});

//@desc     Get all tables with pagination
//@route    GET /api/tables
//@access   Private/user
exports.getServices = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;

    let options = {
        attributes: {
            exclude: ["updatedAt"],
        },
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

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

    const count = await Service.count({ ...options });
    const services = await Service.findAll({ ...options });

    res.json({ services, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get all tables
//@route    GET /api/tables/all
//@access   Private/user
exports.getAllServices = asyncHandler(async (req, res) => {
    const services = await Service.findAll({
        include: [
            {
                model: Service,
                as: "services",
                limit: 1,
                order: [["id", "DESC"]],
            },
        ],
    });
    res.json(services);
});

//@desc     Get table by ID
//@route    GET /api/tables/:id
//@access   Private/user
exports.getService = asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.id);

    if (service) {
        res.json(service);
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});

//@desc     Update table
//@route    PUT /api/tables/:id
//@access   Private/user
exports.updateService = asyncHandler(async (req, res) => {
    const { name } = req.body;

    const service = await Service.findByPk(req.params.id);

    if (service) {
        service.name = name;
        const updatedService = await service.save();
        res.json(updatedService);
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});

//@desc     Delete a table
//@route    DELETE /api/tables/:id
//@access   Private/user
exports.deleteService = asyncHandler(async (req, res) => {
    const service = await Service.findByPk(req.params.id);

    if (service) {
        await service.destroy();
        res.json({ message: "Service removed" });
    } else {
        res.status(404);
        throw new Error("Service not found");
    }
});
