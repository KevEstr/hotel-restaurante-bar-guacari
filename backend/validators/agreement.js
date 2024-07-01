const {check} = require('express-validator')

exports.agreementCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Nombre es requerido')
        .isString()
        .withMessage('Nombre debe ser un texto'),
]
