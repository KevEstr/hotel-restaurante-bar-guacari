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
    setSelectedCategory,
    ingredientStocks, 
    setIngredientStocks,
    productStocks,
    setProductStocks,
    type,
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
        setProductToAdd(product);
        dispatch(listProductDetails(product.id));
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
        dispatch(listProducts(null, null, type, null));
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
            //setProductStocks(stocks);
            setProducts(mapProducts(productsFromState));
        }
    }, [productsFromState]);

    /*useEffect(() => {
        if (ingredients.length > 0) {
            const stocks = {};
            ingredients.forEach((ingredient) => {
                stocks[ingredient.id] = Number(ingredient.stock);
            });
            setIngredientStocks(stocks);

            console.log("TABLE Variable ingredientStocks: ",ingredientStocks);


        }
    }, [ingredients]);*/
   

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
        let allProducts = dispatch(listProducts(keyword, pageNumber, type));
        console.log("TABLE ALL PRODUCTS: ",allProducts)
        dispatch(listProducts(keyword, null, type, pageNumber));
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
        dispatch(listProducts(keyword, null, type, pageNumber));
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
                return 'category-cervezas-background';
            case 'HAMBURGUESAS':
                return 'category-hamburguesas-background'; 
            case 'GASEOSAS':
                return 'category-gaseosas-background'; 
            case 'PIZZAS':
                return 'category-pizza-background';
            case 'EMPANADAS':
                return 'category-empanadas-background';
            default:
                return '';
        }
    };

    const renderProducts1 = () => {
        const uniqueCategories = [...new Set(products.map(product => product.category.name))];
        const filteredProductsByCategory = selectedCategory ? filteredProducts.filter(product => product.category.name === selectedCategory) : filteredProducts;
    
        return (
            <div className="row" style={{ overflowY: 'auto', maxHeight: '600px' }}>
                {uniqueCategories.map(category => (
                    filteredProductsByCategory.length > 0 && filteredProductsByCategory.some(product => product.category.name === category) && (
                        <div key={category} className="col-md-12 mb-4">
                            <h2 style={{ marginBottom: '20px', marginTop: '20px'}}>{category}</h2>
                            <div className="row">
                                {filteredProductsByCategory.map(product => {
                                    if (product.category.name === category) {
                                        const isInOrder = inOrder(product, productsInOrder);
                                        return (
                                            <div key={product.id} className="col-md-3 d-flex justify-content-center mb-3">
                                                <button
                                                    className={`btn ${getCategoryBackgroundClass(product.category.name)}`}
                                                    onClick={(e) => addProduct(e, product)}
                                                    disabled={isInOrder}
                                                    style={{
                                                        width: '300px', // Ajusta este valor al tamaño deseado
                                                        height: '200px', // Ajusta este valor al tamaño deseado
                                                        margin: '1px', // Espaciado entre los cuadros
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textAlign: 'center',
                                                        border: '1px solid #ddd',
                                                        borderRadius: '5px',
                                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    }}
                                                >
                                                    <div className="button-content">
                                                        <h4 style={{ fontSize: '24px', lineHeight: '1.2', margin: '0', fontWeight: 'normal' }}>
                                                            <LinesEllipsis
                                                                text={product.name}
                                                                maxLine={3}
                                                                ellipsis="..."
                                                                trimRight
                                                                basedOn="letters"
                                                            />
                                                        </h4>
                                                        {isInOrder && (
                                                            <p style={{ fontSize: '12px', margin: '0' }}>En la orden</p>
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
                    )
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
