import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import ModalButton from "../../components/ModalButton";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";

/* Actions */
import { createAgreement, listAgreements, deleteAgreement } from "../../actions/agreementActions";
import { getServices } from '../../actions/serviceActions';
import { listServices } from "../../actions/serviceActions"; 

/* Styles */
import { modalStyles } from "../../utils/styles";

const AgreementScreen = ({ history, match }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const [name, setName] = useState("");
    const [userId, setUserId] = useState("");
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);

    const dispatch = useDispatch();

    const agreementList = useSelector((state) => state.agreementList);
    const { loading, error, agreements, page, pages } = agreementList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [agreementIdToDelete, setAgreementIdToDelete] = useState(null);

    const [serviceIds, setServiceIds] = useState([]);

    const serviceList = useSelector((state) => state.serviceList);
    const { services } = serviceList;
    const [selectedServices, setSelectedServices] = useState([]);

    const agreementDelete = useSelector((state) => state.agreementDelete || {});
    const { success: deleteSuccess } = agreementDelete;

    const agreementCreate = useSelector((state) => state.agreementCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = agreementCreate;

    useEffect(() => {
        dispatch(listAgreements(keyword, pageNumber));
        dispatch(listServices());

        if (createSuccess) {
            setName("");
            setUserId("");
            setModalIsOpen(false);
            setSelectedServices([]);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("serviceIds: ", serviceIds);
        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!selectedServices || selectedServices.length === 0) {
            errorsCheck.selectedServices = "Debe seleccionar almenos 1 servicio";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const agreement = {
                name: name,
                userId: userInfo._id,
                serviceIds : selectedServices,
            };

            console.log("agreement: ", agreement);
            dispatch(createAgreement(agreement));
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
            <p>¿Estás seguro que deseas eliminar este convenio?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(agreementIdToDelete)}
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
        dispatch(deleteAgreement(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setAgreementIdToDelete(id);
        setConfirmDelete(true);
    };

    const handleCheckboxChange = (serviceId) => {
        setSelectedServices((prevSelected) => {
            if (prevSelected.includes(serviceId)) {
                console.log("selectedServices: ",selectedServices)
                return prevSelected.filter((id) => id !== serviceId);
            } else {
                console.log("selectedServices: ",selectedServices)
                return [...prevSelected, serviceId];
            }
        });
        
    };

    const renderModalCreateAgreement = () => (
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
                <h2 style={{fontWeight: 'normal' }}>Creación de Convenios</h2>
                <hr />
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"nombre"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                    {errors.name && <Message message={errors.name} color={"warning"} />}
                    <div>
                        <label style={{fontWeight: 'normal' }}>Servicios</label>
                        <div className="form-group">
                            {services.map((service) => (
                                <div key={service.id} className="form-check">
                                    <input
                                        type="checkbox"
                                        id={`service-${service.id}`}
                                        value={service.id}
                                        checked={selectedServices.includes(service.id)}
                                        onChange={() => handleCheckboxChange(service.id)}
                                        className="form-check-input"
                                    />
                                    <label htmlFor={`service-${service.id}`} className="form-check-label">
                                        {service.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.selectedServices && <Message message={errors.selectedServices} color={"warning"} />}
                    </div>
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

    
    const renderTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Convenio</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {agreements.map((agreement) => (
                    <tr key={agreement.id}>
                        <td>{agreement.id}</td>
                        <td>{agreement.name}</td>
                        <td className="d-none d-sm-table-cell">
                            {agreement.createdAt.slice(0, 10)}
                        </td>
                        <td>
                        <Link
                                to={`/agreements/${agreement.id}/edit`}
                                className="btn btn-warning btn-lg mr-3"
                            >
                                Editar
                            </Link>

                            <button
                                onClick={() => handleDeleteClick(agreement.id)}
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

    return (
        <>
            <HeaderContent name={"Convenios"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateAgreement()}
                    {renderDeleteConfirmationModal()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Convenios</h3>
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
                                        render={renderTable}
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

export default AgreementScreen;
