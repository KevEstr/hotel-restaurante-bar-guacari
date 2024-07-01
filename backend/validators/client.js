const {check} = require('express-validator')

exports.clientCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a String'),
    check('phone')
        .notEmpty()
        .withMessage('Phone is required')
        .isString()
        .withMessage('Phone must be a String'),
    check('dni')
        .notEmpty()
        .withMessage('DNI is required')
        .isString()
        .withMessage('DNI must be a String'),
    check('agreementId')
        .notEmpty()
        .withMessage('agreementId is required')
]
