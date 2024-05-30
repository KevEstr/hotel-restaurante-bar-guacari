// controllers/ingredientMovementController.js
const asyncHandler = require('express-async-handler');
const { InventoryMovement, Ingredient, User } = require('../models');

// @desc    Fetch all ingredient movements
// @route   GET /api/ingredientmovements
// @access  Private
const getIngredientMovements = asyncHandler(async (req, res) => {
    const { startDate, endDate, type } = req.query;
    let query = {};

    if (startDate && endDate) {
        query.createdAt = { 
            [Op.between]: [new Date(startDate), new Date(endDate)] 
        };
    }

    if (type) {
        query.type = type;
    }

    const movements = await InventoryMovement.findAll({
        where: query,
        include: [
            { model: Ingredient, as: 'ingredient' },
            { model: User, as: 'user' },
        ],
    });

    res.json(movements);
});

// @desc    Fetch single ingredient movement
// @route   GET /api/ingredientmovements/:id
// @access  Private
const getIngredientMovementById = asyncHandler(async (req, res) => {
    const movement = await InventoryMovement.findByPk(req.params.id, {
        include: [
            { model: Ingredient, as: 'ingredient' },
            { model: User, as: 'user' },
        ],
    });

    if (movement) {
        res.json(movement);
    } else {
        res.status(404);
        throw new Error('Ingredient movement not found');
    }
});

// @desc    Create a new ingredient movement
// @route   POST /api/ingredientmovements
// @access  Private
const createIngredientMovement = asyncHandler(async (req, res) => {
    const { ingredientId, userId, quantity, type, concept, totalPrice } = req.body;

    const movement = await InventoryMovement.create({
        ingredientId,
        userId,
        quantity,
        type,
        concept,
        totalPrice,
        createdAt: new Date(),
    });

    res.status(201).json(movement);
});

// @desc    Update an ingredient movement
// @route   PUT /api/ingredientmovements/:id
// @access  Private
const updateIngredientMovement = asyncHandler(async (req, res) => {
    const { ingredientId, userId, quantity, type, concept, totalPrice } = req.body;

    const movement = await InventoryMovement.findByPk(req.params.id);

    if (movement) {
        movement.ingredientId = ingredientId;
        movement.userId = userId;
        movement.quantity = quantity;
        movement.type = type;
        movement.concept = concept;
        movement.totalPrice = totalPrice;

        await movement.save();
        res.json(movement);
    } else {
        res.status(404);
        throw new Error('Ingredient movement not found');
    }
});

// @desc    Delete an ingredient movement
// @route   DELETE /api/ingredientmovements/:id
// @access  Private
const deleteIngredientMovement = asyncHandler(async (req, res) => {
    const movement = await InventoryMovement.findByPk(req.params.id);

    if (movement) {
        await movement.destroy();
        res.json({ message: 'Ingredient movement removed' });
    } else {
        res.status(404);
        throw new Error('Ingredient movement not found');
    }
});

module.exports = {
    getIngredientMovements,
    getIngredientMovementById,
    createIngredientMovement,
    updateIngredientMovement,
    deleteIngredientMovement,
};
