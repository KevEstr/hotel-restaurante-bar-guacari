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



/* constants */
import { RESERVATION_UPDATE_RESET } from "../../constants/reservationConstants";

/* actions */
import {
    listReservationsDetails,
    updateReservationToEnd
} from "../../actions/reservationActions";

import { modalStyles } from "../../utils/styles";

const ReservationViewScreen = ({ history, match }) => {
    const reservationId = parseInt(match.params.id);

    const dispatch = useDispatch();

    //order details state
    const reservationDetails = useSelector((state) => state.reservationDetails);
    const { loading, error, reservation } = reservationDetails;
    const [modal, setModal] = useState(false);


    //order edit state
    const reservationUpdate = useSelector((state) => state.reservationUpdate);
    const {
        loading: loadingUpdate,
        success: successUpdate,
        errorUpdate,
    } = reservationUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: RESERVATION_UPDATE_RESET });
                history.push("/activeReservation");
        }
        if (reservation) {
            if (!reservation.id || reservation.id !== reservationId) {
                dispatch(listReservationsDetails(reservationId));
            }
        }
    }, [dispatch, history, reservation, reservationId, successUpdate]);

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
                        )}
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
        };
        setModal(false);
        dispatch(updateReservationToEnd(updatedReservation));
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
                {/* /.container-fluid */}
            </section>
        </>
    );
};

export default ReservationViewScreen;
