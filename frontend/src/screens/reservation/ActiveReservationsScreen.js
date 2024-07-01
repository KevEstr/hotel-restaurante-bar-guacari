import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Table from "../../components/TableReservation";
import {
    OccupiedTableLoader,
    FreeTableLoader,
} from "../../components/loader/SkeletonLoaders";

/* Actions */
import { allRooms } from "../../actions/roomActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const ActiveReservationsScreen = ({ history }) => {
    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const roomAll = useSelector((state) => state.roomAll);
    const { loading, error, rooms } = roomAll;

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [selectedRooms, setSelectedRooms] = useState([]);
    const [multiSelect, setMultiSelect] = useState(false);

    useEffect(() => {
        dispatch(allRooms());
    }, [dispatch, history, userInfo]);

    const occupiedTableLoader = () => {
        let tableSkeleton = [];
        for (let i = 0; i < 16; i++) {
            tableSkeleton.push(
                <div className="col-12 col-md-6 col-lg-4 col-xl-3" key={i}>
                    {" "}
                    <OccupiedTableLoader />{" "}
                </div>
            );
        }
        return tableSkeleton;
    };

    const freeTableLoader = () => {
        let tableSkeleton = [];
        for (let i = 0; i < 6; i++) {
            tableSkeleton.push(
                <div className="col-12" key={i}>
                    {" "}
                    <FreeTableLoader />{" "}
                </div>
            );
        }
        return tableSkeleton;
    };

    const handleRoomSelection = (roomId) => {
        setSelectedRooms((prevSelected) => {
            if (prevSelected.includes(roomId)) {
                return prevSelected.filter((id) => id !== roomId);
            } else {
                return [...prevSelected, roomId];
            }
        });
    };

    const filterRoomsByState = (active_status) => {
        return rooms.filter((room) => room.active_status === active_status);
    };

    const renderOccupiedTables = () =>
        filterRoomsByState(1).map((room) => (
            <div key={room.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                <Table room={room} />
            </div>
        ));

        const renderFreeRooms = () =>
            filterRoomsByState(0).map((room) => (
                <button
                    key={room.id}
                    onClick={() => handleRoomSelection(room.id)}
                    className={`btn btn-block btn-lg ${selectedRooms.includes(room.id) ? 'btn-success' : 'btn-danger'}`}
                >
                    <p className="text-center my-0">
                        <i className="fas fa-solid fa-bed float-left my-1"></i>
                        {room.name}
                    </p>
                </button>
            ));
    
            const handleSendSelectedRooms = () => {
                if (selectedRooms.length > 0) {
                    const firstSelectedRoomId = selectedRooms[0];
                    history.push({
                        pathname: `/reservation/create/${firstSelectedRoomId}/room`,
                        state: { selectedRooms },
                    });
                } else {
                    // Puedes manejar el caso en que no haya habitaciones seleccionadas, por ejemplo mostrando un mensaje de error
                    alert('Por favor, seleccione al menos una habitación.');
                }
            };
        

    const handleMaintenanceRoomClick = (room) => {
        setSelectedRoom(room);
        setModalIsOpen(true);
    };

    const renderMaintenanceRooms = () =>
        filterRoomsByState(2).map((room) => (
            <button
                key={room.id}
                onClick={() => handleMaintenanceRoomClick(room)}
                className="btn btn-block btn-warning btn-lg"
            >
                <p className="text-center my-0">
                    <i className="fas fa-solid fa-bed float-left my-1"></i>
                    {room.name}
                </p>
            </button>
        ));

    return (
        <>
            <HeaderContent name={"Reservaciones"} />
            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12 col-md-9 col-lg-9">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Habitaciones Ocupadas</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <div className="row">
                                        <LoaderHandler
                                            loading={loading}
                                            error={error}
                                            loader={occupiedTableLoader()}
                                            render={renderOccupiedTables}
                                        />
                                    </div>
                                </div>
                                {/* /.card-body */}
                            </div>
                        </div>
                        {/* /.col */}
                        <div className="col-12 col-md-3 col-lg-3">
                            <div className="card mb-3">
                                <div className="card-header">Habitaciones Disponibles</div>
                                <div className="card-body">
                                    <button
                                        onClick={handleSendSelectedRooms}
                                        className="btn btn-block btn-primary mb-3"
                                    >
                                        Crear Reserva
                                    </button>
                                
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        loader={freeTableLoader()}
                                        render={renderFreeRooms}
                                    />
                            </div>
                            </div>
                            <div className="card">
                                <div className="card-header">En Mantenimiento</div>
                                <div className="card-body">
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        loader={freeTableLoader()}
                                        render={renderMaintenanceRooms}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* /.row */}
                </div>
                {/* /.container-fluid */}
            </section>
            {selectedRoom && (
                <Modal
                    style={modalStyles}
                    isOpen={modalIsOpen}
                    onRequestClose={() => setModalIsOpen(false)}
                >
                    <h2 className="text-center w-100">
                        Habitación en Mantenimiento
                    </h2>
                    <hr />
                    <p className="text-center w-100">Motivo: {selectedRoom.concept}</p>
                    <div className="d-flex justify-content-center mt-4">
                    <button
                            onClick={() => window.location.href = '/room'}
                            className="btn btn-info mx-2"
                        >
                            Ir a Habitaciones
                        </button>
                        <button
                            onClick={() => setModalIsOpen(false)}
                            className="btn btn-danger mx-2"
                        >
                            Cerrar
                        </button>
                    </div>
                </Modal>
            )}
        </>
    );
};

export default ActiveReservationsScreen;
