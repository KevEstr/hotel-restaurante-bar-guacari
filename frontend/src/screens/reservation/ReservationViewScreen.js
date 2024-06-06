import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import ViewBox from "../../components/ViewBox";
import LoaderHandler from "../../components/loader/LoaderHandler";
import { BigSpin } from "../../components/loader/SvgLoaders";
import Modal from "react-modal";
import ModalButton from "../../components/ModalButton";
import { FormattedDate, FormattedTime } from "../../utils/formattedDate"; // Asegúrate de ajustar la ruta según tu estructura de archivos

/* constants */
import { RESERVATION_UPDATE_RESET } from "../../constants/reservationConstants";

/* actions */
import {
    listReservationsDetails,
    updateReservationToEnd,
    updateReservationToPaid,
    listReservationsByClient
} from "../../actions/reservationActions";

import { listOrdersByClient, listOrders } from "../../actions/orderActions";

import { CLIENT_ORDER_LIST_REQUEST, CLIENT_ORDER_LIST_SUCCESS, CLIENT_ORDER_LIST_FAIL } from '../../constants/orderConstants';

import { listAgreements } from '../../actions/agreementActions';

import { modalStyles } from "../../utils/styles";

import { listOrdersClient } from "../../actions/orderActions";

import { updateRoom } from "../../actions/roomActions";

import generateInvoice from "../../utils/generateInvoice";

const ReservationViewScreen = ({ history, match }) => {
    const reservationId = parseInt(match.params.id);

    const dispatch = useDispatch();

    //order details state
    const reservationDetails = useSelector((state) => state.reservationDetails);
    const { loading, error, reservation } = reservationDetails;
    const [modal, setModal] = useState(false);

    const [clientAgreement, setClientAgreement] = useState(null);

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements, loading: loadingAgreements, error: errorAgreements } = agreementList;


    
    const clientReservations = useSelector(state => state.clientReservations);
    const { loading: loadingReservations, error: errorReservations, reservations: clientReservationsList } = clientReservations;

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

    useEffect(() => {
        dispatch(listAgreements());
    }, [dispatch]);

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: RESERVATION_UPDATE_RESET });
                history.push("/activeReservation");
        }
        if (reservation) {
            if (!reservation.id || reservation.id !== reservationId) {
                dispatch(listReservationsDetails(reservationId));
            }
            else {
                // Si la reserva está correctamente cargada, cargar las órdenes del cliente
                dispatch(listOrdersClient(reservation.clientId));
                dispatch(listReservationsByClient(reservation.clientId));
            }
            
        }

    }, [dispatch, history, reservation, reservationId, successUpdate]);

    const AgreementName = (selectedClient) => {
        const selectedClientAgreement = agreements.find(agreement => agreement.id === selectedClient.agreementId);
        setClientAgreement(selectedClientAgreement ? selectedClientAgreement.name : null);

    };
    const handleEdit = (e) => {
        e.preventDefault();
        history.push(`/reservation/${reservationId}/edit`);
    };

        reservation && (
            <>
                <div className="row">
                    <div className="col-12 col-md-6">
                        <ViewBox
                            title={reservationId}
                            paragraph={"RESERVA ID"}
                            icon={"far fa-clipboard"}
                            color={"bg-info"}
                        />
                    </div>

                    {reservation.is_paid ? (
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
                                paragraph={"Reserva no ha sido pagada."}
                                icon={"far fa-times-circle"}
                                color={"bg-danger"}
                            />
                        </div>
                    )}

                    <div className="col-12 col-md-6">
                        {reservation.client && (
                            <ViewBox
                                paragraph={`ID: ${reservation.client.id}`}
                                icon={"fas fa-user"}
                                color={"bg-info"}
                            />
                        )
                        }
                    </div>

                    {reservation.room ? (
                        <div className="col-12 col-md-6">
                            <ViewBox
                                title={reservation.room.name}
                                icon={"fas fa-utensils"}
                                color={"bg-info"}
                            />
                        </div>
                    ) : (
                        <div className="col-12 col-md-6">
                            {reservation.client && (
                                <ViewBox
                                    title={"Domicilio"}
                                    paragraph={reservation.client.address}
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
                        paragraph={reservation.note}
                        icon={"far fa-sticky-note"}
                        color={"bg-silver"}
                    />
                </div>
            </>
        );

    const renderReservationEdit = () => (
        <div className="card">
            <div className="card-header bg-warning">Editar órden</div>
            <div className="card-body">
                <button className="btn btn-block" onClick={handleEdit}>
                    <ViewBox
                        title={`Editar órden`}
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
            <div className="card-header bg-success">Cerrar Reservación</div>
            <div className="card-body">
                <button
                    className="btn btn-block"
                    onClick={() => setModal(true)}
                >
                    <ViewBox
                        title={`PAGO $${reservation.id}`}
                        paragraph={`Click para cerrar`}
                        icon={"fas fa-hand-holding-usd"}
                        color={"bg-success"}
                    />
                </button>
            </div>
        </div>
    );

    const renderModalReservation = () => (
        <Modal
            style={modalStyles}
            isOpen={modal}
            onRequestClose={() => setModal(false)}
        >
            <h2 className="text-center">Pago de Reserva</h2>
            <p className="text-center">¿La Reserva ya fue pagada?</p>
            <form onSubmit={handleReservation}>
                <button type="submit" className="btn btn-primary">
                    Sí, finalizar.
                </button>

                <ModalButton
                    modal={modal}
                    setModal={setModal}
                    classes={"btn-danger float-right"}
                />
            </form>
        </Modal>
    );

    const handleReservation = async (e) => {
        e.preventDefault();
        const updatedReservation = {
            id: reservationId,
            is_paid: true,
        };
        setModal(false);
        dispatch(updateReservationToPaid(updatedReservation));

        const rooms = reservation.room;
    await Promise.all(rooms.map(async (room) => {
        // Cambiar el estado de la habitación a false
        const updatedRoom = { ...room, active_status: false };
        // Realizar la actualización en el backend
        await dispatch(updateRoom(updatedRoom)); // Necesitas tener una acción para actualizar la habitación
    }));
        generateInvoice(reservation, clientOrdersList, clientReservationsList);
    };

    const renderReservations = () => {
        if (loadingReservations) return <BigSpin />;
        if (errorReservations) return <div>Error: {errorReservations}</div>;
    
        return (
            <div>
                <h3>Reservas del Cliente:</h3>
                {clientReservationsList && clientReservationsList.length > 0 ? (
                    clientReservationsList.map((reservation) => (
                        <div key={reservation.id} className="card mb-3">
                            <div className="card-header">
                                Reserva #{reservation.id}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title"> </h5>
                                {reservation.rooms && reservation.rooms.length > 0 && (
                                    <div>
                                        <h5>Habitaciones Asociadas:</h5>
                                        {reservation.rooms.map((room, index) => (
                                            <div key={index}>
                                                <h6>ID de habitación:</h6>
                                                <p>{room.id}</p>
                                                <h6>Nombre de la habitación:</h6>
                                                <p>{room.name}</p>
                                                {/* Agrega más detalles de la habitación si es necesario */}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay reservas para este cliente.</p>
                )}
            </div>
        );
    };
    

    const renderOrders = () => {
        if (loadingOrders) return <BigSpin />;
        if (errorOrders) return <div>Error: {errorOrders}</div>;
        return (
            <div>
                <h3>Órdenes del Cliente:</h3>
                {clientOrders && clientOrders.length > 0 ? (
                    clientOrders.map((order) => (
                        <div key={order.id} className="card mb-3">
                            <div className="card-header">
                                Orden #{order.id}
                            </div>
                            <div className="card-body">
                                <h5 className="card-title">Productos:</h5>
                                {order.products && order.products.length > 0 ? (
                                    <ul>
                                        {order.products.map((product) => (
                                            <li key={product.id}>
                                                {product.name} - Cantidad: {product.orderProducts.quantity}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No hay productos en esta orden.</p>
                                )}
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
            <HeaderContent name={"Órdenes"} />
            <LoaderHandler loading={loadingUpdate} error={errorUpdate} />
            {/* Main content */}
            <section className="content">
                {renderModalReservation()}
                <ButtonGoBack history={history} />
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Detalles de la Reserva</h3>
                    </div>
                    <div className="card-body">
                    {reservation ? (
                        <div className="row">
                            <div className="col-md-6">
                                <h5>Precio:</h5>
                                <p>{reservation.price}</p>
                                <h5>Fecha de inicio:</h5>
                                <p>{reservation.start_date}</p>
                                <h5>Fecha de fin:</h5>
                                <p>{reservation.end_date}</p>
                                <h5>Nota:</h5>
                                <p>{reservation.note}</p>
                                <h5>Convenio:</h5>
                                <p>{clientAgreement}</p>
                                <h5>Servicios:</h5>
                                {reservation.service && reservation.service.length > 0 ? (
                                    reservation.service.map((service, index) => (
                                    <div key={index}>
                                        <p>{service.name}: {service.ReservationService.maxLimit}</p>
                                    </div>
                                    ))
                                ) : (
                                    <p>No hay servicios asociados a esta reservación.</p>
                                )}
                            </div>
                            <div className="col-md-6">
                                <h5>Cantidad:</h5>
                                <p>{reservation.quantity}</p>
                                <h5>ID de usuario:</h5>
                                <p>{reservation.userId}</p>
                                <h5>ID de cliente:</h5>
                                <p>{reservation.clientId}</p>
                                <h5>ID de habitación:</h5>
                                <p>{reservation.roomId}</p>
                                <h5>ID de pago:</h5>
                                <p>{reservation.paymentId}</p>
                            </div>
                            
                        </div>
                    ) : (
                        <p>No se encontró la reserva.</p>
                    )}
                </div>
                </div>
                {/* Render Orders */}
                <div className="card">
                    <div className="card-body">
                        {renderOrders()}
                    </div>
                </div>
                <div className="card-footer">
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
                </div>
            </section>
        </>
    );
};

export default ReservationViewScreen;
