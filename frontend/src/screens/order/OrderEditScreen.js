import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
import { modalStyles } from "../../utils/styles";

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

import generateOrder from "../../utils/InvoicesRestaurant/generateOrder";

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
    const [prevTotal, setPrevTotal] = useState(0);

    const [client, setClient] = useState(null);
    const [delivery, setDelivery] = useState(false);
    const [note, setNote] = useState("");
    const [productsInOrder, setProductsInOrder] = useState([]);
    const [productsAlreadyOrdered, setProductsAlreadyOrdered] = useState([]);
    const [errors, setErrors] = useState({});
    const [ingredientStocks, setIngredientStocks] = useState({});
    const [productStocks, setProductStocks] = useState({});
    const [user, setUser] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState("Todas");
    const [categories, setCategories] = useState([]);  // Definimos el estado de categorías
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [modal, setModal] = useState(false);
    const [difference, setDifference] = useState(false);
    const [availableQuota, setAvailableQuota] = useState(false);
    const [concept, setConcept] = useState("");

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

    const categoryList = useSelector((state) => state.categoryList);
    const { categories: fetchedCategories } = categoryList;

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
        if (fetchedCategories && fetchedCategories.length > 0) {
            setCategories([{ id: "all", name: "Todas" }, ...fetchedCategories]);
        }
    }, [fetchedCategories]);

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
                setUser(order.userId? order.userId : null)
                setPrevTotal(order.total? order.total : null);
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

        const clientObj = clients.find((c) => c.id === client);
        console.log("clientObj: ", clientObj);
        if (clientObj.has_reservation && clientObj.reservation && clientObj.reservation.service.length > 0 && clientObj.agreementId !== 1 ) {
            const foodService = clientObj.reservation.service.find(service => service.id === 1);
            console.log("foodService: ", foodService);
            if (foodService && foodService.ReservationService.availableQuota < (total-prevTotal) && foodService.ReservationService.maxLimit !== 0) {
                // Calcular la diferencia
                const difference = (total-prevTotal) - foodService.ReservationService.availableQuota;
                console.log("difference: ", difference);
                console.log("prevTotal: ", prevTotal);
                console.log("total: ", total);

                // Mostrar el modal de confirmación de pago adicional
                setModal(true);
                setDifference(difference);
                setAvailableQuota(foodService.ReservationService.availableQuota) // Establecer la diferencia en el estado
                return; // Detener la función hasta que se confirme la acción
            }
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
        
            proceedWithOrder();
        }
    };

    const getModifiedProducts = () => {
        const modifiedProducts = productsInOrder.filter(product => {
            const originalProduct = productsAlreadyOrdered.find(p => p.id === product.id);
            return !originalProduct || originalProduct.quantity !== product.quantity || originalProduct.note !== product.note;
        });
        return modifiedProducts;
    };

    const proceedWithOrder = () => {
        console.log("USUARIO: ", user);
        console.log("Productos en la orden: ", productsInOrder);
    
        /* Create order */
        const newOrder = {
            id: orderId,
            total: total,
            tableId: !delivery ? table : 0,
            clientId: client,
            products: productsInOrder,
            delivery: delivery,
            note: note,
            userId: user,
            confirmExceedQuota: true,
            concept:concept,
        };
    
        /* Make request */
        console.log("ORDEN A CREAR: ", newOrder);
        console.log("CONCEPTO DE LA ORDEN: ", concept);
        dispatch(updateOrder(newOrder));

        const modifiedProducts = getModifiedProducts();
    
        // Llamar a generateOrder
        const orderDetails = {
            id: orderId,
            table: !delivery ? table : 0,
            client: client,
            waiter: user, // Asumiendo que el usuario es el mesero
            date: new Date().toLocaleString(), // O la fecha que corresponda
            products: modifiedProducts,
            note: note,
        };
    
        generateOrder(orderDetails, true);
    };

    const renderModalExceedQuota = () => (
        <Modal
            style={modalStyles}
            isOpen={modal}
            onRequestClose={() => setModal(false)}
        >
            <div className="modal-body">
            <p className="text-center">
                La orden excede el cupo disponible ${availableQuota} por ${difference}. ¿El cliente desea proceder y pagar la diferencia?
            </p>
            <div className="modal-footer">
                <button onClick={proceedWithOrder} className="btn btn-primary">
                    Confirmar
                </button>
                <button onClick={() => setModal(false)} className="btn btn-danger">
                    Cancelar
                </button>
            </div>
        </div>
        </Modal>
    );

    const handleCategoryFilter = (categoryName) => {
        setSelectedCategory(categoryName);
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
                                selectedCategory === category.name ? 'active' : ''
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

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
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
            selectedCategory={selectedCategory === "Todas" ? null : selectedCategory}
            setSelectedCategory={setSelectedCategory}
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
                items={users.filter(user => user.roleId !== 1 && user.roleId !== null)}
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

    const renderConceptChange = () => (
        <Textarea
            title={"Concepto por el cambio de la órden:"}
            rows={2}
            data={concept}
            setData={setConcept}
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
        <div className="row">
            <div className="col-12 col-md-12">
                    <div className="form-group">
                        {renderConceptChange()}
                    </div>
            </div>
        </div>
    </div>
</div>
{renderSubmitButton()}
{renderModalExceedQuota()}


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
