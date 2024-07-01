import React from "react";

const IngredientsCart = ({ ingredientsInOrder = [], setIngredientsInOrder }) => {
    // Remove ingredient from order
    const removeIngredient = (e, ingredient) => {
        e.preventDefault();

        // Remove ingredient
        const ingredientsIn = ingredientsInOrder.filter(item => item.id !== ingredient.id);

        setIngredientsInOrder(ingredientsIn);
    };

    // Handle quantity change
    const handleQuantityChange = (e, ingredientIn) => {
        const newQuantity = e.target.value;
        
        const updatedIngredients = ingredientsInOrder.map(ingredient =>
            ingredient.id === ingredientIn.id
                ? { ...ingredient, quantity: Number(newQuantity) }
                : ingredient
        );

        setIngredientsInOrder(updatedIngredients);
    };

    // Render cart
    const renderCart = () => (
        <>
            {ingredientsInOrder.length > 0 &&
                ingredientsInOrder.map((ingredientIn, i) => (
                    <tr key={i}>
                        <td>{ingredientIn.name}</td>
                        <td className="d-flex justify-content-around">
                            <input
                                type="number"
                                className="form-control"
                                value={ingredientIn.quantity}
                                onChange={(e) => handleQuantityChange(e, ingredientIn)}
                            />
                        </td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => removeIngredient(e, ingredientIn)}
                            >
                                X
                            </button>
                        </td>
                    </tr>
                ))}
        </>
    );

    return (
        <table id="orderTable" className="table table-bordered table-hover text-center">
            <thead>
                <tr>
                    <th>Ingrediente</th>
                    <th>Cantidad</th>
                    <th className="d-none d-sm-table-cell">¿Eliminar?</th>
                </tr>
            </thead>
            <tbody>{renderCart()}</tbody>
        </table>
    );
};

export default IngredientsCart;
