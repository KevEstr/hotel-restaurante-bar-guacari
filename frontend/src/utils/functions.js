exports.capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

exports.checkCompositeStock = async (product, ingredientStocks) => {
    let stockAvailable = true;
    if (stockAvailable) {
        // Update ingredient stocks in state
        const updatedStocks = { ...ingredientStocks };

        for (const ingredient of product.ingredients) {
            const ingredientId = ingredient.ProductIngredient.ingredientId;
            const quantity = ingredient.ProductIngredient.quantity;
            console.log("ingredientId: ", ingredientId);
            console.log("productIngredient quantity: ", quantity);
            console.log("ingredientStocks[ingredientId] ", ingredientStocks[ingredientId]);
            if (updatedStocks[ingredientId] < quantity) {
                stockAvailable = false;
                return false;
            } else {
                updatedStocks[ingredientId] = ingredientStocks[ingredientId] - quantity;
            }
        }
        console.log("updatedStocks: ", updatedStocks);
    }
    return stockAvailable;
};
