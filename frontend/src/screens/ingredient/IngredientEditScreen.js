import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

/* Components */
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Message from "../../components/Message";


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
    const [concept, setConcept] = useState("");
    const [operation, setOperation] = useState(""); // Por defecto entrada
    const [totalPrice, setTotalPrice] = useState(null); // Por defecto entrada
    const [quantity, setQuantity] = useState(null);
    const [showPrice, setShowPrice] = useState(true);
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
                setIngredientType(ingredient.ingredientType ? 'Peso' : 'Unidad');
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

        if (!quantity || quantity <= 0) {
            errorsCheck.quantity = "Cantidad es requerida y debe ser mayor que cero";
        }

        if (!concept) {
            errorsCheck.concept = "Concepto es requerido";
        }
        if (!totalPrice && operation === 'entrada') {
            errorsCheck.concept = "Precio de compra es requerido";
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
                    quantity,
                    concept,
                    operation,
                    totalPrice,
                })
            );
        }
    };

    const handleOperationChange = (operation) => {
        console.log('Operation selected:', operation); // Registro de la operación seleccionada
        setOperation(operation);
        setShowPrice(operation !== 'entrada');

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
            {console.log('showPrice:', showPrice)}
            <div className="form-row" style={{marginTop: '20px'}}>
                <div className="form-group col-md-4">
                    <Input
                        name={"nombre"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                </div>
                <div className="form-group col-md-3">
                    <label style={{fontWeight: 'normal'}}>Tipo de Ingrediente:</label>
                    <input type="text" className="form-control" value={ingredientType} readOnly />
                </div>
                <div className="form-group col-md-4">
                    <label style={{fontWeight: 'normal'}}>Cantidad en el Inventario:</label>
                    <input type="text" className="form-control" value={stock} readOnly />
                    {stock < 0 && 
                        <Message 
                            message={`Este ingrediente tiene existencia negativa, se recomienda realizar inventario y registrar la entrada de mercancía actual.<br /> 
                            <br /> 
                            <strong>NOTA:</strong> El ajuste de cantidad ${stock} se realiza de forma automática.`} 
                            color={"danger"} 
                        />
                    }
                </div>
            </div>
            <div className="form-row" style={{marginTop: '20px'}}>
                
                <div className="form-group col-md-3">
                <label style={{fontWeight: 'normal', marginBottom: '10px', textAlign: 'center'}}>Tipo de Movimiento:</label>
                <div style={{marginTop: '5px'}}>
                    <label style={{marginRight: '20px', fontWeight: 'normal'}}>
                        <input
                            type="radio"
                            name="operation"
                            value="entrada"
                            checked={operation === 'entrada'}
                            onChange={() => handleOperationChange('entrada')}
                            style={{marginRight: '5px', fontWeight: 'normal'}}
                        /> Entrada
                        </label>
                        <label style={{fontWeight: 'normal'}}>
            <input
                type="radio"
                name="operation"
                value="salida"
                checked={operation === 'salida'}
                onChange={() => handleOperationChange('salida')}
                style={{marginRight: '5px'}}
            /> Salida
        </label>
    </div>
</div>

                <div className="form-group col-md-2" style={{marginLeft: '-15px'}}>
                    <Input
                        name={"Cantidad"}
                        type={"number"}
                        data={quantity}
                        setData={setQuantity}
                        errors={errors}
                    />
                </div>
                <div className="form-group col-md-6">
                    <Input
                        name={"Concepto"}
                        type={"text"}
                        data={concept}
                        setData={setConcept}
                        errors={errors}
                    />
                </div>
            </div>
            <div className="form-row">
                <Input
                    name={"Precio de compra"}
                    type={"number"}
                    data={totalPrice}
                    setData={setTotalPrice}
                    errors={errors}
                    hidden={showPrice}
                />
            </div>
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
                        <div className="col-12 col-md-11">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Ingrediente</h3>
                                </div>
                                {/* /.card-header */}
                                <div className="card-body">
                                <div style={{ backgroundColor: "#FFF9BA", borderColor: "black", padding: "15px", borderRadius: "10px", maxWidth: "900px", margin: "0 auto"}}>
                                    Para actualizar el inventario, selecciona el tipo de movimiento que deseas realizar: 'ENTRADA' sumará unidades al inventario - 'SALIDA' retirará unidades del inventario. En concepto, puedes identificar la razón del movimiento.
                                </div>
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
