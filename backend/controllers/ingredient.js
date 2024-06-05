const asyncHandler = require("express-async-handler");
const { Ingredient, InventoryMovement, User } = require("../models");
const { Op } = require("sequelize");
const {
    calculateAveragePrice,
} = require("../utils/ingredient");

//@desc     Create a ingredient
//@route    POST /api/ingredients
//@access   Private/ingredient
exports.createIngredient = asyncHandler(async (req, res) => {
    const { name, ingredientType, stock=0, concept } = req.body;
    const userId = req.user.id;

    if (!userId) {
        res.status(404);
        throw new Error("User ID is required");
    }
    
    // Crear el ingrediente
    const createdIngredient = await Ingredient.create({ name, ingredientType, stock});

    res.status(201).json({ ingredient: createdIngredient });
});

//@desc     Get all ingredients
//@route    GET /api/ingredients
//@access   Private/user
exports.getIngredients = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;
    let options = {};

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }
    const count = await Ingredient.count({ ...options });
    const ingredients = await Ingredient.findAll({ ...options });

    res.json({ ingredients, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get ingredient by ID
//@route    GET /api/ingredients/:id
//@access   Private/user
exports.getIngredient = asyncHandler(async (req, res) => {
    const ingredient = await Ingredient.findByPk(req.params.id);
    
    if (ingredient) {
        res.json(ingredient);
    } else {
        res.status(404);
        throw new Error("Ingredient not found");
    }
});



//@desc     Update a ingredient
//@route    PUT /api/ingredients/:id
//@access   Private/user
exports.updateIngredient = asyncHandler(async (req, res) => {
    const { name, quantity, concept, operation, totalPrice } = req.body;
    const userId = req.user.id;

    if (!userId) {
        res.status(400);
        throw new Error("User ID is required");
    }

    

    const ingredient = await Ingredient.findByPk(req.params.id);
    if (!ingredient) {
        res.status(404);
        throw new Error("Ingrediente no encontrado.");
    }
    if (ingredient) {
        let aux= ingredient.stock;
        let oldStock = Number(aux);
        let newQuantity= Number(quantity)
        ingredient.name = name;
        // Registrar el movimiento de inventario si cambia el stock
        if(oldStock<0){
            await InventoryMovement.create({
                ingredientId: ingredient.id,
                userId: 2,
                quantity: -oldStock,
                type: "entrada",
                concept: `Ajuste de inventario automático por existencia negativa.`,
                totalPrice: ingredient.averagePrice*-oldStock,
            });
            ingredient.stock=0;
            ingredient.save();
            oldStock=0;
        }
        if (newQuantity) {
            let movementType;
            if (operation==='entrada') {
                // Es una entrada
                movementType = 'entrada';
                oldStock += newQuantity;
                let newAveragePrice = await calculateAveragePrice(ingredient.stock, ingredient.averagePrice, newQuantity, totalPrice);
                await InventoryMovement.create({
                    ingredientId: ingredient.id,
                    userId: userId,
                    quantity: quantity,
                    type: movementType,
                    concept: concept,
                    totalPrice: totalPrice
                });
                ingredient.averagePrice = newAveragePrice;

            } else {
                // Es una salida
                if(quantity>oldStock){
                    res.status(404);
                    throw new Error("La cantidad de salida no puede ser mayor al inventario actual");
                }
                else{
                    movementType = 'salida';
                    oldStock -= newQuantity;
                    await InventoryMovement.create({
                        ingredientId: ingredient.id,
                        userId: userId,
                        quantity: quantity,
                        type: movementType,
                        concept: concept,
                        totalPrice: Number(ingredient.averagePrice)*Number(quantity),
                    });
                }
            }
            ingredient.stock= oldStock;            
        }
        let updatedIngredient = await ingredient.save();

        res.json(updatedIngredient);
    } else {
        res.status(404);
        throw new Error("Ingredient not found");
    }
});

//@desc     Delete a ingredient
//@route    DELETE /api/ingredients/:id
//@access   Private/user
exports.deleteIngredient = asyncHandler(async (req, res) => {
    const ingredient = await Ingredient.findByPk(req.params.id);

    if (ingredient) {
        await ingredient.destroy();
        res.json({ message: "Ingredient removed" });
    } else {
        res.status(404);
        throw new Error("Ingredient not found");
    }
});

exports.getAllIngredientStock = asyncHandler(async (req, res) => {
    try {
        const allIngredients = await Ingredient.findAll();
        res.json({ ingredients: allIngredients });
    } catch (error) {
        console.error("Error fetching all ingredients:", error);
        res.status(500).json({ message: "Error fetching all ingredients" });
    }
});

