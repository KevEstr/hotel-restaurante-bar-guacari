const asyncHandler = require('express-async-handler');
const { Payment } = require("../models");
const { Op } = require("sequelize");


// @desc    Get all roles
// @route   GET /api/roles
// @access  Private/Admin
exports.getPayments = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {};

    if (keyword!=="") {
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
    //const count = await Role.count({ ...options });
    //const roles = await Role.findAll({...options});
    const payments = await Payment.findAll();

    res.json({ payments });
});

exports.getAllPayments = asyncHandler(async (req, res) => {
    const payments = await Payment.findAll();
    res.json(payments);
});
