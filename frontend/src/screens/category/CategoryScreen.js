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
import { createCategory, listCategories, deleteCategory } from "../../actions/categoryActions";

/* Styles */
import { modalStyles } from "../../utils/styles";

const CategoryScreen = ({ history, match }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [name, setName] = useState("");
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { loading, error, categories, page, pages } = categoryList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const categoryDelete = useSelector((state) => state.categoryDelete || {});
    const { success: deleteSuccess } = categoryDelete;

    const categoryCreate = useSelector((state) => state.categoryCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = categoryCreate;

    useEffect(() => {
        dispatch(listCategories(keyword, pageNumber));

        if (createSuccess) {
            setName("");
            setModalIsOpen(false);
        }
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const category = {
                name: name,
            };

            dispatch(createCategory(category));
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
            <p>¿Estás seguro que deseas eliminar esta categoría?</p>
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
        dispatch(deleteCategory(id));
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
                <h2 style={{fontSize: "24px", fontWeight: 'normal'}}>Creación de Categorías</h2>
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
                    <th>Nombre</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {categories.map((category) => (
                    <tr key={category.id}>
                        <td>{category.id}</td>
                        <td>{category.name}</td>
                        <td className="d-none d-sm-table-cell">
                            {category.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            <Link
                                to={`/category/${category.id}/edit`}
                                className="btn btn-warning btn-lg"
                            >
                                Editar
                            </Link>
                        </td>
                        <td>
                            <button
                                onClick={() => handleDeleteClick(category.id)}
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
            <HeaderContent name={"Categorías"} />

            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateCategory()}
                    {renderDeleteConfirmationModal()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Categorías</h3>
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

export default CategoryScreen;
