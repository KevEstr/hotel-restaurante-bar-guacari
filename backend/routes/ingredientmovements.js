// routes/ingredientMovementRoutes.js
const express = require('express');
const router = express.Router();
const {
    getIngredientMovements,
    getIngredientMovementById,
    createIngredientMovement,
    updateIngredientMovement,
    deleteIngredientMovement,
} = require('../controllers/ingredientmovements.js');
const { protect } = require('../middleware/authMiddleware');

router
    .route('/')
    .get(protect, getIngredientMovements)
    .post(protect, createIngredientMovement);

router
    .route('/:id')
    .get(protect, getIngredientMovementById)
    .put(protect, updateIngredientMovement)
    .delete(protect, deleteIngredientMovement);

module.exports = router;
