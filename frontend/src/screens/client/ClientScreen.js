import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Search from "../../components/Search";
import Pagination from "../../components/Pagination";
import Select from "../../components/Select";
import Message from "../../components/Message";


/* Actions */
import { createClient, listClients, deleteClient} from "../../actions/clientActions";
import { listAgreements } from "../../actions/agreementActions";


/* Styles */
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const ClientScreen = ({ history, match}) => {

    const agreementFromUrl = window.location.href.indexOf("agreement") !== -1;

    const [agreement, setAgreement] = useState(
        agreementFromUrl ? parseInt(match.params.id) : null
    );

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [pageNumber, setPageNumber] = useState(1);
    const [keyword, setKeyword] = useState("");

    const [name, setName] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [dni, setDni] = useState("");
    const [has_reservation, setHasReservation] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [clientIdToDelete, setClientIdToDelete] = useState(null);

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const clientDelete = useSelector((state) => state.clientDelete || {});
    const { success: deleteSuccess } = clientDelete;

    const clientList = useSelector((state) => state.clientList);
    const { loading, error, clients, page, pages } = clientList;

    const agreementList = useSelector((state) => state.agreementList);
    const { agreements } = agreementList;

    const clientCreate = useSelector((state) => state.clientCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = clientCreate;

    useEffect(() => {
        dispatch(listClients(keyword, pageNumber));
        if (createSuccess) {
            setName("");
            setAddress("");
            setPhone("");
            setEmail("");
            setDni("");
            setAgreement("");
            setModalIsOpen(false);
            setHasReservation(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const renderDeleteConfirmationModal = () => (
        <Modal
            style={modalStyles}
            isOpen={confirmDelete}
            onRequestClose={() => setConfirmDelete(false)}
        >
            <h2 style={{ fontSize: "24px", fontWeight: 'normal' }}>Confirmar Eliminación</h2>
            <hr />
            <p>¿Estás seguro que deseas eliminar este cliente?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(clientIdToDelete)}
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
        dispatch(deleteClient(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setClientIdToDelete(id);
        setConfirmDelete(true);
    };


    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!address) {
            errorsCheck.address = "Dirección es requerida";
        }

        if (!phone) {
            errorsCheck.phone = "Teléfono es requerido";
        }
        if (!email) {
            errorsCheck.email = "Email es requerido";
        }

        if (!dni) {
            errorsCheck.dni = "CC requerida";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const client = {
                name: name,
                address: address,
                phone: phone,
                email: email,
                dni: dni,
                agreementId: agreement,
                has_reservation: has_reservation,
            };

            dispatch(createClient(client));
        }
    };

    const searchAgreements = (e) => {
        dispatch(listAgreements(e.target.value));
    };

    const renderAgreementsSelect = () => (
        <Select
            data={agreement}
            setData={setAgreement}
            items={agreements}
            search={searchAgreements}
        />
    );

    const renderModalCreateClient = () => (
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
                <LoaderHandler loading={createLoading} error={createError} />
                <h2 style={{ fontSize: "24px", fontWeight: 'normal' }}>Creación de Clientes</h2>
                <hr />
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ flex: '1 1 45%' }}>
                        <Input
                            name={"nombre"}
                            type={"text"}
                            data={name}
                            setData={setName}
                            errors={errors}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <Input
                            name={"dirección"}
                            type={"text"}
                            data={address}
                            setData={setAddress}
                            errors={errors}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <Input
                            name={"tel"}
                            type={"text"}
                            data={phone}
                            setData={setPhone}
                            errors={errors}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <Input
                            name={"email"}
                            type={"email"}
                            data={email}
                            setData={setEmail}
                            errors={errors}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <Input
                            name={"CC"}
                            type={"text"}
                            data={dni}
                            setData={setDni}
                            errors={errors}
                        />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <label style={{fontWeight: 'normal'}}>Convenio:</label>
                        {renderAgreementsSelect()}
                        {errors.agreement && (
                            <Message message={errors.agreement} color={"warning"} />
                        )}
                    </div>
                    <div style={{ flex: '1 1 100%' }}>
                        <hr />
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <button type="submit" className="btn btn-primary">
                            Confirmar
                        </button>
                    </div>
                    <div style={{ flex: '1 1 45%' }}>
                        <ModalButton
                            modal={modalIsOpen}
                            setModal={setModalIsOpen}
                            classes={"btn-danger float-right"}
                        />
                    </div>
                </form>
            </Modal>
        </>
    );
    

    const renderClientsTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th className="d-none d-sm-table-cell">Dirección</th>
                    <th className="d-none d-sm-table-cell">Tel</th>
                    <th className="d-none d-sm-table-cell">Email</th>
                    <th className="d-none d-sm-table-cell">CC</th>
                    <th className="d-none d-sm-table-cell">Convenio</th>
                    <th className="d-none d-sm-table-cell">¿Cliente Activo?</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client) => (
                    <tr key={client.id}>
                        <td>{client.id}</td>
                        <td>{client.name}</td>
                        <td className="d-none d-sm-table-cell">
                            {client.address}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {client.phone}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {client.email}
                        </td>
                        <td className="d-none d-sm-table-cell">{client.dni}</td>
                        <td className="d-none d-sm-table-cell">
                            {client.agreementId}
                        </td>
                        <td className="d-none d-sm-table-cell">
                        {client.has_reservation ? "Sí" : "No"}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {client.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            <Link
                                to={`/client/${client.id}/edit`}
                                className="btn btn-warning btn-lg mr-3"
                            >
                                Editar
                            </Link>
                            <button
                                onClick={() => handleDeleteClick(client.id)}
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
            <HeaderContent name={"Clientes"} />

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateClient()}
                    {renderDeleteConfirmationModal()}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Clientes</h3>
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
                                        render={renderClientsTable}
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

export default ClientScreen;
