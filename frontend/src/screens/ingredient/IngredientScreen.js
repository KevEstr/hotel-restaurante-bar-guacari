import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";

/* Actions */
import { listIngredients, createIngredient } from "../../actions/ingredientActions";

/* Styles */
import { modalStyles } from "../../utils/styles";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";

Modal.setAppElement("#root");

const IngredientScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [ingredientType, setIngredientType] = useState(5);
    const [stock, setStock] = useState(0);

    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const dispatch = useDispatch();

    const ingredientList = useSelector((state) => state.ingredientList);
    const { loading, error, ingredients, page, pages } = ingredientList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const ingredientCreate = useSelector((state) => state.ingredientCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = ingredientCreate;

    useEffect(() => {
        if (createSuccess) {
            setName("");
            setIngredientType(5);
            setStock(0);
            setModalIsOpen(false);
        }
        dispatch(listIngredients(keyword, pageNumber));
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submit initiated');  // Asegúrate de que el submit se esté ejecutando

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (ingredientType === null || ingredientType === undefined){
            errorsCheck.ingredientType = "Tipo de Ingrediente es requerido";
        }
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const ingredient = {
                name: name,
                ingredientType: ingredientType,
                stock: stock
            };

            console.log('TIPO DE INGREDIENTE ENVIADO: ', ingredient.ingredientType);

            dispatch(createIngredient(ingredient));
        }
    };

    const RadioButtonGroup = ({ name, options, selectedOption, setSelectedOption, errors }) => {
        return (
            <div>
                {options.map(option => (
                    <label key={option}>
                        <input
                            type="radio"
                            name={name}
                            value={option}
                            checked={selectedOption === option}
                            onChange={(e) => setSelectedOption(Number(e.target.value))}
                        />
                        {option}
                    </label>
                ))}
                {errors && errors[name] && <div className="error">{errors[name]}</div>}
            </div>
        );
    };


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
                <h2>Formulario Creación</h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        name={"name"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                    <label>Cantidad Por:</label>
                    <RadioButtonGroup
                        name={"ingredientType"}
                        options={[1,0]}
                        selectedOption={ingredientType}  // Usar ingredientType directamente
                        setSelectedOption={setIngredientType}  // Establecer el estado directamente
                        errors={errors}
                    />

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

    const renderIngredientsTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Tipo de Ingrediente</th>
                    <th>Inventario</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {ingredients.map((ingredient) => (
                    <tr key={ingredient.id}>
                        <td>{ingredient.id}</td>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.ingredientType}</td>
                        <td>{ingredient.stock}</td>
                        <td className="d-none d-sm-table-cell">
                            {ingredient.createdAt.slice(0, 10)}
                        </td>
                        <td>
                            <Link
                                to={`/ingredient/${ingredient.id}/edit`}
                                className="btn btn-warning btn-lg"
                            >
                                Editar
                            </Link>
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
