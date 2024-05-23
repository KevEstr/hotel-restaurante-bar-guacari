const asyncHandler = require("express-async-handler");
const Product = require("../models").Product;
const Category = require("../models").Category;
const Ingredient = require("../models").Ingredient;
const ProductIngredient = require("../models").ProductIngredient;
const { Op } = require("sequelize");

const {
    ingredientStock,
    addIngredientsInProduct,
    updateIngredientsStock,
} = require("../utils/ingredient");

//@desc     Create a product
//@route    POST /api/products
//@access   Private/product
exports.createProduct = asyncHandler(async (req, res) => {
    const { name, price, stock, categoryId, isComposite, ingredients } = req.body;
    const category = await Category.findByPk(categoryId);

    if (category) {
        const createdProduct = await category.createProduct({
            name,
            price,
            stock,
            isComposite,
        });

        /*if (isComposite && ingredients && ingredients.length > 0) {
            const ingredientRecords = await Ingredient.findAll({
                where: { id: ingredients, quantity:ingredients},
            });
            
            await createdProduct.setIngredients(ingredientRecords);
        }*/

        /*if (isComposite && ingredients && ingredients.length > 0) {

            // Crear registros en ProductIngredient para cada ingrediente con la cantidad utilizada
            const productIngredients = ingredients.map(ingredient => ({
                productId: createdProduct.id,
                ingredientId: ingredient.id,
                quantity: ingredient.quantity, // Modifica la cantidad de ingrediente aquí
            }));
        
            // Guardar los registros en la tabla ProductIngredient
            await ProductIngredient.bulkCreate(productIngredients);
        }*/

        //create order products
        await addIngredientsInProduct(createdProduct, ingredients);

        res.json(createdProduct);
    } else {
        res.status(404);
        throw new Error("Category not found");
    }
});

//@desc     Get all products
//@route    GET /api/products
//@access   Private/user
exports.getProducts = asyncHandler(async (req, res) => {
    const pageSize = 25;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword ? req.query.keyword : null;

    let options = {
        include: [{ model: Category, as: "category" }],
        attributes: {
            exclude: ["categoryId", "updatedAt"],
        },

        offset: 0,
    };

    if (keyword) {
        options = {
            ...options,
            where: {
                [Op.or]: [
                    { id: { [Op.like]: `%${keyword}%` } },
                    { name: { [Op.like]: `%${keyword}%` } },
                    { price: keyword },
                    { "$category.name$": { [Op.like]: `%${keyword}%` } },
                ],
            },
        };
    }
    const count = await Product.count({ ...options });
    const products = await Product.findAll({ ...options });

    res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

//@desc     Get product by ID
//@route    GET /api/products/:id
//@access   Private/user
exports.getProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id, {
        include: [{ model: Category, as: "category" }],
    });

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});

//@desc     Update a product
//@route    PUT /api/products/:id
//@access   Private/user
exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, price, stock, categoryId, isComposite, ingredients } = req.body;

    const product = await Product.findByPk(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.stock = stock;
        product.categoryId = categoryId;
        product.isComposite = isComposite;

        const updatedProduct = await product.save();

        if (isComposite && ingredients && ingredients.length > 0) {
            const ingredientRecords = await Ingredient.findAll({
                where: { id: ingredients },
            });
            await updatedProduct.setIngredients(ingredientRecords);
        } else if (!isComposite) {
            await updatedProduct.setIngredients([]);
        }

        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});
//@desc     Delete a product
//@route    DELETE /api/products/:id
//@access   Private/user
exports.deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (product) {
        await product.destroy();
        res.json({ message: "Product removed" });
    } else {
        res.status(404);
        throw new Error("Product not found");
    }
});