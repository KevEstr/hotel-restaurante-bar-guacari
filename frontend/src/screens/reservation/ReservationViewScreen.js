import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import ViewBox from "../../components/ViewBox";
import LoaderHandler from "../../components/loader/LoaderHandler";
import { BigSpin } from "../../components/loader/SvgLoaders";
import Modal from "react-modal";
import ModalButton from "../../components/ModalButton";
import { FormattedDate, FormattedTime } from "../../utils/formattedDate";
import { updateClientReservationStatus } from '../../actions/clientActions';

/* constants */
import { RESERVATION_UPDATE_RESET } from "../../constants/reservationConstants";
import { RESERVATION_DELETE_RESET } from "../../constants/reservationConstants";


/* actions */
import {
    listReservationsDetails,
    updateReservationToPaid,
    listReservationsByClient,
} from "../../actions/reservationActions";

import { deleteReservation } from '../../actions/reservationActions';

import { listAgreements } from '../../actions/agreementActions';

import { modalStyles } from "../../utils/styles";

import { listOrdersClient } from "../../actions/orderActions";

import { updateRoom } from "../../actions/roomActions";

import generateInvoice from "../../utils/InvoicesHotel/generateInvoice";

import { listPayments } from '../../actions/paymentActions';



const ReservationViewScreen = ({ history, match }) => {
    const reservationId = parseInt(match.params.id);
    const [paymentId, setPaymentId] = useState(null);
    const [totalPayment, setTotalPayment] = useState(0);
    const [hasActiveOrders, setHasActiveOrders] = useState(false);
    const [showWarningModal, setShowWarningModal] = useState(false);
    const [paymentMethodName, setPaymentMethodName] = useState('');

    const dispatch = useDispatch();

    //order details state
    const reservationDetails = useSelector((state) => state.reservationDetails);
    const { loading, error, reservation } = reservationDetails;
    const [modal, setModal] = useState(false);

    const reservationDelete = useSelector((state) => state.reservationDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = reservationDelete;
      
    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments, error: errorPayments } = paymentList;

    const [reason, setReason] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteReservation = () => {
        console.log('Intentando eliminar la reservación');
        dispatch(deleteReservation(reservationId, reason));
        setShowDeleteModal(false);
      };

      const handlePaymentMethodChange = (paymentId, paymentName) => {
        setPaymentId(paymentId);
        setPaymentMethodName(paymentName);
    };
      
    const clientReservations = useSelector(state => state.clientReservations);
    const { reservations: clientReservationsList } = clientReservations;

    // Estado de las órdenes asociadas al cliente específico
    const clientOrders = useSelector(state => state.clientOrders);
    const { loading: loadingOrders, error: errorOrders, orders: clientOrdersList } = clientOrders;

    //order edit state
    const reservationUpdate = useSelector((state) => state.reservationUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = reservationUpdate;

    const checkForActiveOrders = () => {
        if (clientOrdersList && clientOrdersList.some(order => order.paymentId === null)) {
            setHasActiveOrders(true);
            setShowWarningModal(true);
            return true;
        }
        return false;
    };

    useEffect(() => {
        // Cargar detalles de la reserva y otros datos iniciales
        dispatch(listReservationsDetails(reservationId));
        console.log('RESERVATION DETAILS', reservationDetails);
        dispatch(listAgreements());
        dispatch(listPayments());
    }, [dispatch, reservationId]);
    
    useEffect(() => {
        if (reservation) {
            // Cargar órdenes del cliente y reservas por cliente cuando la reserva esté disponible
            dispatch(listOrdersClient(reservation.id));
            //dispatch(listReservationsByClient(reservation.clientId));
        }
    }, [dispatch, reservation]);
    
    useEffect(() => {
        // Calcular el pago total cuando se actualicen las órdenes del cliente o la reserva
        if (reservation && clientOrdersList) {
            calculateTotalPayment(reservation, clientOrdersList);
        }
    }, [reservation, clientOrdersList]);
    
    useEffect(() => {
        // Redirigir cuando se actualice o elimine la reserva
        if (successUpdate || successDelete) {
            dispatch({ type: RESERVATION_UPDATE_RESET });
            dispatch({ type: RESERVATION_DELETE_RESET });
            history.push("/activeReservation");
        }
    }, [dispatch, history, successUpdate, successDelete]);

    const getAgreementName = (agreementId) => {
        if (agreements && agreements.length > 0) {
          const agreement = agreements.find((agreement) => agreement.id === agreementId);
          return agreement ? agreement.name : '';
        }
        return '';
      };

    const calculateTotalPayment = (reservation, orders) => {
        if (reservation && orders) {
            const totalOrders = orders
                .filter(order => order.paymentId === 1)  // Filtrar órdenes con paymentId igual a 1
                .reduce((total, order) => total + order.total, 0);
            const totalPayment = totalOrders + reservation.total;
            setTotalPayment(totalPayment);
        }
    };
      
    const getPaymentName = (paymentId) => {
        if (payments && payments.length > 0) {
          const payment = payments.find((payment) => payment.id === paymentId);
          return payment ? payment.name : '';
        }
        return '';
      };
    
    const handleEdit = (e) => {
        e.preventDefault();
        history.push(`/reservation/${reservationId}/edit`);
    };
   
    const renderReservationEdit = () => (
        <div className="card">
            <div className="card-header bg-warning">Editar Reservación</div>
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

    const renderReservationButton = () => (
        <div className="col-12 col-md-3">
            {reservation && !reservation.active_status && renderReservationEdit()}
        </div>
    );

    const renderDoneReservation = () => (
        <div className="card">
            <div className="card-header bg-success">Pagar Reservación</div>
            <div className="card-body">
                <button
                    className="btn btn-block"
                    onClick={() => setModal(true)}
                >
                    <ViewBox
                        title={`PAGO $${totalPayment}`}
                        paragraph={`Click para pagar`}
                        icon={"fas fa-hand-holding-usd"}
                        color={"bg-success"}
                    />
                </button>
            </div>
        </div>
    );

    const renderDeleteReservationButton = () => (
        <div className="card">
          <div className="card-header bg-danger">Eliminar Reservación</div>
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

      const renderDeleteReservationModal = () => (
        <Modal
          style={modalStyles}
          isOpen={showDeleteModal}
          onRequestClose={() => setShowDeleteModal(false)}
        >
          <h2 className="text-center">Eliminar Reservación</h2>
          <p className="text-center">Ingrese la razón por la que desea eliminar la reservación:</p>
          <form onSubmit={handleDeleteReservation}>
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

      const renderModalPay = () => (
        <Modal
            style={modalStyles}
            isOpen={modal}
            onRequestClose={() => setModal(false)}
        >
            <h2 className="text-center">Pago de Reserva</h2>
            <p className="text-center">¿La reserva ya fue pagada?</p>
            <form onSubmit={handleReservation}>
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
                                onChange={() => handlePaymentMethodChange(payment.id, payment.name)}
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

    const renderReservationInfo = () => (
            <div className="row">
       
                <div className="col-12 col-md-6">
                    <>
                            {reservation.total && (
                                <ViewBox
                                    title= {reservation.client.name}
                                    paragraph={getAgreementName(reservation.client.agreementId)}
                                    icon={"fas fa-dollar-sign"}
                                    color={"bg-info"}
                                />
                            )}
                    </>
                </div>

                {reservation.is_paid ? (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={"Pagada"}
                                paragraph={"Reserva pagada."}
                                icon={"fas fa-check"}
                                color={"bg-success"}
                            />
                        </div>
                    ) : (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={"No pagada"}
                                paragraph={"Reserva no pagada."}
                                icon={"far fa-times-circle"}
                                color={"bg-danger"}
                            />
                        </div>
                    )}

            </div>
        );    

        

    const renderTotalInfo = () => (
        <div className="row">
            
            <div className="col-12 col-md-6">
                <>
                        {reservation.total && (
                            <ViewBox
                                title= {`$${reservation.total}`}
                                paragraph={"Pago de la Reserva"}
                                icon={"fas fa-dollar-sign"}
                                color={"bg-success"}
                            />
                        )}
                </>
            </div>

            <div className="col-12 col-md-6">
                    <>
                            {reservation.total && (
                                <ViewBox
                                    title= {`$${totalPayment}`}
                                    paragraph={"Pago Total"}
                                    icon={"fas fa-dollar-sign"}
                                    color={"bg-success"}
                                />
                            )}
                    </>
                </div>

        </div>
    );
                
    const renderRoomsInfo = () => 
        reservation && (
            <>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <ViewBox
                            title="Habitaciones"
                            paragraph={
                                <div>
                                    {console.log("reservationDetails: ", reservationDetails)}
                                    {reservationDetails && reservationDetails.reservation && reservationDetails.reservation.room && reservationDetails.reservation.room.length > 0 ? (
                                        [...new Set(reservationDetails.reservation.room.map(room => room.name))].join(', ')
                                    ) : (
                                        'No hay habitaciones asociadas a esta reserva.'
                                    )}
                                </div>
                            }
                            icon={'fas fa-bed'}
                            color={'bg-info'}
                        />
                    </div>

                    <div className="col-12 col-md-6">
                    {reservation.quantity && (
                        <ViewBox
                            title={reservation.quantity}
                            paragraph={"Número de personas"}
                            icon={"fas fa-user"}
                            color={"bg-info"}
                        />
                    )}
                </div>
                    
                    <div className="col-12 col-md-6">
                        <ViewBox
                            title={"Nota:"}
                            paragraph={reservation.note}
                            icon={"far fa-sticky-note"}
                            color={"bg-silver"}
                        />
                    </div>
                </div>
            </>
        );
    


const renderOrderInfo = () =>
    reservation && (
        <>
            <div className="row">

            <div className="col-12 col-md-6">
                    {reservation.start_date && (
                        <ViewBox
                            title={reservation.start_date}
                            paragraph={"Fecha de Inicio"}
                            icon={"fas fa-calendar-alt"}
                            color={"bg-info"}
                        />
                    )}
                </div>

                
                <div className="col-12 col-md-6">
                    {reservation.end_date && (
                        <ViewBox
                            title={reservation.end_date}
                            paragraph={"Fecha de Fin"}
                            icon={"fas fa-calendar-check"}
                            color={"bg-info"}
                        />
                    )}
                </div>

                <div className="col-12 col-md-12">
                    {renderServicesTable()}
                </div>

                </div>
        </>
    );


    const renderInfo = () => (
        <>
            <div className="col-12 col-md-6">
                {renderReservationInfo()}
                {renderTotalInfo()}
                {renderRoomsInfo()}
            </div>
            <div className="col-12 col-md-6">{renderOrderInfo()}</div>
            {renderOrders()}

        </>
    );

    const servicesInfo = [
    { name: "Hidratación", icon: "fas fa-tint", label: "Tope máximo de hidratación" },
    { name: "Alimentación", icon: "fas fa-utensils", label: "Tope máximo de alimentación" },
    { name: "Lavandería", icon: "fas fa-soap", label: "Tope máximo de lavandería" }
];

const renderServicesTable = () => (
    <div className="card">
        <div className="card-header border-0">
            <h3 className="card-title">Servicios</h3>
        </div>
        <div className="card-body">
            {reservation.service && reservation.service.length > 0 ? (
                servicesInfo.map((serviceInfo, index) => {
                    const service = reservation.service.find(s => s.name === serviceInfo.name);
                    return service ? (
                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom mb-3">
                            <p className="text-primary text-xl">
                                <i className={serviceInfo.icon}></i>
                            </p>
                            <p className="d-flex flex-column text-right">
                                <span className="font-weight-bold">
                                    <span className="text-success">
                                        <i className="fas fa-dollar-sign text-success"></i>{" "}
                                        {service.ReservationService.maxLimit}
                                    </span>
                                </span>
                                <span className="text-muted">{serviceInfo.label}</span>
                            </p>
                        </div>
                    ) : null;
                })
            ) : (
                <div className="d-flex justify-content-center align-items-center border-bottom mb-3">
                    <p className="text-muted">No hay servicios asociados a esta reserva.</p>
                </div>
            )}
        </div>
    </div>
);

    
    


    const handleReservation = async (e) => {
        e.preventDefault();

        if (checkForActiveOrders()) {
            return; 
        }

        const updatedReservation = {
            id: reservationId,
            is_paid: true,
            paymentId: paymentId
        };
        setModal(false);    
        dispatch(updateReservationToPaid(updatedReservation));
        dispatch(updateClientReservationStatus(reservation.clientId, false, null));
        const rooms = reservation.room;
        await Promise.all(rooms.map(async (room) => {
            // Cambiar el estado de la habitación a false
            const updatedRoom = { ...room, active_status: 0 };
                // Realizar la actualización en el backend
            await dispatch(updateRoom(updatedRoom));
        }));
            const agreementName = getAgreementName(reservation.client.agreementId);
            generateInvoice(reservation, clientOrdersList, clientReservationsList, agreementName, paymentMethodName);

        };

    const renderWarningModal = () => (
            <Modal
                style={modalStyles}
                isOpen={showWarningModal}
                onRequestClose={() => setShowWarningModal(false)}
            >
                <h2 className="text-center">Advertencia</h2>
                <p className="text-center">Faltan órdenes por pagar que deben ser cerradas para continuar con la reserva.</p>

                <div className="d-flex justify-content-between w-100">
                <button
                    className="btn btn-primary btn-lg"
                    onClick={() => setShowWarningModal(false)}
                >
                    Entendido
                </button>

                <Link to="/active">
                    <button className="btn btn-success btn-lg">
                        <i className="fas fa-edit" /> Órdenes
                    </button>
        </Link>
            </div>

            </Modal>
        );


        const renderOrders = () => {
            if (loadingOrders) return <BigSpin />;
            if (errorOrders) return <div>Error: {errorOrders}</div>;
        
            return (
                <div>
                    <h3>Órdenes del Cliente:</h3>
                    {clientOrdersList && clientOrdersList.length > 0 ? (
                        clientOrdersList.map((order) => (
                            <div key={order.id} className="card mb-3">
                                <div className="card-header">
                                    <span>Orden #{order.id}</span>
                                    <span className="ml-5">Fecha: <FormattedDate dateString={order.createdAt} /></span>
                                    <span className="ml-5">Hora: <FormattedTime dateString={order.createdAt} /></span>
                                    {order.paymentId !== undefined && order.paymentId !== null && (
                                    <span className="ml-5">Método Pago: {getPaymentName(order.paymentId)}</span>
                                    )}
                                </div>
                                <div className="card-body">
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
                                            {order.products.map((product) => (
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
                                                            ${product.price * product.OrderProduct.quantity}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="order-status h3 mt-3">
                                        {order.paymentId === 1 && (
                                            <span className="badge bg-warning mr-4">PAGO PENDIENTE</span>
                                        )}
                                        {order.paymentId !== 1 && !order.isPaid && (
                                            <span className="badge bg-info mr-4">ORDEN ACTIVA</span>
                                        )}
                                        {order.paymentId !== 1 && order.isPaid && (
                                            <span className="badge bg-success mr-4">PAGADA</span>
                                        )}

                                        <span className="badge bg-success ml-6">
                                            Total: ${order.total}
                                        </span>

                                </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No hay órdenes para este cliente.</p>
                    )}
                </div>
            );
        };
        
        

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Reservación"} />
            <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
            {/* Main content */}
            <section className="content">
                {renderModalPay()}
                {renderWarningModal()}
                <ButtonGoBack history={history} />
                <div className="card">
                <div className="card-body">
                        <div className="row">
                            <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            render={renderInfo}
                                            loader={<BigSpin />}
                                        />  
                        </div>
                    </div>
                </div>
                {/* Render Orders */}
                <div className="card">
                    
                </div>
                <div className="row d-flex justify-content-between">
                    <LoaderHandler
                        loading={loading}
                        error={error}
                        render={renderReservationButton}
                        loader={<BigSpin />}
                    />
                    <LoaderHandler
                        loading={loading}
                        error={error}
                        render={renderDoneReservation}
                        loader={<BigSpin />}
                    />

                    <LoaderHandler
                        loading={loadingDelete}
                        error={errorDelete}
                        render={renderDeleteReservationButton}
                        loader={<BigSpin />}
                    />
                    {renderDeleteReservationModal()}

                </div>
            </section>
        </>
    );
};

export default ReservationViewScreen;