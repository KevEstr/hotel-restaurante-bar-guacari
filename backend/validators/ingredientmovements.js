// validators/inventoryMovement.js
const { check } = require('express-validator');

const ingredientMovementCreateValidator = [
    check('ingredient').not().isEmpty().withMessage('Ingredient is required'),
    check('quantity').isNumeric().withMessage('Quantity must be a number'),
    check('type').not().isEmpty().withMessage('Type is required'),
    check('concept').not().isEmpty().withMessage('Concept is required'),
    check('date').isISO8601().toDate().withMessage('Valid date is required'),
];

module.exports = {
    ingredientMovementCreateValidator,
};
