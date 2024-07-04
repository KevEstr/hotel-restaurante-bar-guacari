// controllers/tableAuditController.js
const asyncHandler = require('express-async-handler');
const { TableAudit, User, Order, Reservation } = require('../models');

const getTableAuditLogs = asyncHandler(async (req, res) => {
    const { keyword = '', pageNumber = 1, startDate, endDate } = req.query;

    const pageSize = 10;
    const page = Number(pageNumber) || 1;

    let whereClause = {};

    if (startDate && endDate) {
        whereClause.createdAt = {
            [Op.between]: [new Date(startDate), new Date(endDate)],
        };
    }

    if (keyword) {
        whereClause.concept = {
            [Op.iLike]: `%${keyword}%`,
        };
    }

    const count = await TableAudit.count({ where: whereClause });

    const audits = await TableAudit.findAll({
        where: whereClause,
        limit: pageSize,
        offset: pageSize * (page - 1),
        include: [
            { model: User, as: 'user', attributes: ['name'] },
            { model: Order, as: 'order', attributes: ['id'] },
            { model: Reservation, as: 'reservation', attributes: ['id'] },
        ],
    });

    res.json({ audits, page, pages: Math.ceil(count / pageSize) });
});

module.exports = { getTableAuditLogs };
