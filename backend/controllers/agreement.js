const asyncHandler = require("express-async-handler");
const Agreement = require("../models").Agreement;
const { Op } = require("sequelize");

//@desc     Create a ingredient
//@route    POST /api/ingredients
//@access   Private/ingredient

exports.createAgreement = asyncHandler(async (req, res) => {
    const { name, max_daily_food, max_daily_laundry, max_daily_hydration, userId} = req.body;
        const createdAgreement = await Agreement.create({  
            name, 
            max_daily_food, 
            max_daily_laundry, 
            max_daily_hydration, 
            userId,
            userId: req.user.id,
        });
        res.status(201).json(createdAgreement);
});

//@desc     Get all ingredients
//@route    GET /api/ingredients
//@access   Private/user
exports.getAgreements = asyncHandler(async (req, res) => {
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
    const count = await Agreement.count({ ...options });
    const agreements = await Agreement.findAll({ ...options });

    res.json({ agreements, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get ingredient by ID
//@route    GET /api/ingredients/:id
//@access   Private/user

exports.getAgreement = asyncHandler(async (req, res) => {
    const agreement = await Agreement.findByPk(req.params.id);
    
    if (agreement) {
        res.json(agreement);
    } else {
        res.status(404);
        throw new Error("Agreement not found");
    }
});

//@desc     Update a ingredient
//@route    PUT /api/ingredients/:id
//@access   Private/user
exports.updateAgreement = asyncHandler(async (req, res) => {
    const { name, max_daily_food, max_daily_laundry, max_daily_hydration, userId } = req.body;

    const agreement = await Agreement.findByPk(req.params.id);

    if (agreement) {
        agreement.name = name;
        agreement.max_daily_food = max_daily_food;
        agreement.max_daily_laundry = max_daily_laundry;
        agreement.max_daily_hydration = max_daily_hydration;
        agreement.userId = userId;

        const updatedAgreement = await agreement.save();
        res.json(updatedAgreement);
    } else {
        res.status(404);
        throw new Error("Agreement not found");
    }
});

//@desc     Delete a ingredient
//@route    DELETE /api/ingredients/:id
//@access   Private/user
exports.deleteAgreement = asyncHandler(async (req, res) => {
    const agreement = await Agreement.findByPk(req.params.id);

    if (agreement) {
        await agreement.destroy();
        res.json({ message: "Agreement removed" });
    } else {
        res.status(404);
        throw new Error("Agreement not found");
    }
});