const asyncHandler = require('express-async-handler');
const { Service } = require('../models');

// Controlador para obtener la lista de servicios.
exports.getServices = asyncHandler(async (req, res) => {
    const services = await Service.findAll();
    res.json(services);
});

// Controlador para crear un nuevo servicio.
exports.createService = asyncHandler(async (req, res) => {
    const { name } = req.body;
    const service = await Service.create({ name });
    res.status(201).json(service);
});