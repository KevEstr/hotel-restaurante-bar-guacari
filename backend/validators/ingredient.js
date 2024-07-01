const {check} = require('express-validator')

exports.ingredientCreateValidator = [
    check('name')
        .notEmpty()
        .withMessage('Name is required')
        .isString()
        .withMessage('Name must be a string'),
    check('minQty')
        .notEmpty()
        .withMessage('Cantidad mínima es requerida')
        .isNumeric()
        .withMessage('Canitdad mínima debe ser boolean'),	

]
