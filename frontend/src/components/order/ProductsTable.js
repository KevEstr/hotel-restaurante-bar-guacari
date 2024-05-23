import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

/* components */
import LoaderHandler from "../loader/LoaderHandler";
import Pagination from "../Pagination";
import Search from "../Search";
import { BigSpin } from "../loader/SvgLoaders";

/* actions */
import { listProducts } from "../../actions/productActions";

import "../../../src/utils/menu.css"
import LinesEllipsis from "react-lines-ellipsis";



const ProductsTable = ({
    productsInOrder,
    setProductsInOrder,
    productsAlreadyOrdered,
}) => {
    //add product to order
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [products, setProducts] = useState([]);

    const addProduct = (e, product) => {
        e.preventDefault();

        //product object
        const productIn = {
            id: product.id,
            name: product.name,
            price: product.price,
            stock: product.stock,
            quantity: 1,
        };
        //if is already in order
        if (!inOrder(productIn, productsInOrder)) {
            setProductsInOrder([...productsInOrder, productIn]);
        } else {
            alert("Producto ya está en la órden");
        }
    };

    //product list state
    const productList = useSelector((state) => state.productList);
    const {
        loading: loadingProductList,
        error: errorProductList,
        products: productsFromState,
        page,
        pages,
    } = productList;

    useEffect(() => {
        dispatch(listProducts(keyword, pageNumber));
    }, [keyword, pageNumber]);

    useEffect(() => {
        if (productsFromState) {
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

    //refresh products table
    const refreshProducts = (e) => {
        e.preventDefault();
        dispatch(listProducts(keyword, pageNumber));
    };

    //check stock to show
    const showStock = (product) => {
        const productInOrder = productsInOrder.find(
            (productIn) => productIn.id === product.id
        );
        if (productInOrder) return product.stock - productInOrder.quantity;
        return product.stock;
    };

    const mapProducts = (productsToMap) => {
        if (!productsAlreadyOrdered) return productsToMap;

        const mappedProducts = productsToMap.map((item) => {
            productsAlreadyOrdered.map((item2) => {
                if (item.id === item2.id) {
                    item.stock = item.stock + item2.quantity;
                }
            });
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
       // Obtener todas las categorías únicas de los productos
       const uniqueCategories = [...new Set(products.map(product => product.category.name))];

       return (
           <div className="row" style={{ overflowY: 'auto', maxHeight: '600px'}}>
               {uniqueCategories.map(category => (
                   <div key={category} className="col-md-12">
                       <h2>{category}</h2> {/* Título de la categoría */}
                       <div className="row">
                           {products.map(product => {
                               if (product.category.name === category) {
                                   // Calcula el tamaño de la columna en función del número de productos en la fila
                                   const columnSize = Math.max(Math.floor(12 / Math.min(products.length, 7)), 2);
                                   return (
                                       <div key={product.id} className={`col-md-${columnSize}`}>
                                           {/* Aquí colocas la lógica de renderizado de cada producto */}
                                           {inOrder(product, productsInOrder) ? (
                                               <button disabled className={`product-name-${getCategoryBackgroundClass(product.category.name)}`}>
                                                   <div className="button-content">
                                                       <p>
                                                           {product.name}
                                                       </p>
                                                       <h4>
                                                           En la orden
                                                       </h4>
                                                       <p>
                                                        Inventario: {product.stock}
                                                    </p>
                                                   </div>
                                               </button>
                                           ) : product.stock > 0 ? (
                                               <button
                                                   className={`product-name-${getCategoryBackgroundClass(product.category.name)}`}
                                                   onClick={(e) => addProduct(e, product)}
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
                                                   <p>
                                                        Inventario: {product.stock}
                                                    </p>
                                                   
                                                </div>
                                                   
                                               </button>
                                           ) : (
                                               <button disabled className={`product-name-${getCategoryBackgroundClass(product.category.name)}`}>
                                                   Sin inventario
                                               </button>
                                           )}
                                       </div>
                                   );
                               }
                               return null; // Devuelve null si el producto no pertenece a la categoría actual
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