const {check} = require('express-validator')

exports.categoryCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Nombre es requerido')
        .isString()
        .withMessage('Nombre debe ser un texto')
        .matches(/^[a-zA-Z]+(?:[\s][a-zA-Z]+)*$/)
        .withMessage('Nombre debe contener solo letras y espacios')
]
