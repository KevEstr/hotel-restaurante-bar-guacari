import React from "react";
import Input from "../form/Input";

const IngredientsCart = ({ ingredientsInOrder=[], setIngredientsInOrder }) => {
    //remove ingredient from order
    const removeIngredient = (e, ingredient) => {
        e.preventDefault();

        //remove ingredient
        const ingredientsIn = ingredientsInOrder.filter(function (item) {
            return item.id !== ingredient.id;
        });

        setIngredientsInOrder(ingredientsIn);
    };

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
    
    const handleQuantityChange = (e, ingredientIn) => {
        const newQuantity = e.target.value;
    
        const newIngredients = ingredientsInOrder.map((ingredient) =>
            ingredient.id === ingredientIn.id
                ? { ...ingredient, quantity: Number(newQuantity) }
                : ingredient
        );
    
        setIngredientsInOrder(newIngredients);
    };

    return (
        <>
            <table
                id="orderTable"
                className="table table-bordered table-hover text-center"
            >
                <thead>
                    <tr><th>Ingrediente</th>
                        <th>Cantidad</th>
                        <th className="d-none d-sm-table-cell">¿Eliminar?</th>
                    </tr>
                </thead>
                <tbody>{renderCart()}</tbody>
            </table>
        </>
    );
};

export default IngredientsCart;
