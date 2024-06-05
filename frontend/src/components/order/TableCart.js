import React, { useState, useEffect  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { listProducts, listProductDetails } from "../../actions/productActions";
import { listAllIngredients } from "../../actions/ingredientActions";

const TableCart = () => {
    const [ingredientStocks, setIngredientStocks] = useState({});
    const dispatch = useDispatch();
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [productStocks, setProductStocks] = useState({});

    useEffect(() => {
        dispatch(listAllIngredients());
        dispatch(listProducts());
    }, [dispatch]);

    const ingredientList = useSelector((state) => state.ingredientList);
    const { ingredients } = ingredientList;

    const productList = useSelector((state) => state.productList);
    const { products: productsFromState } = productList;

    useEffect(() => {
        if (ingredients.length > 0) {
            const stocks = {};
            ingredients.forEach((ingredient) => {
                stocks[ingredient.id] = ingredient.stock;
            });
            setIngredientStocks(stocks);
        }
    }, [ingredients]);

    useEffect(() => {
        if (productsFromState.length > 0) {
            const stocks = {};
            productsFromState.forEach((product) => {
                stocks[product.id] = product.stock;
            });
            setProductStocks(stocks);
        }
    }, [productsFromState]);
    return (
        <div>
            <ProductsTable
                ingredientStocks={ingredientStocks}
                setIngredientStocks={setIngredientStocks}
                productStocks={productStocks}
                setProductStocks={setProductStocks}
            />
            <OrderCart
                ingredientStocks={ingredientStocks}
                setIngredientStocks={setIngredientStocks}
                productStocks={productStocks}
                setProductStocks={setProductStocks}
            />
        </div>
    );
};

export default TableCart;