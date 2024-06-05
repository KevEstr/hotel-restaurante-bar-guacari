const asyncHandler = require("express-async-handler");
const Product = require("../models").Product;
const Category = require("../models").Category;
const Ingredient = require("../models").Ingredient;

const ProductIngredient = require("../models").ProductIngredient;
const { Op } = require("sequelize");
const ProductInventoryMovement = require("../models").ProductInventoryMovement;


const {
    addIngredientsInProduct,
    calculateAveragePrice,
} = require("../utils/ingredient");

//@desc     Create a product
//@route    POST /api/products
//@access   Private/product
exports.createProduct = asyncHandler(async (req, res) => {
    const { name, price, categoryId, isComposite, ingredients } = req.body;
    const category = await Category.findByPk(categoryId);

    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }

    const createdProduct = await category.createProduct({
        name,
        price,
        isComposite,
        stock: isComposite ? 0 : 0, // Solo asigna stock si es un producto simple
    });

    if (isComposite && ingredients && ingredients.length > 0) {
        await addIngredientsInProduct(createdProduct, ingredients);
    
    }


        //create order products

    res.json(createdProduct);
});

//@desc     Update a product
//@route    PUT /api/products/:id
//@access   Private/user
exports.updateProduct = asyncHandler(async (req, res) => {
    const { name, price, categoryId, isComposite, ingredients, quantity, concept, operation, totalPrice} = req.body;
    const userId = req.user.id;
    // Buscar el producto por ID
    const product = await Product.findByPk(req.params.id);

    if (product) {
        // Actualizar los campos del producto
        product.name = name;
        product.price = price;
        product.categoryId = categoryId;

        // Guardar los cambios del producto
        // Si el producto es compuesto y tiene ingredientes, actualizarlos
        if (isComposite && ingredients && ingredients.length > 0) {
            // Limpiar los ingredientes existentes en la tabla intermedia
            await ProductIngredient.destroy({ where: { productId: product.id } });

            // Agregar los nuevos ingredientes
            await addIngredientsInProduct(product, ingredients);
        }
        
        if(!isComposite){

            let oldStock = Number(product.stock);
            let newQuantity = Number(quantity);
        
            if (newQuantity) {
                let movementType;
                if (operation === 'entrada') {
                    // Es una entrada
                    movementType = 'entrada';
                    oldStock += newQuantity;
                    let newAveragePrice = await calculateAveragePrice(product.stock, product.averagePrice, newQuantity, totalPrice);
                    
                    console.log("Creating Inventory Movement: ", {
                        productId: product.id,
                        ingredientId: null,
                        userId: userId,
                        quantity: quantity,
                        type: movementType,
                        concept: concept,
                        totalPrice: totalPrice
                    });
        
                    let movementInventory = await ProductInventoryMovement.create({
                        productId: product.id,
                        ingredientId: null,
                        userId: userId,
                        quantity: quantity,
                        type: movementType,
                        concept: concept,
                        totalPrice: totalPrice
                    });
        
                    console.log("InventoryMovement created: ", movementInventory);
                    product.averagePrice = newAveragePrice;
        
                } else if (operation === 'salida') {
                    // Es una salida
                    if (newQuantity > oldStock) {
                        res.status(400);
                        throw new Error("La cantidad de salida no puede ser mayor al inventario actual");
                    } else {
                        movementType = 'salida';
                        oldStock -= newQuantity;
        
                        console.log("Creating Inventory Movement: ", {
                            productId: product.id,
                            ingredientId: null,
                            userId: userId,
                            quantity: quantity,
                            type: movementType,
                            concept: concept,
                            totalPrice: Number(product.averagePrice) * newQuantity,
                        });
        
                        let movementInventory = await ProductInventoryMovement.create({
                            productId: product.id,
                            ingredientId: null,
                            userId: userId,
                            quantity: quantity,
                            type: movementType,
                            concept: concept,
                            totalPrice: Number(product.averagePrice) * newQuantity,
                        });
                        console.log("InventoryMovement created: ", movementInventory);
                        
                    }
                }
                product.stock = oldStock;
                
            }

        }
        product.save();
        res.json(product);
    } else {
        res.status(404);
        throw new Error("Product not found");
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
        include: [
            { model: Category, as: "category" },
            {
                model: Ingredient,
                as: 'ingredients',
                through: {
                    attributes: ['ingredientId', 'productId', 'quantity']
                }
            },
        ],

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
        include: [{ model: Category, as: "category" }, { model: Ingredient, as: 'ingredients', through: { attributes: ['quantity']  }}],
    });

    if (product) {
        res.json(product);
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

exports.getIngredientStockForProduct = asyncHandler(async (req, res) => {
    const productId = req.params.productId;

    try {
        // Paso 1: Obtener los ingredientes asociados al producto
        const productIngredients = await ProductIngredient.findAll({
            where: { productId },
            include: [{ model: Ingredient }]
        });

        // Paso 2: Obtener el stock de cada ingrediente
        const ingredientStock = productIngredients.map(item => ({
            ingredientId: item.Ingredient.id,
            ingredientName: item.Ingredient.name,
            stock: item.Ingredient.stock
        }));

        // Paso 3: Devolver el resultado
        res.json({ ingredientStock });
    } catch (error) {
        console.error('Error fetching ingredient stock:', error);
        res.status(500).json({ message: 'Error fetching ingredient stock' });
    }
});

exports.getAllIngredientsOfProduct = asyncHandler(async (req, res) => {
    const productId = req.product.id;

    try {
        const productIngredients = await ProductIngredient.findAll({
            where: { productId },
            include: [{ model: Ingredient }]
        });

        const ingredients = productIngredients.map(item => item.Ingredient);

        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: "Error fetching ingredients" });
    }
});

