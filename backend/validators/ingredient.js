const {check} = require('express-validator')

exports.ingredientCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    check('ingredientType')
        .notEmpty()
        .withMessage('ingredientType is required')
        .isFloat()
        .withMessage('Cost must be a number'),
    check('stock')
        .isNumeric()
        .withMessage('Stock must be a number')
]
