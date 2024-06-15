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
import { listServices, createService, deleteService } from "../../actions/serviceActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const ServiceScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [serviceIdToDelete, setServiceIdToDelete] = useState(null);


    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const serviceList = useSelector((state) => state.serviceList);
    const { loading, error, services, page, pages } = serviceList;

    const serviceDelete = useSelector((state) => state.serviceDelete || {});
    const { success: deleteSuccess } = serviceDelete;


    const serviceCreate = useSelector((state) => state.serviceCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = serviceCreate;

    useEffect(() => {
        dispatch(listServices(keyword, pageNumber));
        if (createSuccess) {
            setName("");
            setModalIsOpen(false);
            dispatch(listServices(keyword, pageNumber)); // <-- Vuelve a cargar la lista de habitaciones
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre Requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const service = {
                name: name,
            };

            dispatch(createService(service));
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
            <p>¿Estás seguro que deseas eliminar este servicio?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(serviceIdToDelete)}
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
        dispatch(deleteService(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setServiceIdToDelete(id);
        setConfirmDelete(true);
    };

    const renderService = () => {
        return (
            <table className="table table-hover text-nowrap">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th className="d-none d-sm-table-cell">Creada en</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.id}>
                            <td>{service.id}</td>
                            <td>{service.name}</td>
                            <td className="d-none d-sm-table-cell">
                                {service.createdAt.slice(0, 10)}
                            </td>
                            <td>
                                <Link
                                    to={`/service/${service.id}/edit`}
                                    className="btn btn-warning btn-lg mr-3"
                                >
                                    Editar
                                </Link>
                                <button
                                onClick={() => handleDeleteClick(service.id)}
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

    const renderModalCreateService = () => (
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
                <h2 style={{fontSize: "32px", fontWeight: 'normal'}}>Creación de Servicios</h2>
                <hr />
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"Nombre del Servicio"}
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
            <HeaderContent name={"Servicios"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateService()}
                    {renderDeleteConfirmationModal()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Servicios:</h3>
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
                                        render={renderService}
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

export default ServiceScreen;
