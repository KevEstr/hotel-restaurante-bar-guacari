const Product = require("../models").Product;
const Ingredient = require("../models").Ingredient;
const ProductIngredient = require("../models").ProductIngredient;
const InventoryMovement = require("../models").InventoryMovement;
const ProductInventoryMovement = require("../models").ProductInventoryMovement;
const debug = require('debug')('app');

/* check stock of each ingredient */
exports.calculateAveragePrice = (stock, averagePrice, newQuantity, newTotalPrice) => {
    const totalStock = Number(stock) + Number(newQuantity);
    const totalCost = (Number(averagePrice) * Number(stock)) + Number(newTotalPrice);
    return Number(totalCost / totalStock);
};

//Add ingredients in order 
exports.addIngredientsInProduct = async (product, ingredients) => {
    ingredients.forEach(async (ingredient) => {
        await product.addIngredient(ingredient.id, {
            through: { quantity: ingredient.quantity}
        });
    });
};

/* 
Update stock from ingredients
condition
    +1 INCREASE STOCK 
    -1 DECREASE STOCK
*/

exports.updateIngredientsStock = async (ingredients, condition) => {
    await ingredients.forEach(async (ingredient) => {
        const ingredientToUpdate = await Ingredient.findByPk(ingredient.id);

        if (ingredientToUpdate) {
            if (condition >= 1) {
                ingredientToUpdate.stock += ingredient.quantity;
            } else {
                ingredientToUpdate.stock -= ingredient.quantity;
            }
            await ingredientToUpdate.save();
        }
    });
};

exports.ingredientStock = async (list) => {
    for (let index = 0; index < list.length; index++) {
        const ingredientSearched = await Ingredient.findByPk(list[index].id);
        if (ingredientSearched.stock < list[index].quantity) {
            return false;
        }
    }
    return true;
};

exports.verifyStock = async (productData) => {
    for (let index = 0; index < productData.length; index++) {
        /*const productSearched = await Product.findByPk(productData[index].id, {
            include: [{ model: Ingredient, as: 'ingredients' }]
        });*/

        //throw new Error(`PRODUCTOS NUEVOS: ${JSON.stringify(productData, null, 2)}`);


        if (!productData[index]) {
            throw new Error(`El producto ${productData[index].name} no se encontró`);
        }

        // Si el producto es compuesto, verificar el stock de los ingredientes
        if (productData[index].isComposite === true) {
            for (let product of productData) {
                if (product.ingredients) {
                    for (let ingredient of product.ingredients) {
                        const ingredientStock = await Ingredient.findByPk(ingredient.id);
                        if (!ingredientStock) {
                            throw new Error(`El ingrediente ${ingredient.name} no se encontró`);
                        }
        
                        // Verificar si hay suficiente stock
                        if (Number(ingredientStock.stock) < Number(ingredient.ProductIngredient.quantity) * Number(product.quantity)) {
                            throw new Error(`No hay inventario suficiente de ${ingredient.name} para el producto ${product.name}`);
                        }
                    }
                }
            }
        }
        else {
            //si es simple, verificar el stock del producto

            const productStock = await Product.findByPk(productData[index].id);
            if (Number(productStock.stock) < Number((productData[index].stock))) {
                throw new Error(`No hay inventario suficiente de ${productData[index].name}`);
            }
        }
    }
    return true;
};

exports.updateStockAndCreateMovement = async (productData, userId, orderId, condition, isUpdate, flag) => {
    if(isUpdate===true){
        //throw new Error(`IS UPDATE productData ${JSON.stringify(productData, null, 2)}`);
        productData.forEach(async productPair =>  {
            const oldProduct = productPair.oldProduct;
            const newProduct = productPair.newProduct;
          
            // Comprueba si la cantidad en OrderProduct de newProduct es igual a la cantidad de oldProduct
            if (newProduct.quantity !== oldProduct.OrderProduct.quantity) {
                let quantityChange = newProduct.quantity - oldProduct.OrderProduct.quantity;
            if (quantityChange > 0) {
                // Es una salida
                if (oldProduct.isComposite===true) {
                    if (oldProduct.ingredients){
                        for (let ingredient of oldProduct.ingredients) {
                            const ingredientStock = await Ingredient.findByPk(ingredient.id);
                            // Actualizar el stock del ingrediente
                            ingredientStock.stock = Number(ingredientStock.stock) - Number(ingredient.ProductIngredient.quantity) * Number(quantityChange);
                            await ingredientStock.save();
            
                            // Crear movimiento de inventario
                            const movement = await InventoryMovement.create({
                                userId: userId,
                                ingredientId: ingredient.id,
                                quantity: Number(ingredient.ProductIngredient.quantity) * Number(quantityChange),
                                type: 'salida', // Tipo de movimiento: salida
                                concept: `Salida de inventario por modificación en la orden ${orderId}`,
                                totalPrice: Number(ingredient.ProductIngredient.quantity) * Number(quantityChange) * Number(ingredientStock.averagePrice),
                            });
            
                            if (!movement) {
                                throw new Error('Error creando movimiento de inventario');
                            }
                        }
                    }
                    
                }
                else{
                    const productStock = await Product.findByPk(oldProduct.id);
                    // Calcular la cantidad a deducir del stock del producto
                    const quantityToDeduct = Number(quantityChange);
                    // Actualizar el stock del producto
                    productStock.stock = Number(productStock.stock) - quantityToDeduct;
                    await productStock.save();
        
                    const movement = await ProductInventoryMovement.create({
                        userId: userId,
                        productId: oldProduct.id,
                        quantity: quantityToDeduct,
                        type: 'salida', // Tipo de movimiento: salida
                        concept: `Salida de inventario por modificación en la orden ${orderId}`,
                        totalPrice: quantityToDeduct * Number(productStock.averagePrice),
                    });
                    if (!movement) {
                        throw new Error('Error creando movimiento de inventario');
                    }
                }
            } else {
                //ES UNA ENTRADA
                quantityChange = -Number(quantityChange);
                if (oldProduct.isComposite===true) {
                    if (oldProduct.ingredients){
                        for (let ingredient of oldProduct.ingredients) {
                            const ingredientStock = await Ingredient.findByPk(ingredient.id);
                            //throw new Error(`oldProducts ${JSON.stringify(product.OrderProduct.quantity, null, 2)}`);
                            // Actualizar el stock del ingrediente
                            ingredientStock.stock = Number(ingredientStock.stock) + Number(ingredient.ProductIngredient.quantity) * Number(quantityChange);
                            await ingredientStock.save();
            
                            // Crear movimiento de inventario
                            const movement = await InventoryMovement.create({
                                userId: userId,
                                ingredientId: ingredient.id,
                                quantity: Number(ingredient.ProductIngredient.quantity) * Number(quantityChange),
                                type: 'entrada', // Tipo de movimiento: salida
                                concept: `Entrada de inventario por modificación en la orden ${orderId}`,
                                totalPrice: Number(ingredient.ProductIngredient.quantity) * Number(quantityChange) * Number(ingredientStock.averagePrice),
                            });
            
                            if (!movement) {
                                throw new Error('Error creando movimiento de inventario');
                            }
                        }
                    }
                    
                }
                else{
                    const productStock = await Product.findByPk(oldProduct.id);
                    // Calcular la cantidad a deducir del stock del producto
                    const quantityToDeduct = Number(quantityChange);
                    // Actualizar el stock del producto
                    productStock.stock = Number(productStock.stock) + quantityToDeduct;
                    await productStock.save();
        
                    const movement = await ProductInventoryMovement.create({
                        userId: userId,
                        productId: oldProduct.id,
                        quantity: quantityToDeduct,
                        type: 'entrada', // Tipo de movimiento: salida
                        concept: `Entrada de inventario por modificación en la orden ${orderId}`,
                        totalPrice: quantityToDeduct * Number(productStock.averagePrice),
                    });
                    if (!movement) {
                        throw new Error('Error creando movimiento de inventario');
                    }
                }
            }
        }
          });
    }
    else if(isUpdate===false){
        //es una creación de orden
        for (let index = 0; index < productData.length; index++) {
            /*const productSearched = await Product.findByPk(productData[index].id, {
                include: [{ model: Ingredient, as: 'ingredients' }]
            });*/
    
            if (condition === -1) {
                // es una salida
                for (let product of productData) {
                    if (product.isComposite===true) {
                        if (product.ingredients){
                            for (let ingredient of product.ingredients) {
                                const ingredientStock = await Ingredient.findByPk(ingredient.id);
                                const quantity = product.OrderProduct?.quantity || product.quantity;
                                // Actualizar el stock del ingrediente
                                ingredientStock.stock = Number(ingredientStock.stock)-Number(ingredient.ProductIngredient.quantity) * Number(quantity);
                                await ingredientStock.save();
                
                                // Crear movimiento de inventario
                                const movement = await InventoryMovement.create({
                                    userId: userId,
                                    ingredientId: ingredient.id,
                                    quantity: Number(ingredient.ProductIngredient.quantity) * Number(quantity),
                                    type: 'salida', // Tipo de movimiento: salida
                                    concept: flag 
                                    ? `Salida de inventario por creación de la orden ${orderId}` 
                                    : `Salida de inventario por modificación de la orden ${orderId}`,
                                    totalPrice: Number(ingredient.ProductIngredient.quantity) * Number(quantity) * Number(ingredientStock.averagePrice),
                                });
                
                                if (!movement) {
                                    throw new Error('Error creando movimiento de inventario');
                                }
                            }
                        }
                        
                    } else {
                        const productStock = await Product.findByPk(product.id);
                        // Calcular la cantidad a deducir del stock del producto
                        const quantityToDeduct = Number(product.quantity);
                        // Actualizar el stock del producto
                        productStock.stock = Number( productStock.stock)-quantityToDeduct;
                        await productStock.save();
            
                        const movement = await ProductInventoryMovement.create({
                            userId: userId,
                            productId: product.id,
                            quantity: quantityToDeduct,
                            type: 'salida', // Tipo de movimiento: salida
                            concept: flag 
                                    ? `Salida de inventario por creación de la orden ${orderId}` 
                                    : `Salida de inventario por modificación de la orden ${orderId}`,
                            totalPrice: quantityToDeduct * Number(productStock.averagePrice),
                        });
                        if (!movement) {
                            throw new Error('Error creando movimiento de inventario');
                        }
                    }
                }
                return true;
            } else {
                // es una entrada
                for (let product of productData) {
                    if (product.isComposite===true) {
                        if (product.ingredients){
                            for (let ingredient of product.ingredients) {
                                const ingredientStock = await Ingredient.findByPk(ingredient.id);
                                //throw new Error(`oldProducts ${JSON.stringify(product.OrderProduct.quantity, null, 2)}`);
    
                                // Actualizar el stock del ingrediente
    
    
                                const quantity = product.OrderProduct?.quantity || product.quantity;
                                ingredientStock.stock = Number(ingredientStock.stock )+Number(ingredient.ProductIngredient.quantity) * Number(quantity);
    
                                await ingredientStock.save();
                
                                // Crear movimiento de inventario
                                const movement = await InventoryMovement.create({
                                    userId: userId,
                                    ingredientId: ingredient.id,
                                    quantity: Number(ingredient.ProductIngredient.quantity) * Number(quantity),
                                    type: 'entrada', // Tipo de movimiento: salida
                                    concept: flag 
                                    ? `Entrada de inventario por creación de la orden ${orderId}` 
                                    : `Entrada de inventario por modificación de la orden ${orderId}`,
                                    totalPrice: Number(ingredient.ProductIngredient.quantity) * Number(quantity) * Number(ingredientStock.averagePrice),
                                });
                
                                if (!movement) {
                                    throw new Error('Error creando movimiento de inventario');
                                }
                            }
                        }
                    } else {
                        // es un producto simple
                        const productStock = await Product.findByPk(product.id);
                        // Calcular la cantidad a deducir del stock del producto
                        const quantityToDeduct = product.quantity;
                        // Actualizar el stock del producto
                        productStock.stock = Number(productStock.stock)+quantityToDeduct;
                        await productStock.save();
            
                        const movement = await ProductInventoryMovement.create({
                            userId: userId,
                            productId: product.id,
                            quantity: quantityToDeduct,
                            type: 'entrada', // Tipo de movimiento: entrada
                            concept: flag 
                                    ? `Entrada de inventario por creación de la orden ${orderId}` 
                                    : `Entrada de inventario por modificación de la orden ${orderId}`,
                            totalPrice: quantityToDeduct * Number(productStock.averagePrice),
                        });
                        if (!movement) {
                            throw new Error('Error creando movimiento de inventario');
                        }
                    }
                }
                return true;
            }
            
        }
       
    }
    
};