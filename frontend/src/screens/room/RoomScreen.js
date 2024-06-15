import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Actions */
import { listRooms, createRoom, deleteRoom } from "../../actions/roomActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const RoomScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [active_status, setActiveStatus] = useState(0);
    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const roomList = useSelector((state) => state.roomList);
    const { loading, error, rooms, page, pages } = roomList;

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [roomIdToDelete, setRoomIdToDelete] = useState(null);

    const roomCreate = useSelector((state) => state.roomCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = roomCreate;

    const roomDelete = useSelector((state) => state.roomDelete || {});
    const { success: deleteSuccess } = roomDelete;

    useEffect(() => {
        dispatch(listRooms(keyword, pageNumber));
        if (createSuccess) {
            setName("");
            setActiveStatus(0);
            setModalIsOpen(false);
            dispatch(listRooms(keyword, pageNumber)); // <-- Vuelve a cargar la lista de habitaciones
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre o número de habitación es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const room = {
                name: name,
                active_status: 0,
            };

            dispatch(createRoom(room));
        }
    };

    const renderDeleteConfirmationModal = () => (
        <Modal
            style={modalStyles}
            isOpen={confirmDelete}
            onRequestClose={() => setConfirmDelete(false)}
        >
            <h2 style={{ fontSize: "24px", fontWeight: 'normal' }}>Confirmar Eliminación</h2>
            <hr />
            <p>¿Estás seguro que deseas eliminar esta habitación?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(roomIdToDelete)}
                    className="btn btn-danger mx-2"
                >
                    Confirmar
                </button>
                <button
                    onClick={() => setConfirmDelete(false)}
                    className="btn btn-secondary mx-2"
                >
                    Cancelar
                </button>
            </div>
        </Modal>
    );

    const handleDelete = (id) => {
        dispatch(deleteRoom(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setRoomIdToDelete(id);
        setConfirmDelete(true);
    };


    const renderRoom = () => {
        return (
            <table className="table table-hover text-nowrap">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Estatus</th>
                        <th className="d-none d-sm-table-cell">Creada en</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room) => (
                        <tr key={room.id}>
                            <td>{room.id}</td>
                            <td>{room.name}</td>
                            <td>{room.active_status === 0 ? 'Inactivo' : 'Activo'}</td>
                            <td className="d-none d-sm-table-cell">
                                {room.createdAt.slice(0, 10)}
                            </td>
                            <td>
                                <Link
                                    to={`/room/${room.id}/edit`}
                                    className="btn btn-warning btn-lg mr-3"
                                >
                                    Editar
                                </Link>
                                <button
                                onClick={() => handleDeleteClick(room.id)}
                                className="btn btn-danger btn-lg"
                            >
                                Eliminar
                            </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderModalCreateRoom = () => (
        <>
            <ModalButton
                modal={modalIsOpen}
                setModal={setModalIsOpen}
                classes={"btn-success btn-lg mb-2"}
            />
            <Modal
                style={modalStyles}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <h2 style={{fontSize: "30px", fontWeight: 'normal'}}>Creación de Habitaciones</h2>
                <hr />
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"nombre o número"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                    <hr />
                    <button type="submit" className="btn btn-primary">
                        Confirmar
                    </button>

                    <ModalButton
                        modal={modalIsOpen}
                        setModal={setModalIsOpen}
                        classes={"btn-danger float-right"}
                    />
                </form>
            </Modal>
        </>
    );

    return (
        <>
            <HeaderContent name={"Habitaciones"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateRoom()}
                    {renderDeleteConfirmationModal()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Mesas</h3>
                                    <div className="card-tools">
                                        <Search
                                            keyword={keyword}
                                            setKeyword={setKeyword}
                                            setPage={setPageNumber}
                                        />
                                    </div>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body table-responsive p-0">
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        loader={<DataTableLoader />}
                                        render={renderRoom}
                                    />
                                </div>
                                {/* /.card-body */}
                            </div>
                            <Pagination
                                page={page}
                                pages={pages}
                                setPage={setPageNumber}
                            />
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

export default RoomScreen;
