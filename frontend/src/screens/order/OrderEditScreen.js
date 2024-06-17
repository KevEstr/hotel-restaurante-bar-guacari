import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Form components */
import Textarea from "../../components/form/Textarea";
import Checkbox from "../../components/form/Checkbox";

/* Order Components */
import ProductsTable from "../../components/order/ProductsTable";
import OrderInfo from "../../components/order/OrderInfo";
import Select from "../../components/Select";
import OrderCart from "../../components/order/OrderCart";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    ORDER_DETAILS_RESET,
    ORDER_UPDATE_RESET,
} from "../../constants/orderConstants";

/* Actions */
import { listOrderDetails, updateOrder } from "../../actions/orderActions";
import { listClients } from "../../actions/clientActions";
import { listTables } from "../../actions/tableActions";
import { listUsers, register } from "../../actions/userActions";


const OrderEditScreen = ({ history, match }) => {
    const orderId = parseInt(match.params.id);

    const [table, setTable] = useState(null);
    const [total, setTotal] = useState(0);
    const [client, setClient] = useState(null);
    const [delivery, setDelivery] = useState(false);
    const [note, setNote] = useState("");
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [productsAlreadyOrdered, setProductsAlreadyOrdered] = useState([]);
    const [errors, setErrors] = useState({});
    const [ingredientStocks, setIngredientStocks] = useState({});
    const [productStocks, setProductStocks] = useState({});
    const [user, setUser] = useState(null);



    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //order details state
    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const tableList = useSelector((state) => state.tableList);
    const { tables } = tableList;

    const userList = useSelector((state) => state.userList);
    const { loading:usersLoading, error:usersError, users, page, pages } = userList;

    

    //order edit state
    const orderUpdate = useSelector((state) => state.orderUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = orderUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: ORDER_UPDATE_RESET });
            dispatch({ type: ORDER_DETAILS_RESET });
            if (delivery) {
                history.push("/delivery");
            } else {
                history.push("/active");
            }
        }
    }, [successUpdate]);

    useEffect(() => {
        //load order
        if (order) {
            console.log("ORDEN PREVIA: ",order)
            if (!order.id || order.id !== orderId) {
                dispatch(listOrderDetails(orderId));
                //dispatch(listUsers());
                
            } else {
                //set states
                setTable(order.table ? order.table.id : null);
                setClient(order.client ? order.client.id : null);
                setNote(order.note ? order.note : note);
                setDelivery(order.delivery ? order.delivery : delivery);
                setUser(order.user.id? order.user.id : null)
                console.log("Usuarios: ", users)

                if (order.products) {
                    /* Format products */
                    console.log("Productos en la orden",order.products)
                    console.log("Orden ",order )
                    const products = order.products.map((product) => {
                        return {
                            ...product,
                            quantity: product.OrderProduct.quantity,
                            note: product.OrderProduct.note,
                        };
                    });

                    /* Set products state */
                    setProductsInOrder(products);
                    setProductsAlreadyOrdered(products);
                }
            }
        }
    }, [dispatch, history, order, orderId]);

    const handleSubmit = (e) => {
        e.preventDefault();
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

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            // Crear un array para almacenar los productos con sus ingredientes
            const productsWithIngredients = productsInOrder.map((product) => {
                // Verificar si el producto tiene ingredientes
                if (product.ingredients && product.ingredients.length > 0) {
                    // Si el producto tiene ingredientes, realizar el mismo proceso que antes
                    const ingredientsWithQuantities = product.ingredients.map((ingredient) => {
                        const quantityUsed = ingredient.ProductIngredient.quantity;
                        return {
                            ingredientId: ingredient.id,
                            quantity: quantityUsed
                        };
                    });
        
                    return {
                        productId: product.id,
                        quantity: product.quantity,
                        ingredients: ingredientsWithQuantities
                    };
                } else {
                    // Si el producto no tiene ingredientes, simplemente retornar la información básica del producto
                    return {
                        productId: product.id,
                        quantity: product.quantity
                    };
                }
            });
        
            const order = {
                id: orderId,
                total: total,
                tableId: !delivery ? table : null,
                clientId: client,
                products: productsInOrder,
                delivery: delivery,
                note: note,
                userId: user,
            };
            console.log("ORDEN A ACTUALIZAR: ",order)
            dispatch(updateOrder(order));
        }
    };

    const filterFreeTables = () => {
        const mappedTables = tables.filter((tableItem) => {
            /* return if table is not occupied OR if the same from order */
            return tableItem.occupied === false || tableItem.id === table;
        });
        return mappedTables;
    };

    const renderProductsTable = () => (
        <ProductsTable
            productsInOrder={productsInOrder}
            productsAlreadyOrdered={productsAlreadyOrdered}
            setProductsInOrder={setProductsInOrder}
            setIngredientStocks={setIngredientStocks}
            ingredientStocks={ingredientStocks}
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
                setIngredientStocks={setIngredientStocks}
                ingredientStocks={ingredientStocks}
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
        dispatch(listClients(e.target.value,"",true));
    };

    const searchUsers = (e) => {
        dispatch(listUsers(e.target.value,"",true));
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
                items={users.filter(user => user.roleId!==1 && user.roleId!==null)}
                search={searchUsers}
            />
            {errors.user && (
                <Message message={errors.user} color={"warning"} />
            )}
        </>
    );

    const renderDeliveryCheckbox = () => (
        <Checkbox name={"delivery"} data={delivery} setData={setDelivery} />
    );

    const renderNoteTextarea = () => (
        <Textarea
            title={"Note (optional)"}
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
            Submit
        </button>
    );

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

export default OrderEditScreen;
