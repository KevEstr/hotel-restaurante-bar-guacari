import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Message from "../../components/Message";
import Select from "../../components/Select";
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";

/* Constants */
import {
    INGREDIENT_UPDATE_RESET,
    INGREDIENT_DETAILS_RESET,
} from "../../constants/ingredientConstants";

/* Actions */
import { listCategories } from "../../actions/categoryActions";
import {
    updateIngredient,
    listIngredientDetails,
} from "../../actions/ingredientActions";

const IngredientEditScreen = ({ history, match }) => {
    const ingredientId = parseInt(match.params.id);

    const [name, setName] = useState("");
    const [cost, setCost] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState("");

    const [errors, setErrors] = useState({});

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    //ingredient details state
    const ingredientDetails = useSelector((state) => state.ingredientDetails);
    const { loading, error, ingredient } = ingredientDetails;

    //ingredient update state
    const ingredientUpdate = useSelector((state) => state.ingredientUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = ingredientUpdate;

    useEffect(() => {
        //after update redirect to users
        if (successUpdate) {
            dispatch({ type: INGREDIENT_UPDATE_RESET });
            dispatch({ type: INGREDIENT_DETAILS_RESET });
            history.push("/ingredient");
        }

        if (ingredient) {
            //load ingredient data
            if (!ingredient.name || ingredient.id !== ingredientId) {
                dispatch(listIngredientDetails(ingredientId));
            } else {
                //set states
                setName(ingredient.name);
                setCost(ingredient.cost);
                setStock(ingredient.stock);
                setCategory(ingredient.categoryId);
            }
        }
    }, [dispatch, history, ingredientId, ingredient, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!cost) {
            errorsCheck.cost = "Precio es requerido";
        }

        if (!stock) {
            errorsCheck.stock = "Inventario es requerido";
        }
        if (!category) {
            errorsCheck.category = "Categoría es requerida";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            dispatch(
                updateIngredient({
                    id: ingredientId,
                    name,
                    cost,
                    stock,
                    category,
                })
            );
        }
    };

    const searchCategories = (e) => {
        dispatch(listCategories(e.target.value));
    };

    const renderCategoriesSelect = () => (
        <Select
            data={category}
            setData={setCategory}
            items={categories}
            search={searchCategories}
        />
    );

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <Input
                name={"nombre"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />

            <Input
                name={"precio"}
                type={"number"}
                data={cost}
                setData={setCost}
                errors={errors}
            />

            <Input
                name={"inventarios"}
                type={"number"}
                data={stock}
                setData={setStock}
                errors={errors}
            />

            {renderCategoriesSelect()}
            {errors.category && (
                <Message message={errors.category} color={"warning"} />
            )}

            <hr />
            <button type="submit" className="btn btn-success">
                Confirmar
            </button>
        </form>
    );

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Ingredientes"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Ingrediente</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                    <LoaderHandler
                                        loading={loadingUpdate}
                                        error={errorUpdate}
                                    />
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                        render={renderForm}
                                    />
                                </div>
                                {/* /.card-body */}
                            </div>
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

export default IngredientEditScreen;
