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
import { listTables, deleteTable } from "../../actions/tableActions";
import { createTable } from "../../actions/tableActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const TableScreen = ({ history }) => {
    const [name, setName] = useState("");

    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [tableIdToDelete, setTableIdToDelete] = useState(null);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const tableDelete = useSelector((state) => state.tableDelete || {});
    const { success: deleteSuccess } = tableDelete;

    const tableList = useSelector((state) => state.tableList);
    const { loading, error, tables, page, pages } = tableList;

    const tableCreate = useSelector((state) => state.tableCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = tableCreate;

    useEffect(() => {
        dispatch(listTables(keyword, pageNumber));
        if (createSuccess) {
            setName("");
            setModalIsOpen(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre o número de mesa es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const table = {
                name: name,
            };

            dispatch(createTable(table));
        }
    };

    const renderTable = () => {
        return (
            <table className="table table-hover text-nowrap">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Número</th>
                        <th>Ocupada</th>
                        <th className="d-none d-sm-table-cell">Creada en</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {tables.map((table) => (
                        <tr key={table.id}>
                            <td>{table.id}</td>
                            <td>{table.name}</td>
                            <td>
                                {table.occupied ? (
                                    <h4 className="text-success">
                                        <i className="fas fa-check"></i>
                                    </h4>
                                ) : (
                                    <h4 className="text-danger">
                                        <i className="far fa-times-circle"></i>
                                    </h4>
                                )}
                            </td>
                            <td className="d-none d-sm-table-cell">
                                {table.createdAt.slice(0, 10)}
                            </td>
                            <td>
                                <Link
                                    to={`/table/${table.id}/edit`}
                                    className="btn btn-warning btn-lg mr-3"
                                >
                                    Editar
                                </Link>
                                <button
                                onClick={() => handleDeleteClick(table.id)}
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

    const renderDeleteConfirmationModal = () => (
        <Modal
            style={modalStyles}
            isOpen={confirmDelete}
            onRequestClose={() => setConfirmDelete(false)}
        >
            <h2 style={{ fontSize: "24px", fontWeight: 'normal' }}>Confirmar Eliminación</h2>
            <hr />
            <p>¿Estás seguro que deseas eliminar esta mesa?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(tableIdToDelete)}
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
        dispatch(deleteTable(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setTableIdToDelete(id);
        setConfirmDelete(true);
    };

    const renderModalCreateTable = () => (
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
                <h2 style={{fontSize: "32px", fontWeight: 'normal'}}>Creación de Mesas</h2>
                <hr />
                <LoaderHandler loading={createLoading} error={createError} />
                <form onSubmit={handleSubmit}>
                    <Input
                        name={"nombre o número de la mesa"}
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
            <HeaderContent name={"Mesas"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateTable()}
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

export default TableScreen;
