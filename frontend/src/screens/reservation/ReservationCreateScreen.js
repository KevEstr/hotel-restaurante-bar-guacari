import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Message from "../../components/Message";
import Loader from "../../components/Loader";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import { useParams } from "react-router-dom";

/* Form components */
import Textarea from "../../components/form/Textarea";

/* Order components */
import Select from "../../components/Select";

/* Constants */
import { RESERVATION_CREATE_RESET } from "../../constants/reservationConstants";

/* Actions */
import { allRooms, updateRoom } from "../../actions/roomActions";
import { listClients } from "../../actions/clientActions";
import { createReservation, updateClientHasReservation } from "../../actions/reservationActions";
import { listServices } from '../../actions/serviceActions';
import { listPayments } from '../../actions/paymentActions';
import { listAgreements } from '../../actions/agreementActions';
import { updateClientReservationStatus } from '../../actions/clientActions';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import es from 'date-fns/locale/es';  // Importa el idioma español de date-fns/locale

registerLocale('es', es);  // Registra el idioma español con el nombre 'es'
setDefaultLocale('es');    // Establece el idioma por defecto como español

const ReservationCreateScreen = ({ history, location }) => {
    /* Get table from url */
    const { id: roomIdFromParams } = useParams();
    const roomFromUrl = window.location.href.indexOf("room") !== -1;

    const { selectedRooms } = location.state || {};
    const [selectedRoomDetails, setSelectedRoomDetails] = useState([]);
    
    /* State */
    const [room, setRoom] = useState(
        roomFromUrl ? parseInt(roomIdFromParams) : null
    );

    console.log("Habitación que llega de Active:", roomFromUrl)
    console.log("Habitación que llega de Active:", room)
    console.log("Habitación que llega de Active:", roomIdFromParams)

    const [reservationId, setReservationId] = useState(null);
    const [client, setClient] = useState(null);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [price, setPrice] = useState("");
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [quantity, setQuantity] = useState("");
    const [selectedServices, setSelectedServices] = useState([]);
    const [clientAgreement, setClientAgreement] = useState(null);
    const [roomSelects, setRoomSelects] = useState([{ selectId: Date.now(), roomId: roomIdFromParams ? parseInt(roomIdFromParams) : '' }]);
    const [advance, setAdvance] = useState(0);
    const [paymentId, setPaymentId] = useState("");


    const [total, setTotal] = useState(0);

    const [clientAgreementId, setClientAgreementId] = useState(null);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    console.log("Clients from useSelector:", clients);

    const roomAll = useSelector((state) => state.roomAll);
    const { rooms } = roomAll;

    const serviceList = useSelector((state) => state.serviceList);
    const { services } = serviceList;

    const paymentList = useSelector((state) => state.paymentList);
    const { payments, error: errorPayments } = paymentList;

    //reservation create state
    const reservationCreate = useSelector((state) => state.reservationCreate);
    const { success, loading, error, reservation } = reservationCreate;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements, loading: loadingAgreements, error: errorAgreements } = agreementList;

    useEffect(() => {
        if (selectedRooms && rooms.length > 0) {
            const selectedDetails = rooms.filter(room => selectedRooms.includes(room.id));
            setSelectedRoomDetails(selectedDetails);
            setRoomSelects(selectedRooms.map(roomId => ({ selectId: Date.now(), roomId })));
        }
    }, [selectedRooms, rooms]);

      useEffect(() => {
        //dispatch(allRooms());
        if (success) {
            dispatch(listServices());
            dispatch({ type: RESERVATION_CREATE_RESET });
            history.push("/activeReservation");
        }
        dispatch(listPayments());
        dispatch(allRooms());
        dispatch(listServices());
        dispatch(listAgreements());
        dispatch(listClients())

        console.log("Dispatched listClients");

    }, [dispatch, history, success, error, reservation]);

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
            /* Calculate Total */
            const calculatedTotal = calculateTotal(start_date, end_date, price);
            setTotal(calculatedTotal);

            /* Create reservation */
            const reservation = {
                clientId: client,
                rooms: roomSelects.map(select => select.roomId),
                price: price,
                start_date: start_date,
                end_date: end_date,
                quantity: quantity,
                note: note,
                is_paid: 0,
                services: selectedServices,
                advance: advance,
                total: calculatedTotal,
                pending_payment: calculatedTotal-advance,
                paymentId: paymentId,
            };
            /* Make request */

            dispatch(updateClientReservationStatus(reservation.clientId, true, reservation.id));
            dispatch(createReservation(reservation));

            selectedRooms.forEach((roomId) => {
                dispatch(updateRoom(roomId, 1));
              });

            console.log("Datos de la reserva:", reservation);
            setReservationId(reservation.id);
        }
    };

    /* Filter rooms */
    const filterFreeRooms = () => {
        return rooms.filter((room) => room.active_status === 0);
    };

    const searchRooms = (e) => {
        dispatch(allRooms(e.target.value));
    };

    const addRoomSelect = () => {
        setRoomSelects([...roomSelects, { selectId: Date.now(), roomId: '' }]);
    };

    const calculateTotal = (startDate, endDate, pricePerDay) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Milliseconds to days
        return diffDays * pricePerDay;
    };

    const getPaymentName = (paymentId) => {
        if (payments && payments.length > 0) {
          const payment = payments.find((payment) => payment.id === paymentId);
          return payment ? payment.name : '';
        }
        return '';
      };

    const renderRoomsSelect = () => {
        const selectedRoomIds = roomSelects.map(select => select.roomId); // Obtener todas las habitaciones seleccionadas
    
        const availableRooms = (selectId) => {
            return rooms.filter(room => room.active_status === 0 && !selectedRoomIds.includes(room.id) || roomSelects.find(select => select.selectId === selectId && select.roomId === room.id));
        };
    
        return (
            <div>
                <div className="d-flex align-items-center gap-2 flex-wrap">
                    {roomSelects.map((select) => (
                        <div key={select.selectId} className="mr-2 mb-2" style={{ flexShrink: 0 }}>
                            <select
                                value={select.roomId}
                                onChange={(e) => handleRoomSelection(select.selectId, e.target.value)}
                                className="form-control"
                            >
                                <option value="">Seleccione una habitación</option>
                                {availableRooms(select.selectId).map((room) => (
                                    <option key={room.id} value={room.id}>
                                        Habitación {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>
                {errors.rooms && <Message message={errors.rooms} color={"warning"} />}
            </div>
        );
    };
    
    const removeLastRoomSelect = () => {
        setRoomSelects(prevSelects => {
            const updatedSelects = [...prevSelects];
            updatedSelects.pop(); // Eliminar el último elemento
            return updatedSelects;
        });
    };
    
    const handleClientSelect = (selectedClient) => {
        setClient(selectedClient);
        const selectedClientData = clients.find(client => client.id === selectedClient);
        setClientAgreementId(selectedClientData ? selectedClientData.agreementId : null);
        const selectedClientAgreement = agreements.find(agreement => agreement.id === selectedClientData.agreementId);
        setClientAgreement(selectedClientAgreement ? selectedClientAgreement : null);

    };

    const searchClients = (e) => {
        dispatch(listClients(e.target.value));
    };

    const renderClientsSelect = () => {
        console.log("Clients in renderClientsSelect:", clients);
        const filteredClients = clients ? clients.filter(client => client.has_reservation === false) : [];
        return (
            <>
            <Select
                data={client}
                setData={handleClientSelect}
                items={filteredClients}
                search={searchClients}
            />
            {errors.client && <Message message={errors.client} color={"warning"} />}
            </>
    );
}
    const renderPaymentsSelect = () => {
        console.log("PaymentList: ", paymentList);
        console.log('payments: ', payments );
        if (payments.length === 0) {
            return null; // No hay pagos disponibles
        }

        return (
            <div className="form-group">
                <label htmlFor="paymentId">Método de Pago</label>
                <select
                    id="paymentId"
                    value={paymentId}
                    onChange={(e) => setPaymentId(e.target.value)}
                    className="form-control"
                >
                    {payments.map((payment) => (
                        <option key={payment.id} value={payment.id}>
                            {payment.name}
                        </option>
                    ))}
                </select>
            </div>
        );
    };

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

    const renderSelectedRooms = () => (
        <div className="d-flex justify-content-end">
            {selectedRoomDetails.map((room) => (
                <div key={room.id} className="form-group" style={{marginLeft:'10px'}}>
                    <label style={{fontWeight: 'normal'}}>Habitación:</label>
                    <input type="text" value={room.name} className="form-control" readOnly />
                </div>
            ))}
        </div>
    );
    

    const handleRoomSelection = (selectId, roomId) => {
        setRoomSelects(prevSelects =>
            prevSelects.map(select =>
                select.selectId === selectId ? { ...select, roomId } : select
            )
        );
    };

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
                            <h3 className="card-title">Crear Reserva</h3>
                            <Loader variable={loading} />
                            <Message message={error} color={"danger"} />
                        </div>
                        {/* /.card-header */}
                        <div className="card-body">
                            
                            <div className="row">
                            {renderSelectedRooms()}
                            </div>
                            <div className="row">
                            <div className="col-md-3">
                                    <div className="form-group">
                                        <label style={{fontWeight: 'normal'}}>Selecciona el cliente:</label>
                                        {renderClientsSelect()}
                                        {errors.client && <Message message={errors.client} color={"warning"} />}
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="form-group">
                                        <label style={{fontWeight: 'normal'}}>Precio:</label>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label style={{fontWeight: 'normal'}}>Valor anticipo:</label>
                                        <input
                                            type="number"
                                            value={advance}
                                            onChange={(e) => setAdvance(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                {advance > 0 && (
                                <div className="col-md-3">
                                    <div className="form-group">
                                    <div className="col-lg-4 col-md-6">
                                        {renderPaymentsSelect()}
                                    </div>
                                    </div>
                                </div>
                                )}
                                <div className="col-md-3">
                                    <div className="form-group">
                                        <label style={{fontWeight: 'normal'}}>Cantidad de personas:</label>
                                        <input
                                            type="number"
                                            value={quantity}
                                            onChange={(e) => setQuantity(e.target.value)}
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-3">
                                    <div className="form-group" style={{ marginTop: '8px' }}>
                                        <label style={{ fontWeight: 'normal' }}>Fecha de inicio:</label>
                                        <DatePicker
                                            selected={start_date}
                                            onChange={(date) => setStartDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Fecha de Inicio"
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3" style={{ marginTop: '8px' }}>
                                    <div className="form-group">
                                        <label style={{ fontWeight: 'normal' }}>Fecha de finalización:</label>
                                        <DatePicker
                                            selected={end_date}
                                            onChange={(date) => setEndDate(date)}
                                            dateFormat="dd/MM/yyyy"
                                            placeholderText="Fecha de Fin"
                                            className="form-control"
                                        />
                                    </div>
                            </div>
                            
                        </div>
                        <div className="row">
                            <div className="col-md-3 pr-0" style={{marginTop: '8px'}}>
                                <div className="form-group d-flex">
                                    <label style={{fontWeight: 'normal'}} className="mr-2 mb-0">Convenio:</label>
                                    <div>{clientAgreement && clientAgreement.name}</div>
                                </div>
                            </div>
                            <div className="col-md-6" style={{marginTop: '8px'}}>
                                <div className="form-group d-flex" >
                                    <label style={{fontWeight: 'normal'}} className="mr-3 mb-0">Servicios:</label>
                                    <div className="d-flex flex-wrap">
                                        {clientAgreement && clientAgreement.service && clientAgreement.service.map((service) => (
                                            <div key={service.id} className="form-check form-check-inline mr-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    value={service.id}
                                                    onChange={() => handleAddService(service)}
                                                />
                                                <label className="form-check-label">{service.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                    {errors.selectedServices && <Message message={errors.selectedServices} color={"warning"} />}
                                </div>
                            </div>
                        </div>
                        <div className="row col-12">
                            {selectedServices.map((service) => (
                                <div key={service.id} className="row" style={{marginLeft:'12px', marginBottom:'-8px'}}>
                                    <div className="col-md-12" style={{ marginBottom: '15px' }}>
                                        <div className="form-group">
                                            <label style={{fontWeight: 'normal'}} htmlFor={`maxLimit-${service.id}`}>Tope Máximo para {service.name}</label>
                                            <input
                                                type="number"
                                                id={`maxLimit-${service.id}`}
                                                name="maxLimit"
                                                value={service.maxLimit}
                                                onChange={(e) => handleServiceChange(e, service.id)}
                                                className="form-control"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group" style={{marginTop: '6px'}}>
                                        {renderNoteTextarea()}
                                    </div>
                                </div>
                            </div>
                            </div>
                            <div className="row">
                                
                            </div>
                            <div className="row">
                                <div className="col-md-12 text-center">
                                    {renderSubmitButton()}
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
