import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

/* components */
import LoaderHandler from "../loader/LoaderHandler";
import Pagination from "../Pagination";
import Search from "../Search";
import { BigSpin } from "../loader/SvgLoaders";

/* actions */
import { listProducts, listProductDetails  } from "../../actions/productActions";
import { listAllIngredients  } from "../../actions/ingredientActions";

import {
    PRODUCT_UPDATE_RESET,
    PRODUCT_DETAILS_RESET,
} from "../../constants/productConstants";

import "../../../src/utils/menu.css"
import LinesEllipsis from "react-lines-ellipsis";



const ProductsTable = ({
    productsInOrder,
    setProductsInOrder,
    productsAlreadyOrdered,
    selectedCategory,
    ingredientStocks, 
    setIngredientStocks,
    productStocks,
    setProductStocks,
}) => {
    //add product to order
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [products, setProducts] = useState([]);
    const [productToAdd, setProductToAdd] = useState(null);

     //product details state
     const productDetails = useSelector((state) => state.productDetails);
     const {  product } = productDetails;

    const ingredientList = useSelector((state) => state.ingredientList);
    const { loading, error, ingredients } = ingredientList;    


    const checkCompositeStock = async (product) => {
        let stockAvailable = true;

        if(product.isComposite){
            if (stockAvailable) {
                // Update ingredient stocks in state
                const updatedStocks = { ...ingredientStocks };
                console.log("TABLE ingredientStocks ", ingredientStocks)
                for (const ingredient of product.ingredients) {
                    const ingredientId = ingredient.ProductIngredient.ingredientId;
                    const quantity = Number(ingredient.ProductIngredient.quantity);
                    console.log("TABLE ingredientStocks[ingredientId] ",ingredientStocks[ingredientId])
                    if (updatedStocks[ingredientId] < quantity) {
                        stockAvailable = false;
                        return false;
                    } else {
                        updatedStocks[ingredientId] = Number(ingredientStocks[ingredientId]) - Number(quantity);
                    }
                }
                setIngredientStocks(updatedStocks);
            }
        }
        
        return stockAvailable;
    };

    const addProduct = async (e, product) => {
        e.preventDefault();
        console.log("TABLE productDetails: ",productDetails)
        if (product.isComposite) {
            let isStockAvailable = await checkCompositeStock(product);
            if (!isStockAvailable) {
                alert("No hay suficiente stock de ingredientes.");
                return;
            }
            setProductToAdd(product);
            dispatch(listProductDetails(product.id));
            
        }
        else {
            if (productStocks[product.id] < 1) {
                alert("No hay suficiente stock de este producto.");
                return;
            }
            const updatedStocks = { ...productStocks };
            updatedStocks[product.id] -= 1;
            setProductStocks(updatedStocks);
            setProductToAdd(product);
            dispatch(listProductDetails(product.id));
        }
        
    };

    const productList = useSelector((state) => state.productList);
    const {
        loading: loadingProductList,
        error: errorProductList,
        products: productsFromState,
        page,
        pages,
    } = productList;

    useEffect(() => {
        dispatch(listAllIngredients());
        dispatch(listProducts());
    }, [dispatch]);

    /*useEffect(() => {
        if (productsFromState.length > 0) {
            setProducts(mapProducts(productsFromState));
        }
    }, [productsFromState]);*/

    useEffect(() => {
        if (productsFromState.length > 0) {
            const stocks = {};
            productsFromState.forEach((product) => {
                stocks[product.id] = Number(product.stock);
            });
            setProductStocks(stocks);
            setProducts(mapProducts(productsFromState));
        }
    }, [productsFromState]);

    useEffect(() => {
        if (ingredients.length > 0) {
            const stocks = {};
            ingredients.forEach((ingredient) => {
                stocks[ingredient.id] = Number(ingredient.stock);
            });
            setIngredientStocks(stocks);

            console.log("TABLE Variable ingredientStocks: ",ingredientStocks);


        }
    }, [ingredients]);
   

    useEffect(() => {
        if (productToAdd && product && productToAdd.id === product.id) {
            const productIn = {
                id: product.id,
                name: product.name,
                price: product.price,
                isComposite: product.isComposite,
                ingredients: product.isComposite
                    ? product.ingredients.map(ingredient => ({
                        ...ingredient,
                        ProductIngredient: {
                            productId: product.id,
                            ingredientId: ingredient.id,
                            quantity: ingredient.ProductIngredient.quantity,
                        },
                    }))
                    : [],
                quantity: 1,
            };
            if (!inOrder(productIn, productsInOrder)) {
                setProductsInOrder([...productsInOrder, productIn]);
            } else {
                alert("Producto ya está en la órden");
            }
            setProductToAdd(null);
        }
    }, [product, productToAdd, productsInOrder, setProductsInOrder]);


    useEffect(() => {
        let allProducts = dispatch(listProducts(keyword, pageNumber));
        console.log("TABLE ALL PRODUCTS: ",allProducts)
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch,keyword, pageNumber]);

    useEffect(() => {
        if (productsFromState) {
            console.log("TABLE productsFromState", productsFromState)
            setProducts(mapProducts(productsFromState));
        }
    }, [productsFromState]);

    //check if product is already in order
    const inOrder = (obj, list) => {
        for (let index = 0; index < list.length; index++) {
            if (obj.id === list[index].id) {
                return list[index];
            }
        }
        return false;
    };

    const filteredProducts = selectedCategory 
        ? products.filter(product => product.category.name === selectedCategory) 
        : products;

    //refresh products table
    const refreshProducts = (e) => {
        e.preventDefault();
        dispatch(listProducts(keyword, pageNumber));
    };

    const mapProducts = (productsToMap) => {
        // Mapea cada producto en la lista productsToMap sin modificar el stock.
        const mappedProducts = productsToMap.map((item) => {
            // Devuelve cada producto tal como está sin ningún cambio.
            return item;
        });
        return mappedProducts;
    };
    

    const renderRefreshButton = () => (
        <button className="btn btn-info float-right" onClick={refreshProducts}>
            <i className="fas fa-sync-alt"></i>
        </button>
    );

    const getCategoryBackgroundClass = (category) => {
        switch (category) {
            case 'CERVEZAS':
                return 'category1-background'; // Clase CSS para la primera categoría
            case 'HAMBURGUESAS':
                return 'category2-background'; // Clase CSS para la segunda categoría
            case 'GASEOSAS':
                return 'category3-background'; // Clase CSS para la tercera categoría
            // Agrega más casos según sea necesario para otras categorías
            default:
                return ''; // Si no hay una categoría definida, no se aplica ningún color de fondo
        }
    };

    const renderProducts1 = () => {
        const uniqueCategories = [...new Set(products.map(product => product.category.name))];
    
        return (
            <div className="row" style={{ overflowY: 'auto', maxHeight: '600px'}}>
                {uniqueCategories.map(category => (
                    <div key={category} className="col-md-12">
                        <h2>{category}</h2>
                        <div className="row">
                            {filteredProducts.map(product => {
                                if (product.category.name === category) {
                                    const columnSize = Math.max(Math.floor(12 / Math.min(products.length, 7)), 2);
                                    const isInOrder = inOrder(product, productsInOrder);
                                    return (
                                        <div key={product.id} className={`col-md-${columnSize}`}>
                                            <button
                                                className={`product-name-${getCategoryBackgroundClass(product.category.name)}`}
                                                onClick={(e) => addProduct(e, product)}
                                                disabled={isInOrder}
                                            >
                                                <div className="button-content">
                                                    <h4>
                                                        <LinesEllipsis
                                                            text={product.name}
                                                            maxLine={3}
                                                            ellipsis="..."
                                                            trimRight
                                                            basedOn="letters"
                                                        />
                                                    </h4>
                                                    {isInOrder && (
                                                        <p>En la orden</p>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                    </div>
                ))}
            </div>
        );
    };







    

    return (
        <>
            {renderRefreshButton()}
            <Search
                keyword={keyword}
                setKeyword={setKeyword}
                setPage={setPageNumber}
            />
            <LoaderHandler
                loading={loadingProductList}
                error={errorProductList}
                render={renderProducts1}
                loader={<BigSpin />}
            />
        </>
    );
};

export default ProductsTable;