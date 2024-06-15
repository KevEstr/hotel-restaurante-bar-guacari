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
import { RESERVATION_DELETE_RESET } from "../../constants/reservationConstants";


/* actions */
import {
    listReservationsDetails,
    updateReservationToPaid,
    listReservationsByClient
} from "../../actions/reservationActions";

import { deleteReservation } from '../../actions/reservationActions';

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

    const reservationDelete = useSelector((state) => state.reservationDelete);
    const { loading: loadingDelete, success: successDelete, error: errorDelete } = reservationDelete;
      
    const [clientAgreement, setClientAgreement] = useState(null);

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements, loading: loadingAgreements, error: errorAgreements } = agreementList;

    const [reason, setReason] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteReservation = () => {
        console.log('Intentando eliminar la reservación');
        dispatch(deleteReservation(reservationId, reason));
        setShowDeleteModal(false);
      };
      
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
        if (successUpdate | successDelete) {
            dispatch({ type: RESERVATION_UPDATE_RESET });
            dispatch({ type: RESERVATION_DELETE_RESET });
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

        dispatch(listAgreements());

    }, [dispatch, history, reservation, reservationId, successUpdate, successDelete]);

    const getAgreementName = (agreementId) => {
        if (agreements && agreements.length > 0) {
          const agreement = agreements.find((agreement) => agreement.id === agreementId);
          return agreement ? agreement.name : '';
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

    const renderReservationInfo = () =>
        reservation && reservation.client ? (
            <div className="small-box bg-info">
                <div className="inner">
                    <h3>{reservation.client.name}</h3>
                    <h4>
                        {getAgreementName(reservation.client.agreementId)}
                    </h4>
                </div>
                <div className="icon">
                    <i className="fas fa-solid fa-hotel" />
                </div>
            </div>
        ) : null;

    const renderTotalInfo = () =>
        reservation &&
            <div className="small-box bg-success">
                <div className="inner">
                <h3>{reservation.total} COP</h3>
                    <h4>
                        Total Precio de Reservación
                    </h4>
                </div>
                <div className="icon">
                    <i className="fas fa-solid fa-dollar-sign" />
                </div>
            </div>

const renderRoomsInfo = () => (
    reservation && (
        <ViewBox
            title="Habitaciones"
            paragraph={
                <div>
                    {clientReservationsList && clientReservationsList.length > 0 ? (
                        clientReservationsList.reduce((roomNames, reservation) => {
                            if (reservation.rooms && reservation.rooms.length > 0) {
                                const roomNamesForReservation = reservation.rooms.map(room => room.name).join(', ');
                                return roomNames.length > 0 ? `${roomNames}, ${roomNamesForReservation}` : roomNamesForReservation;
                            }
                            return roomNames;
                        }, '')
                    ) : (
                        'No hay habitaciones asociadas a esta reserva.'
                    )}
                </div>
            }
            icon={'fas fa-bed'}
            color={'bg-warning'}
        />
    )
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
                    {reservation.service && reservation.service.length > 0 ? (
                        reservation.service.map((service, index) => {
                            if (service.name === 'Alimentación') {
                                return (
                                    <ViewBox
                                        key={index}
                                        title={service.ReservationService.maxLimit}
                                        paragraph={service.name}
                                        icon={'fas fa-utensils'}
                                        color={'bg-danger'}
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        <ViewBox
                            title={'0'}
                            paragraph={'Alimentación'}
                            icon={'fas fa-utensils'}
                            color={'bg-danger'}
                        />
                    )}
                </div>
            
                <div className="col-12 col-md-6">
                    {reservation.service && reservation.service.length > 0 ? (
                        reservation.service.map((service, index) => {
                            if (service.name === 'Lavanderia') {
                                return (
                                    <ViewBox
                                        key={index}
                                        title={service.ReservationService.maxLimit}
                                        paragraph={service.name}
                                        icon={'fas fa-soap'}
                                        color={'bg-danger'}
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        <ViewBox
                            title={'0'}
                            paragraph={'Lavandería'}
                            icon={'fas fa-soap'}
                            color={'bg-danger'}
                        />
                    )}
                </div>
            
            
                <div className="col-12 col-md-6">
                    {reservation.service && reservation.service.length > 0 ? (
                        reservation.service.map((service, index) => {
                            if (service.name === 'Hidratación') {
                                return (
                                    <ViewBox
                                        key={index}
                                        title={service.ReservationService.maxLimit}
                                        paragraph={service.name}
                                        icon={'fas fa-tint'}
                                        color={'bg-danger'}
                                    />
                                );
                            }
                            return null;
                        })
                    ) : (
                        <ViewBox
                            title={'0'}
                            paragraph={'Hidratación'}
                            icon={'fas fa-tint'}
                            color={'bg-danger'}
                        />
                    )}
                </div>
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
                <h3>Ordenes del Cliente:</h3>
                {clientOrdersList && clientOrdersList.length > 0 ? (
                    clientOrdersList.map((order) => (
                        <div key={order.id} className="card mb-3">
                            <div className="card-header">
                                <span>Orden #{order.id}</span>
                                <span className="ml-5">Fecha: <FormattedDate dateString={order.createdAt} /></span>
                                <span className="ml-5">Hora: <FormattedTime dateString={order.createdAt} /></span>
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
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No hay ordenes para este cliente.</p>
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
                {renderModalReservation()}
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