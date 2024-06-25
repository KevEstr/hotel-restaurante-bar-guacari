const asyncHandler = require("express-async-handler");
const Laundry = require("../models").Laundry;
const { Op } = require("sequelize");

//@desc     Create a client
//@route    POST /api/clients
//@access   Private/user
exports.createLaundry = asyncHandler(async (req, res) => {
    const { quantity, price, clientId } = req.body;

    const createdLaundry = await Laundry.create({
        quantity,
        price,
        clientId
    });
    res.status(201).json(createdLaundry);
});

//@desc     Get all clients with pagination
//@route    GET /api/clients
//@access   Private/user
exports.getLaundries = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const keyword = req.query.keyword ? req.query.keyword : null;

    /* SEARCH OPTIONS */
    let options = {
        attributes: {
            exclude: ["updatedAt"],
        },
        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    /* CHECK IF THERE IS A KEYWORD */
    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { quantity: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }

    /* QUERY */
    const count = await Laundry.count({ ...options });
    const laundries = await Laundry.findAll({
        ...options,
    });

    /* RESPONSE */
    res.json({ laundries, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get client by ID
//@route    GET /api/clients/:id
//@access   Private/user
exports.getLaundry = asyncHandler(async (req, res) => {
    const laundry = await Laundry.findByPk(req.params.id);

    if (laundry) {
        res.json(laundry);
    } else {
        res.status(404);
        throw new Error("Laundry not found");
    }
});

//@desc     Update client
//@route    PUT /api/clients/:id
//@access   Private/user
exports.updateLaundry = asyncHandler(async (req, res) => {
    const { quantity, price, clientId } = req.body;

    const laundry = await Laundry.findByPk(req.params.id);

    if (laundry) {
        laundry.quantity = quantity;
        laundry.price = price;
        laundry.clientId = clientId;
        
        const updatedLaundry = await laundry.save();
        res.json(updatedLaundry);

    } else {
        res.status(404);
        throw new Error("Laundry not found");
    }
});

//@desc     Delete a client
//@route    DELETE /api/clients/:id
//@access   Private/user
exports.deleteLaundry = asyncHandler(async (req, res) => {
    const laundry = await Laundry.findByPk(req.params.id);

    if (laundry) {
        await laundry.destroy();
        res.json({ message: "Laundry removed" });
    } else {
        res.status(404);
        throw new Error("Laundry not found");
    }
});
