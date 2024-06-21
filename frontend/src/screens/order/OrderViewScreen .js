import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import ViewBox from "../../components/ViewBox";
import LoaderHandler from "../../components/loader/LoaderHandler";
import ModalButton from "../../components/ModalButton";
import { BigSpin } from "../../components/loader/SvgLoaders";
import generateInvoiceOrder from "../../utils/generateInvoiceOrder";

/* constants */
import { ORDER_UPDATE_RESET, ORDER_DELETE_RESET } from "../../constants/orderConstants";

/* actions */
import {
    listOrderDetails,
    updateOrderToPaid,
    deleteOrder,
    listOrdersClient,
} from "../../actions/orderActions";

import { listPayments } from '../../actions/paymentActions';

/* Styles */
import { modalStyles } from "../../utils/styles";

const OrderViewScreen = ({ history, match }) => {
    const orderId = parseInt(match.params.id);

    const dispatch = useDispatch();

    const [modal, setModal] = useState(false);

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    //order details state
    const orderDetails = useSelector((state) => state.orderDetails);
    const { loading, error, order } = orderDetails;

    const clientOrders = useSelector(state => state.clientOrders);
    const { loading: loadingOrders, error: errorOrders, orders: clientOrdersList } = clientOrders;

    const [paymentId, setPaymentId] = useState(null);

    const [reason, setReason] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const paymentList = useSelector((state) => state.paymentList);
    const { payments, error: errorPayments } = paymentList;

    //order edit state
    const orderUpdate = useSelector((state) => state.orderUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = orderUpdate;

    const orderDelete = useSelector((state) => state.orderDelete);
    const {
        loading: loadingDelete,
        success: successDelete,
        error: errorDelete,
    } = orderDelete;

    useEffect(() => {
        dispatch(listPayments());

        if (successUpdate || successDelete) {
            dispatch({ type: ORDER_UPDATE_RESET });
            dispatch({ type: ORDER_DELETE_RESET });
            if (order.delivery) {
                history.push("/delivery");
            } else {
                history.push("/active");
            }
        }
        if (order) {
            if (!order.id || order.id !== orderId) {
                dispatch(listOrderDetails(orderId));
            }
        }
    }, [dispatch, history, order, orderId, successUpdate, successDelete]);

    const renderModalPay = () => (
        <Modal
            style={modalStyles}
            isOpen={modal}
            onRequestClose={() => setModal(false)}
        >
            <h2 className="text-center">Pago de órden</h2>
            <p className="text-center">¿La órden ya fue pagada?</p>
            <form onSubmit={handlePay}>
                <label style={{ fontWeight: "normal", marginTop: '3px' }}>Ingrese el método de pago:</label>
                <div className="d-flex justify-content-between">
                    {payments.map(payment => (
                        <div key={payment.id} className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="paymentMethod"
                                id={`paymentMethod${payment.id}`}
                                value={payment.id}
                                checked={paymentId === payment.id}
                                onChange={() => setPaymentId(payment.id)}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={`paymentMethod${payment.id}`}
                            >
                                {payment.name}
                            </label>
                        </div>
                    ))}
                </div>
                <div style={{ marginTop: "25px" }}>
                    <button type="submit" className="btn btn-primary">
                        Finalizar.
                    </button>
                    <ModalButton
                        modal={modal}
                        setModal={setModal}
                        classes={"btn-danger float-right"}
                    />
                </div>
            </form>
        </Modal>
    );

    const handlePay = async (e) => {
        e.preventDefault();
        const updatedOrder = {
            id: orderId,
            paymentId: paymentId // Añadir el paymentId al actualizar la orden
        };
        setModal(false);
        dispatch(updateOrderToPaid(updatedOrder));

        const isCreditPayment = paymentId === 1;

        if (!isCreditPayment) {
            generateInvoiceOrder(order);
        }
    }

    const handleEdit = (e) => {
        e.preventDefault();
        history.push(`/order/${orderId}/edit`);
    };

    //get all order items
    const totalItems = (productsIn) => {
        return productsIn.reduce(
            (acc, item) => acc + item.OrderProduct.quantity,
            0
        );
    };

    const renderCartInfo = () =>
        order &&
        order.products && (
            <div className="small-box bg-info">
                <div className="inner">
                    <h3>TOTAL ${order.total}</h3>
                    <p>
                        {order.products.length > 0
                            ? totalItems(order.products)
                            : 0}{" "}
                        Items en la órden
                    </p>
                </div>
                <div className="icon">
                    <i className="fas fa-shopping-cart" />
                </div>
            </div>
        );
        const renderDeleteOrderButton = () => (
            <div className="card">
              <div className="card-header bg-danger">Eliminar Órden</div>
              <div className="card-body">
                <button className="btn btn-block" onClick={() => setShowDeleteModal(true)}>
                  <ViewBox
                    title={`ELIMINAR`}
                    paragraph={`Click para eliminar`}
                    icon={"fas fa-trash"}
                    color={"bg-danger"}
                  />
                </button>
              </div>
            </div>
          );

          const renderDeleteOrderModal = () => (
            <Modal
              style={modalStyles}
              isOpen={showDeleteModal}
              onRequestClose={() => setShowDeleteModal(false)}
            >
              <h2 className="text-center">Eliminar Órden</h2>
              <p className="text-center">Ingrese la razón por la que desea eliminar la órden:</p>
              <form onSubmit={handleDeleteOrder}>
                <div className="form-group">
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-danger">
                  Eliminar
                </button>
                <ModalButton
                  modal={showDeleteModal}
                  setModal={setShowDeleteModal}
                  classes={"btn-secondary float-right"}
                />
              </form>
            </Modal>
          );

        const handleDeleteOrder = () => {
            console.log('Intentando eliminar la orden');
            dispatch(deleteOrder(orderId, reason));
            setShowDeleteModal(false);
          };

    const renderOrderProducts = () => (
        <table
            id="orderTable"
            className="table table-bordered table-hover table-striped text-center table-overflow"
        >
            <thead>
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                {order &&
                    order.products &&
                    order.products.length > 0 &&
                    order.products.map((product) => (
                        <tr key={product.id}>
                            <td>{product.name}</td>
                            <td className="text-center h4">
                                <span className="badge bg-primary">
                                    {product.OrderProduct.quantity}
                                </span>
                            </td>
                            <td className="text-center h4">
                                <span className="badge bg-info">
                                    ${product.price}
                                </span>
                            </td>
                            <td className="text-center h4">
                                <span className={"badge bg-success"}>
                                    $
                                    {product.price *
                                        product.OrderProduct.quantity}{" "}
                                </span>
                            </td>
                        </tr>
                    ))}
            </tbody>
        </table>
    );

    const renderOrderInfo = () =>
        order && (
            <>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <ViewBox
                            title={order.id}
                            paragraph={"ÓRDEN ID"}
                            icon={"far fa-clipboard"}
                            color={"bg-info"}
                        />
                    </div>

                    {order.isPaid ? (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={"Pagada"}
                                paragraph={"Órden ya fue pagada."}
                                icon={"fas fa-check"}
                                color={"bg-success"}
                            />
                        </div>
                    ) : (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={"No pagada"}
                                paragraph={"Órden no ha sido pagada."}
                                icon={"far fa-times-circle"}
                                color={"bg-danger"}
                            />
                        </div>
                    )}

                    <div className="col-12 col-md-6">
                        {order.client && (
                            <ViewBox
                                title={order.client.name}
                                paragraph={`ID: ${order.client.id}`}
                                icon={"fas fa-user"}
                                color={"bg-info"}
                            />
                        )}
                    </div>

                    {order.table ? (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={order.table.name}
                                paragraph={`ID: ${order.table.id}`}
                                icon={"fas fa-utensils"}
                                color={"bg-info"}
                            />
                        </div>
                    ) : (
                        <div className="col-12 col-md-6">
                            {order.client && (
                                <ViewBox
                                    title={"Domicilio"}
                                    paragraph={order.client.address}
                                    icon={"fas fa-truck"}
                                    color={"bg-primary"}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="col-12">
                    <ViewBox
                        title={"Nota:"}
                        paragraph={order.note}
                        icon={"far fa-sticky-note"}
                        color={"bg-silver"}
                    />
                </div>
            </>
        );

    const renderOrderEdit = () => (
        <div className="card">
            <div className="card-header bg-warning">Editar Órden</div>
            <div className="card-body">
                <button className="btn btn-block" onClick={handleEdit}>
                    <ViewBox
                        title={`EDITAR`}
                        paragraph={`Click para editar`}
                        icon={"fas fa-edit"}
                        color={"bg-warning"}
                    />
                </button>
            </div>
        </div>
    );

    const renderOrderPay = () => (
        <div className="card">
            <div className="card-header bg-success">Pagar Órden</div>
            <div className="card-body">
                <button
                    className="btn btn-block"
                    onClick={() => setModal(true)}
                >
                    <ViewBox
                        title={`$${order.total}`}
                        paragraph={`Click para pagar`}
                        icon={"fas fa-hand-holding-usd"}
                        color={"bg-success"}
                    />
                </button>
            </div>
        </div>
    );

    const renderInfo = () => (
        <>  {console.log("order",order)}
            <div className="col-12 col-md-6">
                {renderCartInfo()}
                {renderOrderProducts()}
            </div>

            <div className="col-12 col-md-6">{renderOrderInfo()}</div>
        </>
    );

    const renderOrderButton = () => (
        <div className="col-12 col-md-3">
            {order && !order.isPaid && renderOrderEdit()}
        </div>
    );

    const renderPayButton = () => (
        <div className="col-12 col-md-3">
            {order && !order.isPaid && renderOrderPay()}
        </div>
    );

    

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Órdenes"} />
            <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
            <LoaderHandler loading={loadingDelete} error={errorDelete} />
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        {renderModalPay()}
                        <div className="col-12">
                            <ButtonGoBack history={history} />

                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Ver órden</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row d-flex justify-content-center">
                                        <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            render={renderInfo}
                                            loader={<BigSpin />}
                                        />
                                    </div>
                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                    </div>
                    {/* /.row */}
                    <div className="row d-flex justify-content-between">
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            render={renderOrderButton}
                            loader={<BigSpin />}
                        />
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            render={renderDeleteOrderButton}
                            loader={<BigSpin />}
                        />
                        <LoaderHandler
                            loading={loading}
                            error={error}
                            render={renderPayButton}
                            loader={<BigSpin />}
                        />
                        {renderDeleteOrderModal()}
                    </div>
                </div>
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default OrderViewScreen;
