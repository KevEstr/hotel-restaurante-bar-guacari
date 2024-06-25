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
import Select from "../../components/Select";
import Message from "../../components/Message";

/* Actions */
import { createLaundry, listLaundries, deleteLaundry } from "../../actions/laundryActions";
import { listClients } from "../../actions/clientActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

const LaundryScreen = ({ history, match }) => {

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [client, setClient] = useState(null);
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    const dispatch = useDispatch();

    const laundryList = useSelector((state) => state.laundryList);
    const { loading, error, laundries, page, pages } = laundryList;

    console.log(laundries);

    const clientList = useSelector((state) => state.clientList);
    const { clients } = clientList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const laundryDelete = useSelector((state) => state.laundryDelete || {});
    const { success: deleteSuccess } = laundryDelete;

    const laundryCreate = useSelector((state) => state.laundryCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = laundryCreate;

    useEffect(() => {
        dispatch(listLaundries(keyword, pageNumber));
        dispatch(listClients("", "", true));

        if (createSuccess) {
            setQuantity("");
            setPrice("");
            setModalIsOpen(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!quantity) {
            errorsCheck.name = "Cantidad es requerida";
        }
        if (!price) {
            errorsCheck.name = "Precio es requerido";
        }
        if (!client) {
            errorsCheck.client = "Cliente es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const laundry = {
                quantity: quantity,
                price: price,
                clientId: client,
            };

            dispatch(createLaundry(laundry));
        }
    };

    const searchClients = (e) => {
        dispatch(listClients(e.target.value, "",true));
    };

    const getClientName = (clientId) => {
        if (clients && clients.length > 0) {
          const client = clients.find((client) => client.id === clientId);
          return client ? client.name : '';
        }
        return '';
      };

    const renderClientsSelect = () => (
        <>
            <Select
                data={client}
                setData={setClient}
                items={clients.filter(client => client.has_reservation)}
                search={searchClients}
            />
            {errors.client && (
                <Message message={errors.client} color={"warning"} />
            )}
        </>
    );

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
                    onClick={() => handleDelete(categoryIdToDelete)}
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
        dispatch(deleteLaundry(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setCategoryIdToDelete(id);
        setConfirmDelete(true);
    };

    const renderModalCreateCategory = () => (
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
                <h2 style={{fontSize: "24px", fontWeight: 'normal'}}>Servicio de Lavanderia</h2>
                <hr />
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                Selecciona el cliente:
                        <div className="form-group">
                            {renderClientsSelect()}
                        </div>
                <div className="row">
                    <div className="col-md-6">
                        <Input
                            name={"cantidad"}
                            type={"text"}
                            data={quantity}
                            setData={setQuantity}
                            errors={errors}
                        />
                    </div>
                    <div className="col-md-6">
                        <Input
                            name={"precio"}
                            type={"text"}
                            data={price}
                            setData={setPrice}
                            errors={errors}
                        />
                    </div>
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
                    <th>Cantidad</th>
                    <th>Precio</th>
                    <th>Cliente</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {laundries.map((laundry) => (
                    <tr key={laundry.id}>
                        <td>{laundry.id}</td>
                        <td>{laundry.quantity}</td>
                        <td>{laundry.price}</td>
                        <td>{getClientName(laundry.clientId)}</td>
                        <td className="d-none d-sm-table-cell">
                            {laundry.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            <Link
                                to={`/laundry/${laundry.id}/edit`}
                                className="btn btn-warning btn-lg"
                            >
                                Editar
                            </Link>
                        </td>
                        <td>
                            <button
                                onClick={() => handleDeleteClick(laundry.id)}
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
            <HeaderContent name={"Lavandería"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateCategory()}
                    {renderDeleteConfirmationModal()}
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Lavandería</h3>
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

export default LaundryScreen;
