import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";

/* Form components */
import Textarea from "../../components/form/Textarea";

/* Order components */
import Select from "../../components/Select";

/* Constants */
import { RESERVATION_CREATE_RESET } from "../../constants/reservationConstants";

/* Actions */
import { allRooms } from "../../actions/roomActions";
import { listClients } from "../../actions/clientActions";
import { createReservation, updateClientHasReservation } from "../../actions/reservationActions";

const ReservationCreateScreen = ({ history, match }) => {
    /* Get table from url */
    const roomFromUrl = window.location.href.indexOf("room") !== -1;
    
    /* State */
    const [room, setRoom] = useState(
        roomFromUrl ? parseInt(match.params.id) : null
    );

    const [reservationId, setReservationId] = useState(null);
    const [client, setClient] = useState(null);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [price, setPrice] = useState(0);
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [quantity, setQuantity] = useState(null);
    const [clientAgreementId, setClientAgreementId] = useState(null);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const roomList = useSelector((state) => state.roomList);
    const { rooms } = roomList;

    //reservation create state
    const reservationCreate = useSelector((state) => state.reservationCreate);
    const { success, loading, error, reservation } = reservationCreate;

    useEffect(() => {
        dispatch(allRooms());
    }, [dispatch, history, userInfo]);

    useEffect(() => {
        dispatch(allRooms());
        if (success) {
            setReservationId(reservation.id);
            dispatch({ type: RESERVATION_CREATE_RESET });
            history.push("/activeReservation");
        }
    }, [dispatch, history, success, error, reservation]);

    const handleSubmit = (e) => {
        e.preventDefault();

        /* Set Errors */
        let errorsCheck = {};
        if (!room) {
            errorsCheck.room = "Habitación es requerida";
        }
        if (!client) {
            errorsCheck.client = "Cliente es requerido";
        }

        /* Check errors */
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            /* Create reservation */
            const reservation = {
                clientId: client,
                roomId: room,
                price: price,
                start_date: start_date,
                end_date: end_date,
                quantity: quantity,
                paymentId: 0,
                note: note,
                is_paid: 0,

            };
            /* Make request */

            dispatch(updateClientHasReservation(reservation.clientId, true));
            dispatch(createReservation(reservation));
        }
    };

    /* Filter rooms */
    const filterFreeRooms = () => {
        return rooms.filter((room) => room.active_status === false);
    };

    const searchRooms = (e) => {
        dispatch(allRooms(e.target.value));
    };

    const renderRoomsSelect = () => (
        <>
            <Select
                data={room}
                setData={setRoom}
                items={filterFreeRooms()}
                search={searchRooms}
            />
            {errors.room && <Message message={errors.room} color={"warning"} />}
        </>
    );

    const handleClientSelect = (selectedClient) => {
        setClient(selectedClient);
        const selectedClientData = clients.find(client => client.id === selectedClient);
        setClientAgreementId(selectedClientData ? selectedClientData.agreementId : null);
    };

    const searchClients = (e) => {
        dispatch(listClients(e.target.value));
    };

    const renderClientsSelect = () => (
        <>
            <Select
                data={client}
                setData={handleClientSelect}
                items={clients}
                search={searchClients}
            />
            {errors.client && <Message message={errors.client} color={"warning"} />}
        </>
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

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent room={"Habitaciones"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Crear Habitación</h3>
                                    <Loader variable={loading} />
                                    <Message message={error} color={"danger"} />
                                </div>
                                {/* /.card-header */}
                                <div className="card-body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                    <div className="col-12 col-lg-12" style={{ maxWidth: '800px', width: '100%' }}>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                                            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                <h3 className="card-title"> </h3>
                                                Selecciona la habitación:
                                                {renderRoomsSelect()}
                                            </div>
                                            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                <h3 className="card-title"> </h3>
                                                Selecciona el cliente:
                                                {renderClientsSelect()}
                                            </div>
                                            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                <h3 className="card-title">Precio:</h3>
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                />
                                            </div>
                                            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                <h3 className="card-title">Cantidad de personas:</h3>
                                                <input
                                                    type="number"
                                                    value={quantity}
                                                    onChange={(e) => setQuantity(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                />
                                            </div>
                                            <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                <h3 className="card-title">Fecha de inicio:</h3>
                                                <input
                                                    type="date"
                                                    value={start_date}
                                                    onChange={(e) => setStartDate(e.target.value)}
                                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                />
                                            </div>
                                                <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                                    <h3 className="card-title">Fecha de finalización:</h3>
                                                    <input
                                                        type="date"
                                                        value={end_date}
                                                        onChange={(e) => setEndDate(e.target.value)}
                                                        style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                                                    />
                                                </div>
                                            
                                        </div>
                                        <div className="mt-4" style={{ marginTop: '20px' }}>
                                            {renderNoteTextarea()}
                                        </div>
                                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                                            {renderSubmitButton()}
                                        </div>
                                    </div>
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

export default ReservationCreateScreen;
