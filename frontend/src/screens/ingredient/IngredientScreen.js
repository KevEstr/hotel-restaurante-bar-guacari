import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Message from "../../components/Message";


/* Actions */
import { listIngredients, createIngredient, deleteIngredient } from "../../actions/ingredientActions";

/* Styles */
import { modalStyles } from "../../utils/styles";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

Modal.setAppElement("#root");

const IngredientScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [ingredientType, setIngredientType] = useState(false);
    const [stock, setStock] = useState(0);
    const [minQty, setMinQty] = useState(0);

    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const dispatch = useDispatch();

    const ingredientList = useSelector((state) => state.ingredientList);
    const { loading, error, ingredients, page, pages } = ingredientList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [ingredientIdToDelete, setIngredientIdToDelete] = useState(null);
    
    const ingredientDelete = useSelector((state) => state.ingredientDelete || {});
    const { success: deleteSuccess } = ingredientDelete;
    
    const ingredientCreate = useSelector((state) => state.ingredientCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = ingredientCreate;

    useEffect(() => {
        if (createSuccess) {
            setName("");
            setStock(0);
            setModalIsOpen(false);
        }
        dispatch(listIngredients(keyword, pageNumber));
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    const renderDeleteConfirmationModal = () => (
        <Modal
            style={modalStyles}
            isOpen={confirmDelete}
            onRequestClose={() => setConfirmDelete(false)}
        >
            <h2 style={{ fontSize: "24px", fontWeight: 'normal' }}>Confirmar Eliminación</h2>
            <hr />
            <p className="text-center">¿Estás seguro que deseas eliminar este ingrediente?</p>
            <div className="d-flex justify-content-center mt-4">
                <button
                    onClick={() => handleDelete(ingredientIdToDelete)}
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
        dispatch(deleteIngredient(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setIngredientIdToDelete(id);
        setConfirmDelete(true);
    };

    /*useEffect(() => {
        const negativeStockIngredients = ingredients.filter(ingredient => ingredient.stock < 0);
        if (negativeStockIngredients.length > 0) {
            const ingredientNames = negativeStockIngredients.map(ingredient => ingredient.name).join(', ');
            alert(`EXISTENCIA NEGATIVA: Se recomienda realizar inventario de los ingredientes ${ingredientNames} y realizar la entrada respectiva`);
        }
    }, [ingredients]);*/

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submit initiated');  // Asegúrate de que el submit se esté ejecutando

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!minQty) {
            errorsCheck.minQty = "Cantidad mínima es requerida para ingredientes";
        }
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const ingredient = {
                name: name,
                stock: 0,
                minQty: minQty,
            };

            dispatch(createIngredient(ingredient));
        }
    };

    const RadioButtonGroup = ({ name, options, selectedOption, setSelectedOption, errors }) => {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}> {/* Flexbox para centrar y espaciar */}
                {options.map(option => (
                    <label key={option.value} style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', marginRight: '20px' }}> {/* Flexbox para alinear verticalmente */}
                        <input
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={selectedOption === (option.value === 'true')}
                            onChange={(e) => setSelectedOption(e.target.value === 'true')}
                        />
                        <span>{option.label}</span>
                    </label>
                ))}
                {errors && errors[name] && <div className="error">{errors[name]}</div>}
            </div>
        );
    };

    const radioOptions = [
        { label: 'Peso', value: 'true' },
        { label: 'Unidad', value: 'false' }
    ];


    const renderModalCreateIngredient = () => (
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
                <h2 style={{fontSize: "24px", fontWeight: 'normal'}}>Creación de Ingredientes</h2>
                <hr />

                <form onSubmit={handleSubmit}>
                    <Input
                        name={"Nombre"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />

                    <div className="col-12 col-md-4 mb-3" style={{ textAlign: 'center', marginTop: '10px' }}>
                        <Input name={"cantidad mínima en gr/und"} type={"number"} data={minQty} setData={setMinQty} errors={errors} />
                        {errors.minQty && <Message message={errors.minQty} color={"warning"} />}
                    </div>
                    

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

    const renderNegativeStockIngredients = () => {
        const negativeStockIngredients = ingredients.filter(ingredient => ingredient.stock < 0);
        if (negativeStockIngredients.length === 0) return null;

        return (
            <div className="alert alert-danger mt-3">
                <strong>EXISTENCIA NEGATIVA:</strong> Se recomienda realizar inventario de los siguientes ingredientes y realizar la entrada respectiva:
                <ul>
                    {negativeStockIngredients.map(ingredient => (
                        <li key={ingredient.id}>{ingredient.name}</li>
                    ))}
                </ul>
            </div>
        );
    };

    const renderIngredientsTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Cantidad mínima</th>
                    <th>Inventario</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {ingredients.map((ingredient) => (
                    <tr key={ingredient.id} style={{ backgroundColor: ingredient.stock <= ingredient.minQty ? '#f8d7da' : 'inherit' }}>
                        <td>{ingredient.id}</td>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.minQty}</td>
                        <td style={{ color: ingredient.stock < 0 ? 'red' : 'inherit' }}>
                            {ingredient.stock}
                        </td>
                        <td>
                            <Link
                                to={`/ingredient/${ingredient.id}/edit`}
                                className="btn btn-warning btn-lg mr-3"
                            >
                                Editar
                            </Link>

                            <button
                                onClick={() => handleDeleteClick(ingredient.id)}
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
            <HeaderContent name={"Ingredientes"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateIngredient()}
                    {renderDeleteConfirmationModal()}
                    {renderNegativeStockIngredients()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Ingredientes
                                    </h3>
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
                                        render={renderIngredientsTable}
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

export default IngredientScreen;
