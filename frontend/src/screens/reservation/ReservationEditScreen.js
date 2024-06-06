import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import Textarea from "../../components/form/Textarea";
import Select from "../../components/Select";
import {
    RESERVATION_DETAILS_RESET,
    RESERVATION_UPDATE_RESET,
} from "../../constants/reservationConstants";
import { listReservationsDetails, updateReservation } from "../../actions/reservationActions";
import { listClients } from "../../actions/clientActions";
import { listRooms } from "../../actions/roomActions";
import { listServices } from '../../actions/serviceActions';


const ReservationEditScreen = ({ history, match }) => {
    const reservationId = parseInt(match.params.id);

    const [room, setRoom] = useState(null);
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [price, setPrice] = useState(0);
    const [client, setClient] = useState(null);
    const [note, setNote] = useState("");
    const [quantity, setQuantity] = useState("");
    const [errors, setErrors] = useState({});
    const [clientAgreementId, setClientAgreementId] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [total, setTotal] = useState(0);
    const dispatch = useDispatch();

    const reservationDetails = useSelector((state) => state.reservationDetails);
    const { loading, error, reservation } = reservationDetails;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const roomList = useSelector((state) => state.roomList);
    const { rooms } = roomList;

    const serviceList = useSelector((state) => state.serviceList);
    const { services } = serviceList;

    const reservationUpdate = useSelector((state) => state.reservationUpdate);
    const { loading: loadingUpdate, success: successUpdate, errorUpdate } = reservationUpdate;


    useEffect(() => {
        dispatch(listServices());
    }, [dispatch]);

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: RESERVATION_UPDATE_RESET });
            dispatch({ type: RESERVATION_DETAILS_RESET });
            history.push("/activeReservation");
        } else {
            if (!reservation || reservation.id !== reservationId) {
                dispatch(listReservationsDetails(reservationId));
            } else {
                setRoom(reservation.room ? reservation.room.id : null);
                setClient(reservation.client ? reservation.client.id : null);
                setNote(reservation.note || "");
                setPrice(reservation.price || 0);
                setStartDate(reservation.start_date || "");
                setEndDate(reservation.end_date || "");
                setQuantity(reservation.quantity || "");
                setSelectedServices(reservation.service || []);
                console.log("RESERVACIÓN A EDITAR: ", reservation)
                setTotal(reservation.total || "");
            }
        }
    }, [dispatch, history, reservation, reservationId, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};

        if (!room) {
            errorsCheck.room = "Room is required";
        }
        if (!client) {
            errorsCheck.client = "Client is required";
        }
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const reservationData = {
                id: reservationId,
                price,
                clientId: client,
                start_date,
                end_date,
                quantity,
                note,
                services: selectedServices,
                total,
            };

            dispatch(updateReservation(reservationData));
        }
    };

    const handleServiceChange = (e, serviceId) => {
        const { name, value } = e.target;
        setSelectedServices((prevServices) => {
            // Verifica si se está deseleccionando el servicio
            if (value === "") {
                // Elimina el servicio del estado
                return prevServices.filter((service) => service.id !== serviceId);
            } else {
                // Verifica si el servicio ya está en selectedServices
                const serviceExists = prevServices.find((service) => service.id === serviceId);
                if (serviceExists) {
                    // Actualiza el límite máximo del servicio existente
                    return prevServices.map((service) =>
                        service.id === serviceId ? { ...service, [name]: value } : service
                    );
                } else {
                    // Agrega el servicio seleccionado al estado
                    return [
                        ...prevServices,
                        { id: serviceId, maxLimit: value }
                    ];
                }
            }
        });
    };

    const handleAddService = (service) => {
        const isSelected = selectedServices.some(item => item.id === service.id);
    
        if (isSelected) {
            // Si el servicio ya está seleccionado, lo quitamos
            setSelectedServices(prevServices => prevServices.filter(item => item.id !== service.id));
        } else {
            // Si el servicio no está seleccionado, lo agregamos
            setSelectedServices(prevServices => [...prevServices, { id: service.id, maxLimit: '', name: service.name }]);
        }
    };


    const filterFreeRooms = () => {
        return rooms.filter((roomItem) => roomItem.active_status === false || roomItem.id === room);
    };

    const searchRooms = (e) => {
        dispatch(listRooms(e.target.value));
    };

    const renderRoomsSelect = () => (
        <>
            <Select
                data={room}
                setData={setRoom}
                items={filterFreeRooms(rooms)}
                search={searchRooms}
            />
            {errors.room && (
                <Message message={errors.room} color={"warning"} />
            )}
        </>
    );

    const searchClients = (e) => {
        dispatch(listClients(e.target.value));
    };

    const renderClientsSelect = () => (
        <>
            <Select
                data={client}
                setData={setClient}
                items={clients}
                search={searchClients}
            />
            {errors.client && (
                <Message message={errors.client} color={"warning"} />
            )}
        </>
    );

    const renderPriceInput = () => (
        <>
            <label htmlFor="price">Precio:</label>
            <input
                type="number"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="form-control"
            />
            {errors.price && (
                <Message message={errors.price} color={"warning"} />
            )}
        </>
    );

    const renderQuantityInput = () => (
        <>
            <label htmlFor="quantity">Cantidad de Personas:</label>
            <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="form-control"
            />
            {errors.quantity && (
                <Message message={errors.quantity} color={"warning"} />
            )}
        </>
    );

    const renderStartDateSelect = () => (
        <>
            <label htmlFor="startDate">Fecha de Inicio:</label>
            <input
                type="date"
                id="startDate"
                value={start_date}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-control"
            />
            {errors.startDate && (
                <Message message={errors.startDate} color={"warning"} />
            )}
        </>
    );

    const renderEndDateSelect = () => (
        <>
            <label htmlFor="endDate">Fecha de Fin:</label>
            <input
                type="date"
                id="endDate"
                value={end_date}
                onChange={(e) => setEndDate(e.target.value)}
                className="form-control"
            />
            {errors.endDate && (
                <Message message={errors.endDate} color={"warning"} />
            )}
        </>
    );

    const renderNoteTextarea = () => (
        <Textarea
            title={"Concepto del Cambio:"}
            rows={3}
            data={note}
            setData={setNote}
        />
    );

    const renderServices =() => (
        <>
        <div>
            <label htmlFor="servicios">Servicios</label>
            <div>
            {selectedServices &&
            selectedServices.map((service) => (
                <div key={service.id}>
                <label>
                    <input
                    type="checkbox"
                    value={service.id}
                    checked={selectedServices.some(
                        (selectedService) => selectedService.id === service.id
                    )}
                    onChange={() => handleAddService(service)}
                    />
                    {service.name}
                </label>
                </div>
            ))}
        </div>
            {errors.selectedServices && <Message message={errors.selectedServices} color={"warning"} />}
        </div>{console.log("Servicios seleccionados: ",selectedServices)}
        {selectedServices.map((service) => (
            <div key={service.id}>
                <label htmlFor={`maxLimit-${service.id}`}>
                Tope Máximo para {service.name}
                </label>
                <input
                type="number"
                id={`maxLimit-${service.id}`}
                name="maxLimit"
                value={service.ReservationService ? service.ReservationService.maxLimit : ''}
                onChange={(e) => handleServiceChange(e, service.id)}
                />
            </div>
            ))}
        </>
    );

    const renderSubmitButton = () => (
        <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-success btn-lg float-right"
        >
            Submit
        </button>
    );

    return (
        <>
            <HeaderContent name={"Editar Reserva"} />
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Reserva</h3>
                                    <Loader variable={loadingUpdate} />
                                    {errorUpdate && (
                                        <Message message={errorUpdate} color={"danger"} />
                                    )}
                                    <Loader variable={loading} />
                                    {error && <Message message={error} color={"danger"} />}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-12 col-lg-6">
                                            <div className="col-12 col-md-6">
                                                Cambiar Fecha de Inicio:
                                                {renderStartDateSelect()}
                                            </div>
                                            <div className="col-12 col-md-6">
                                                Cambiar Fecha de Finalización:
                                                {renderEndDateSelect()}
                                            </div>

                                            <div className="col-12 col-md-6">
                                                Cambiar Servicios:
                                                {renderServices()}
                                            </div>
                                        </div>
                                        <div className="col-12 col-lg-6">
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    Cambiar Habitación:
                                                    {renderRoomsSelect()}
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    Cambiar Cliente:
                                                    {renderClientsSelect()}
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    {renderPriceInput()}
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    {renderQuantityInput()}
                                                </div>

                                        
                                            </div>
                                            <div className="mt-4">
                                                {renderNoteTextarea()}
                                            </div>
                                        </div>
                                    </div>
                                    {renderSubmitButton()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ReservationEditScreen;
