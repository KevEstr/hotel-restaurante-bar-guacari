const asyncHandler = require("express-async-handler");
const Ingredient = require("../models").Ingredient;
const Category = require("../models").Category;
const { Op } = require("sequelize");

//@desc     Create a ingredient
//@route    POST /api/ingredients
//@access   Private/ingredient
exports.createIngredient = asyncHandler(async (req, res) => {
    const { name, cost, stock, categoryId } = req.body;
    const category = await Category.findByPk(categoryId);

    if (category) {
        createdIngredient = await category.createIngredient({ name, cost, stock });
        res.json(createdIngredient);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

//@desc     Get all ingredients
//@route    GET /api/ingredients
//@access   Private/user
exports.getIngredients = asyncHandler(async (req, res) => {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;

    let options = {
        include: [{ model: Category, as: "category" }],
        attributes: {
            exclude: ["categoryId", "updatedAt"],
        },

        offset: pageSize * (page - 1),
        limit: pageSize,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                    { cost: keyword },
                    { "$category.name$": { [Op.like]: `%${keyword}%` } },
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
    const ingredient = await Ingredient.findByPk(req.params.id, {
        include: [{ model: Category, as: "category" }],
    });

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
    const { name, cost, stock, category } = req.body;

    const ingredient = await Ingredient.findByPk(req.params.id);

    if (ingredient) {
        ingredient.name = name;
        ingredient.cost = cost;
        ingredient.stock = stock;
        ingredient.categoryId = category;
        const updatedIngredient = await ingredient.save();
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
