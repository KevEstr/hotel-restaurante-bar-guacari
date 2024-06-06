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
import { listServices } from '../../actions/serviceActions';
import { listAgreements } from '../../actions/agreementActions';


const ReservationCreateScreen = ({ history, match }) => {
    /* Get table from url */
    const roomFromUrl = window.location.href.indexOf("room") !== -1;
    
    /* State */
    const [room, setRoom] = useState(
        roomFromUrl ? parseInt(match.params.id) : null
    );

    const [selectedRooms, setSelectedRooms] = useState([]);
    const [reservationId, setReservationId] = useState(null);
    const [client, setClient] = useState(null);
    const [note, setNote] = useState("");
    const [errors, setErrors] = useState({});
    const [price, setPrice] = useState(0);
    const [start_date, setStartDate] = useState("");
    const [end_date, setEndDate] = useState("");
    const [quantity, setQuantity] = useState(null);
    const [selectedServices, setSelectedServices] = useState([]);
    const [clientAgreement, setClientAgreement] = useState(null);


    const [total, setTotal] = useState(0);

    const [clientAgreementId, setClientAgreementId] = useState(null);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const roomList = useSelector((state) => state.roomList);
    const { rooms } = roomList;

    const serviceList = useSelector((state) => state.serviceList);
    const { services } = serviceList;

    //reservation create state
    const reservationCreate = useSelector((state) => state.reservationCreate);
    const { success, loading, error, reservation } = reservationCreate;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements, loading: loadingAgreements, error: errorAgreements } = agreementList;


    /*useEffect(() => {
        dispatch(allRooms());
    }, [dispatch, history, userInfo]);*/

    useEffect(() => {
        dispatch(allRooms());
        dispatch(listClients())
  }, [dispatch]);

  useEffect(() => {
    dispatch(listAgreements());
}, [dispatch]);

    useEffect(() => {
        dispatch(listServices());
    }, [dispatch]);
    
      useEffect(() => {
        //dispatch(allRooms());
        if (success) {
            dispatch(listServices());
            dispatch({ type: RESERVATION_CREATE_RESET });
            history.push("/activeReservation");
        }
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
        if(selectedServices.length<1){
            errorsCheck.selectedServices = "Debe seleccionar al menos 1 servicio";
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
                rooms: selectedRooms,
                price: price,
                start_date: start_date,
                end_date: end_date,
                quantity: quantity,
                paymentId: 0,
                note: note,
                is_paid: 0,
                services: selectedServices,

                total: calculatedTotal,
            };
            /* Make request */

            dispatch(updateClientHasReservation(reservation.clientId, true));
            dispatch(createReservation(reservation));
            console.log("Datos de la reserva:", reservation);
            setReservationId(reservation.id);
        }
    };

    /* Filter rooms */
    const filterFreeRooms = () => {
        return rooms.filter((room) => room.active_status === false);
    };

    const searchRooms = (e) => {
        dispatch(allRooms(e.target.value));
    };

    const calculateTotal = (startDate, endDate, pricePerDay) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Milliseconds to days
        return diffDays * pricePerDay;
    };

    const renderRoomsSelect = () => (
        <>
            <h5>Selecciona las habitaciones:</h5>
            {filterFreeRooms().map((room) => (
                <div key={room.id}>
                    <label>
                        <input
                            type="checkbox"
                            checked={selectedRooms.includes(room.id)}
                            onChange={() => handleRoomSelection(room.id)}
                        />
                        Habitación {room.id}
                    </label>
                </div>
            ))}
            {errors.rooms && <Message message={errors.rooms} color={"warning"} />}
        </>
    );

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

    const handleRoomSelection = (roomId) => {
        setSelectedRooms((prevSelectedRooms) => {
            if (prevSelectedRooms.includes(roomId)) {
                return prevSelectedRooms.filter((id) => id !== roomId);
            } else {
                return [...prevSelectedRooms, roomId];
            }
        });
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

                                        <div style={{ flex: '1 1 45%', minWidth: '200px' }}>
                                            <h3 className="card-title">Convenio: </h3>
                                            {console.log("clientAgreement: ", clientAgreement )}
                                            <label htmlFor="clientAgreementName">{clientAgreement && clientAgreement.name }</label>

                                        </div>

                                        <div>
                                            <label htmlFor="servicios">Servicios</label>
                                            <div>{console.log("Services: ",services)}
                                                {clientAgreement && clientAgreement.service && clientAgreement.service.map((service) => (
                                                    <div key={service.id}>
                                                        <label>
                                                            <input
                                                                type="checkbox"
                                                                value={service.id}
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
                                                    value={service.maxLimit}
                                                    onChange={(e) => handleServiceChange(e, service.id)}
                                                />
                                            </div>
                                        ))}
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
