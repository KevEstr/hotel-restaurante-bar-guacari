import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";  // Actualizado


/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Form components */
import Textarea from "../../components/form/Textarea";
import Checkbox from "../../components/form/Checkbox";

/* Order components */
import ProductsTable from "../../components/order/ProductsTable";
import OrderInfo from "../../components/order/OrderInfo";
import Select from "../../components/Select";
import OrderCart from "../../components/order/OrderCart";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */

import { ORDER_CREATE_RESET } from "../../constants/orderConstants";

/* Actions */
import { listTables } from "../../actions/tableActions";
import { listClients } from "../../actions/clientActions";
import { createOrder, listProductDetails } from "../../actions/orderActions";

import { allTables } from "../../actions/tableActions"

import Table from "../../components/Table";
import Product from "../../components/Product";

import {
    OccupiedTableLoader,
    ProductLoader
} from "../../components/loader/SkeletonLoaders";

import generateOrder from "../../utils/generateOrder";

import { listProducts, createProduct } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";
import { listUsers, register } from "../../actions/userActions";

const OrderCreateScreen = ({ match }) => {
    const history = useHistory();  // Usando useHistory para la navegación
    /* Get table from url */
    const tableFromUrl = window.location.href.indexOf("table") !== -1;
    /* Get delivery from url */
    const deliveryFromUrl = window.location.href.indexOf("delivery") !== -1;

    const [table, setTable] = useState(
        tableFromUrl ? parseInt(match.params.id) : null
    );
    const [client, setClient] = useState(null);
    const [delivery, setDelivery] = useState(deliveryFromUrl);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [total, setTotal] = useState(0);
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [keyword, setKeyword] = useState("");
    const [ingredientStocks, setIngredientStocks] = useState({});
    const [productStocks, setProductStocks] = useState({});
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const tableList = useSelector((state) => state.tableList);
    const { tables } = tableList;

    const productList = useSelector((state) => state.productList);
    const { products } = productList;
    const { categories } = useSelector((state) => state.categoryList);
    
    //product details state
    const productDetails = useSelector((state) => state.productDetails);
    const { product: productDetailsData } = productDetails;

    //order create state
    const orderCreate = useSelector((state) => state.orderCreate);
    const { success, loading, error } = orderCreate;

    const userList = useSelector((state) => state.userList);
    const { loading:usersLoading, error:usersError, users, page, pages } = userList;

    useEffect(() => {
        dispatch(allTables());
    }, [dispatch, history, userInfo]);

    useEffect(() => {
        dispatch(listUsers());
        dispatch(listClients("", "", true)); // Load clients with reservation on mount
    }, [dispatch]);

    useEffect(() => {
        dispatch(allTables());
        dispatch(listCategories())
        console.log("clientes: ", clients)
        if (success) {
            dispatch({ type: ORDER_CREATE_RESET });
            if (delivery) {
                history.push("/delivery");
            } else {
                history.push("/active");
            }
        }
    }, [dispatch, history, success, error, keyword, selectedCategory]);

    const handleSubmit = (e) => {
        e.preventDefault();

        /* Set Errors */
        let errorsCheck = {};
        if (!table && !delivery) {
            errorsCheck.table = "Mesa es requerida";
        }
        if (!client) {
            errorsCheck.client = "Cliente es requerido";
        }

        if (productsInOrder.length < 1) {
            errorsCheck.products = "Órden no puede estar vacía";
        }
        if (!user) {
            errorsCheck.user = "Usuario es requerido";
        }

        /* Check errors */
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            console.log("USUARIO: ",user)
            console.log("Productos en la orden: ",productsInOrder)
            /* Create order */
            const order = {
                total: total,
                tableId: !delivery ? table : 0,
                clientId: client,
                products: productsInOrder,
                delivery: delivery,
                note: note,
                userId: user,
            };
            /* Make request */
            console.log("ORDEN A CREAR: ",order)

            dispatch(createOrder(order)).then((createdOrder) => {

                const newOrder = {
                    id: createdOrder.id, 
                    table: getTableName(createdOrder.tableId),
                    client: getClientName(createdOrder.clientId),
                    waiter: getUserName(createdOrder.userId),
                    date: new Date().toLocaleString(),
                    products: productsInOrder.map(product => ({
                        quantity: product.quantity,
                        name: product.name,
                        productNote: product.note
                    })),
                    note: note
                };
    
                generateOrder(newOrder);
            });


        }
    };

    const getTableName = (tableId) => {
        if (tables && tables.length > 0) {
          const table = tables.find((table) => table.id === tableId);
          return table ? table.name : '';
        }
        return '';
      };

      const getClientName = (clientId) => {
        if (clients && clients.length > 0) {
            const client = clients.find((client) => client.id === clientId);
            return client ? client.name : '';
        }
        return '';
    };
    
    const getUserName = (userId) => {
        if (users && users.length > 0) {
            const user = users.find((user) => user.id === userId);
            return user ? user.name : '';
        }
        return '';
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };
    
    /* Filter tables */
    const filterFreeTables = () => {
        const mappedTables = tables.filter((table) => {
            return table.occupied === false;
        });
        return mappedTables;
    };

    const handleCategoryFilter = (categoryName) => {
        setSelectedCategory(categoryName === selectedCategory ? null : categoryName);
    };
    
    const renderCategoryDropdown = () => (
        <div className="d-flex justify-content-between align-items-center">
            <h3 className="card-title mb-0">Crear órden</h3>
            <div className="dropdown">
                <button
                    className="btn btn-primary dropdown-toggle"
                    type="button"
                    onClick={toggleDropdown}
                >
                    Filtro
                </button>
                <div
                    className={`dropdown-menu dropdown-menu-right ${isDropdownOpen ? 'show' : ''}`}
                    style={{ minWidth: '200px' }}
                >
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            className={`dropdown-item ${
                                selectedCategory === category.id ? 'active' : ''
                            }`}
                            onClick={() => handleCategoryFilter(category.name)}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
    

    const renderProductsTable = () => (
        
        <ProductsTable
            productsInOrder={productsInOrder}
            setProductsInOrder={setProductsInOrder}
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory}
            keyword={keyword}
            setKeyword={setKeyword}
            ingredientStocks={ingredientStocks}
            setIngredientStocks={setIngredientStocks}
            productStocks={productStocks}
            setProductStocks={setProductStocks}
        />
    );

    const renderCart = () => (
        <>
            {errors.products && (
                <Message message={errors.products} color={"warning"} />
            )}
            <OrderInfo
                total={total}
                setTotal={setTotal}
                productsInOrder={productsInOrder}
            />
            <OrderCart
                productsInOrder={productsInOrder}
                setProductsInOrder={setProductsInOrder}
                ingredientStocks={ingredientStocks}
                setIngredientStocks={setIngredientStocks}
                productStocks={productStocks}
                setProductStocks={setProductStocks}
            />
        </>
    );

    const searchTables = (e) => {
        dispatch(listTables(e.target.value));
    };

    const renderTablesSelect = () => (
        <>
            <Select
                data={table}
                setData={setTable}
                items={filterFreeTables(tables)}
                disabled={delivery}
                search={searchTables}
            />
            {errors.table && (
                <Message message={errors.table} color={"warning"} />
            )}
        </>
    );

    const searchClients = (e) => {
        dispatch(listClients(e.target.value, "",true));
    };

    const renderClientsSelect = () => (
        <>
            <Select
                data={client}
                setData={setClient}
                items={clients.filter(client => client.has_reservation)}
                search={searchClients}
            />
            {errors.client && (
                <Message message={errors.client} color={"warning"} />
            )}
        </>
    );

    const renderUserSelect = () => (
        <>
            <Select
                data={user}
                setData={setUser}
                items={users.filter(user => user.roleId!==2 && user.roleId!==null)}
            />
            {errors.user && (
                <Message message={errors.user} color={"warning"} />
            )}
        </>
    );

    const renderDeliveryCheckbox = () => (
        <Checkbox name={"domicilio"} data={delivery} setData={setDelivery} />
    );

    const renderNoteTextarea = () => (
        <Textarea
            title={"Nota (opcional)"}
            rows={3}
            data={note}
            setData={setNote}
        />
    );

    const renderSubmitButton = () => (
        <button
            onClick={handleSubmit}
            className="btn btn-success btn-lg float-right "
        >
            Confirmar
        </button>
    );
    
    const productLoader = () => {
        let tableSkeleton = [];
        for (let i = 0; i < 16; i++) {
            tableSkeleton.push(
                <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
                    {" "}
                    <ProductLoader />{" "}
                </div>
            );
        }
        return tableSkeleton;
    };

    const filterTablesByState = (isOccupied) => {
        const mappedTables = tables.filter((table) => {
            return table.occupied === isOccupied;
        });
        return mappedTables;
    };

    const renderProducts = () =>
        products.map((product) => (
            <div key={product.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <Product product={product} />
            </div>
        ));

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Órdenes"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title"> </h3>
                                    {renderCategoryDropdown()}
                                    <Loader variable={loading} />
                                    <Message message={error} color={"danger"} />
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-lg-12">
                                            {renderProductsTable()}
                                            {console.log("Productos seleccionados: ",productsInOrder)}
                                        </div>
                                    </div>
                                    <div className="col-12 col-lg-12">
                                    {renderCart()}
                                    <hr />

            <div style={{marginTop: '40px'}}>
                <div className="row">
                    <div className="col-12 col-md-3">
                        Selecciona tu nombre:
                        <div className="form-group">
                            {renderUserSelect()}
                        </div>
                    </div>
                <div className="col-12 col-md-3">
                Selecciona la mesa:
                    <div className="form-group">
                        {renderTablesSelect()}
                    </div>
                </div>
                <div className="col-12 col-md-3">
                    Selecciona el cliente:
                    <div className="form-group">
                        {renderClientsSelect()}
                    </div>
                </div>

                <div className="col-12 col-md-3">
                    <div className="form-group" style={{marginTop:'30px', marginLeft:'10px'}}>
                        {renderDeliveryCheckbox()}
                    </div>
                </div>
                
            </div>

        <div className="row">
            <div className="col-12 col-md-12">
                    <div className="form-group">
                        {renderNoteTextarea()}
                    </div>
            </div>
        </div>
    </div>
</div>
{renderSubmitButton()}

                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default OrderCreateScreen;
