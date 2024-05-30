import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
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
import {
    updateIngredient,
    listIngredientDetails,
} from "../../actions/ingredientActions";

const IngredientEditScreen = ({ history, match }) => {
    const ingredientId = parseInt(match.params.id);

    const [name, setName] = useState("");
    const [ingredientType, setIngredientType] = useState(null);
    const [stock, setStock] = useState(0);
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();

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
                setIngredientType(ingredient.ingredientType);
                setStock(ingredient.stock);
            }
        }
    }, [dispatch, history, ingredientId, ingredient, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!ingredientType){
            errorsCheck.ingredientType = "Tipo de Ingrediente Requerido"
        }

        if (!stock) {
            errorsCheck.stock = "Inventario es requerido";
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
                    ingredientType,
                    stock
                })
            );
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
                            onChange={(e) => setSelectedOption(e.target.value)}
                        />
                        {option}
                    </label>
                ))}
                {errors && errors[name] && <div className="error">{errors[name]}</div>}
            </div>
        );
    };
  
    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <Input
                name={"nombre"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />
            <div className="form-group">
                <label>Tipo de Ingrediente:</label>
                <input type="text" className="form-control" value={ingredientType} readOnly />
            </div>
            <div className="form-group">
                <label>Cantidad en el Inventario:</label>
                <input type="text" className="form-control" value={stock} readOnly />
            </div>
            <label>Tipo de Movimiento:</label>
            <RadioButtonGroup
                        name={"ingredientType"}
                        options={["ENTRADA", "SALIDA"]}
                        selectedOption={ingredientType}  // Usar ingredientType directamente
                        setSelectedOption={setIngredientType}  // Establecer el estado directamente
                        errors={errors}
            />
            <Input
                name={"Agregar Existencia"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />
            <Input
                name={"Concepto"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />

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
