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
    const [lastnames, setLastNames] = useState("");
    const [phone, setPhone] = useState("");
    const [dni, setDni] = useState("");
    const [has_reservation, setHasReservation] = useState(false);
    const [has_order, setHasOrder] = useState(false);
    const [is_active, setIsActive] = useState(true);

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
        dispatch(listClients(keyword, pageNumber, false, true, true));
        dispatch(listAgreements());
        if (createSuccess) {
            setName("");
            setLastNames("");
            setPhone("");
            setDni("");
            setAgreement("");
            setModalIsOpen(false);
            setHasReservation(false);
            setHasOrder(false);
            setIsActive(true);
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

    const getAgreementName = (agreementId) => {
        if (agreements && agreements.length > 0) {
          const agreement = agreements.find((agreement) => agreement.id === agreementId);
          return agreement ? agreement.name : '';
        }
        return '';
      };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const client = {
                name: name,
                lastnames: lastnames,
                phone: phone,
                dni: dni,
                agreementId: agreement,
                has_reservation: has_reservation,
                has_order: has_order,
                is_active: is_active,
            };

            console.log('datos del cliente' + name, lastnames, phone, dni, agreement, has_reservation, has_order, is_active)
            console.log(client)

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
                            name={"apellidos"}
                            type={"text"}
                            data={lastnames}
                            setData={setLastNames}
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
                    <th className="text-center">ID</th>
                    <th className="text-center">Nombre</th>
                    <th className="text-center">Apellidos</th>
                    <th className="text-center d-none d-sm-table-cell">Tel</th>
                    <th className="text-center d-none d-sm-table-cell">CC</th>
                    <th className="text-center d-none d-sm-table-cell">Convenio</th>
                    <th className="text-center d-none d-sm-table-cell">Usuario Activo?</th>
                    <th className="text-center d-none d-sm-table-cell">¿Tiene Reserva Activa?</th>
                    <th className="text-center d-none d-sm-table-cell">¿Tiene Órden Activa?</th>
                    <th className="text-center d-none d-sm-table-cell">Creado en</th>
                    <th className="text-center"></th>
                </tr>
            </thead>
            <tbody>
                {clients.map((client) => (
                    <tr key={client.id} style={{
                        backgroundColor: client.is_active ? "#c3e6cb" : "#f5c6cb"
                    }}>
                        <td className="text-center">{client.id}</td>
                        <td className="text-center">{client.name}</td>
                        <td className="text-center">{client.lastnames}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.phone}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.dni}</td>
                        <td className="text-center d-none d-sm-table-cell">{getAgreementName(client.agreementId)}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.is_active ? "Sí" : "No"}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.has_reservation ? "Sí" : "No"}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.has_order ? "Sí" : "No"}</td>
                        <td className="text-center d-none d-sm-table-cell">{client.createdAt.slice(0, 10)}</td>
                        <td className="text-center">
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
