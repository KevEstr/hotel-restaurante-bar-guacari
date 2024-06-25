const {check} = require('express-validator')

exports.agreementCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Nombre es requerido')
        .isString()
        .withMessage('Nombre debe ser un texto'),
    check('selectedServices')
        .notEmpty()
        .withMessage('Debe seleccionar al menos 1 servicio')
]
