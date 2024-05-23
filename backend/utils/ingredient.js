const Product = require("../models").Product;
const Ingredient = require("../models").Ingredient;

/* check stock of each ingredient */
exports.ingredientStock = async (list) => {
    for (let index = 0; index < list.length; index++) {
        const ingredientSearched = await Ingredient.findByPk(list[index].id);
        if (ingredientSearched.stock < list[index].quantity) {
            return false;
        }
    }
    return true;
};

/* Add ingredients in order 
exports.addIngredientsInProduct = async (product, ingredients) => {
    ingredients.forEach(async (ingredient) => {
        await product.addIngredient(ingredient.id, {
            through: { quantity: ingredient.quantity },
        });
    });
};*/

exports.addIngredientsInProduct = async (product, ingredients) => {
    const productId = product.id; // Asumiendo que `product` tiene un `id` propiedad.
    for (const ingredient of ingredients) {
        await addIngredientToProduct(productId, ingredient.id, ingredient.quantity);
    }
};

const addIngredientToProduct = async (productId, ingredientId, quantity) => {
    // Aquí va la lógica para añadir el ingrediente al producto en la base de datos.
    // Por ejemplo:
    await productingredient.create({
        productId: productId,
        ingredientId: ingredientId,
        quantity: quantity
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
