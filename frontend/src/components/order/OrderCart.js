import Input from "../../components/form/Input";
import axios from "axios"; // Asegúrate de importar axios
import React, { useState, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listAllIngredients, listIngredientDetails  } from "../../actions/ingredientActions";
import { listProducts, listProductDetails } from "../../actions/productActions";


const OrderCart = ({ productsInOrder, setProductsInOrder, ingredientStocks, setIngredientStocks, productStocks,
    setProductStocks, }) => {
    const dispatch = useDispatch();

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState("");
    const ingredientList = useSelector((state) => state.ingredientList);
    const { loading, error, ingredients } = ingredientList;



    /*useEffect(() => {
        dispatch(listAllIngredients());
    }, [dispatch]);*/

    /*useEffect(() => {
        if (ingredients.length > 0) {
            const stocks = {};
            ingredients.forEach((ingredient) => {
                stocks[ingredient.id] = ingredient.stock;
            });
            setIngredientStocks(stocks);
            console.log("ingredientes de la base de datos: ",ingredients);
            console.log("stocks de los ingredientes de la base de datos: ",stocks);
            console.log("Variable ingredientStocks: ",ingredientStocks);


        }
    }, [ingredients]);*/



    const checkCompositeStock = async (product) => {
        let stockAvailable = true;
        if (stockAvailable) {
            // Update ingredient stocks in state
            const updatedStocks = { ...ingredientStocks };

            for (const ingredient of product.ingredients) {
                const ingredientId = ingredient.ProductIngredient.ingredientId;
                const quantity = ingredient.ProductIngredient.quantity;
                console.log("ORDER CART ingredientStocks ",ingredientStocks)
                if (updatedStocks[ingredientId] < quantity) {
                    stockAvailable = false;
                    return false;
                } else {
                    updatedStocks[ingredientId] = Number(ingredientStocks[ingredientId]) - Number(quantity);
                }
            }
            console.log("updatedStocks: ",updatedStocks)
            setIngredientStocks(updatedStocks);
        }
        return stockAvailable;
    };

    //remove product from order
    const removeProduct = async(e, product) => {
        e.preventDefault();
        console.log("productsInOrder: ",productsInOrder)
        //remove product

        /*if (product.isComposite) {
            const updatedStocks = { ...ingredientStocks };

            for (const ingredient of product.ingredients) {
                const ingredientId = ingredient.ProductIngredient.ingredientId;
                const quantity = Number(ingredient.ProductIngredient.quantity);
                console.log("ORDER CART ingredientStocks[ingredientId] ",ingredientStocks[ingredientId])
                updatedStocks[ingredientId] = Number(ingredientStocks[ingredientId]) + Number(quantity);
            }
            console.log("updatedStocks: ",updatedStocks)
            setIngredientStocks(updatedStocks);
            const productsIn = productsInOrder.filter(function (item) {
                return item.id !== product.id;
            });
            setProductsInOrder(productsIn);

        }
        else{
            const updatedStocks = { ...productStocks };
            updatedStocks[product.id] += 1;
            setProductStocks(updatedStocks);
            dispatch(listProductDetails(product.id));
            const productsIn = productsInOrder.filter(function (item) {
                return item.id !== product.id;
            });
            setProductsInOrder(productsIn);
        }*/



        const productsIn = productsInOrder.filter(function (item) {
            return item.id !== product.id;
        });
        setProductsInOrder(productsIn);
        


        
    };

    //increase product quantiity
    const addUnit = async (e, product) => {
        e.preventDefault();

        /*if (product.isComposite) {
            let isStockAvailable = await checkCompositeStock(product);
            if (!isStockAvailable) {
                alert("No hay suficiente stock de ingredientes.");
                return;
            }
            const newProducts = productsInOrder.map((el) =>
                el.id === product.id ? { ...el, quantity: el.quantity + 1 } : el
            );
            setProductsInOrder(newProducts);
        }
        else{
            if (productStocks[product.id] < 1) {
                alert("No hay suficiente stock de este producto.");
                return;
            }
            const updatedStocks = { ...productStocks };
            updatedStocks[product.id] -= 1;
            setProductStocks(updatedStocks);
            dispatch(listProductDetails(product.id));
            const newProducts = productsInOrder.map((el) =>
                el.id === product.id ? { ...el, quantity: el.quantity + 1 } : el
            );
            setProductsInOrder(newProducts);
        }*/

        //dispatch(listProductDetails(product.id));
        const newProducts = productsInOrder.map((el) =>
            el.id === product.id ? { ...el, quantity: el.quantity + 1 } : el
        );
        setProductsInOrder(newProducts);
        
    }

    //decrease product quantity
    const removeUnit = (e, product) => {
        e.preventDefault();

        /*if(product.isComposite){
            const updatedStocks = { ...ingredientStocks };
            console.log("ORDER CART REMOVE ingredientStocks ",ingredientStocks)
            for (const ingredient of product.ingredients) {
                const ingredientId = ingredient.ProductIngredient.ingredientId;
                const quantity = Number(ingredient.ProductIngredient.quantity);
                updatedStocks[ingredientId] = Number(ingredientStocks[ingredientId]) + Number(quantity);
            }
            setIngredientStocks(updatedStocks);
            const newProducts = productsInOrder.map((el) =>
                el.id === product.id ? { ...el, quantity: el.quantity - 1 } : el
            );
            setProductsInOrder(newProducts);
        }
        else{
            const updatedStocks = { ...productStocks };
            updatedStocks[product.id] += 1;
            setProductStocks(updatedStocks);
            dispatch(listProductDetails(product.id));
            const newProducts = productsInOrder.map((el) =>
                el.id === product.id ? { ...el, quantity: el.quantity - 1 } : el
            );
            setProductsInOrder(newProducts);
        }*/

        const newProducts = productsInOrder.map((el) =>
            el.id === product.id ? { ...el, quantity: el.quantity - 1 } : el
        );
        setProductsInOrder(newProducts);
        
    };

    const handleNoteChange = async (e, product) => {
        const newNote = e.target.value;
        const newProducts = productsInOrder.map(el =>
            el.id === product.id ? { ...el, note: newNote } : el
        );
        setProductsInOrder(newProducts);
    };

    const renderCart = () => (
        <>
        {console.log("CART productsInOrder: ", productsInOrder)}
            {productsInOrder.length > 0 &&
                productsInOrder.map((productIn, i) => (
                    <tr key={i}>
                        <td>{productIn.name}</td>
                        <td>{productIn.quantity}</td>
                        <td className="d-flex justify-content-around">
                            <button
                                disabled={productIn.quantity < 2}
                                className="btn btn-danger"
                                onClick={(e) => removeUnit(e, productIn)}
                            >
                                -
                            </button>
                            <button
                                //disabled={productIn.isComposite ? false : productIn.quantity >= productIn.stock}
                                className="btn btn-primary"
                                onClick={(e) => addUnit(e, productIn)}
                            >
                                +
                            </button>
                        </td>
                        <td className="h6">
                            ${productIn.price * productIn.quantity}
                        </td>
                        <td>
                            <button
                                className="btn btn-danger"
                                onClick={(e) => removeProduct(e, productIn)}
                            >
                                X
                            </button>
                        </td>
                        <td>
                            <input
                                type="text"
                                value={productIn.note || ""}
                                onChange={e => handleNoteChange(e, productIn)}
                            />
                        </td>
                    </tr>
                ))}
        </>
    );

    return (
        <>
            <table
                id="orderTable"
                className="table table-bordered table-hover text-center"
            >
                <thead>
                    <tr><th>Producto</th>
                        <th>Unidades</th>
                        <th>Adicionar</th>
                        <th>Total</th>
                        <th className="d-none d-sm-table-cell">¿Eliminar?</th>
                        <th>Nota</th>
                    </tr>
                </thead>
                <tbody>{renderCart()}</tbody>
            </table>
        </>
    );
};

export default OrderCart;
