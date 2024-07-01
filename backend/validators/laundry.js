const {check} = require('express-validator')

exports.laundryCreateValidator = [
    check('price')
        .notEmpty()
        .withMessage('Price is required')
]
