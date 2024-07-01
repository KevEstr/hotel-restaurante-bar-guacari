import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";  // Actualizado

/* Components */
import Message from "../../components/Message";
import Select from "../../components/Select";
import Input from "../../components/form/Input";
import HeaderContent from "../../components/HeaderContent";
import ButtonGoBack from "../../components/ButtonGoBack";
import LoaderHandler from "../../components/loader/LoaderHandler";
import IngredientsCart from "../../components/order/IngredientsCart";
import IngredientsTable from "../../components/order/IngredientsTable";

/* Constants */
import {
    PRODUCT_UPDATE_RESET,
    PRODUCT_DETAILS_RESET,
} from "../../constants/productConstants";

/* Actions */
import { listCategories } from "../../actions/categoryActions";
import {
    updateProduct,
    listProductDetails,
} from "../../actions/productActions";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

const ProductEditScreen = ({ match }) => {
    const { id } = useParams();
    const productId = parseInt(id);
    const history = useHistory();  // Usando useHistory para la navegación
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [minQty, setMinQty] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState("");
    const [isSimple, setIsSimple] = useState(false);
    const [isComposite, setIsComposite] = useState(false);
    const [ingredientsInOrder, setIngredientsInOrder] = useState([]);
    const [errors, setErrors] = useState({});
    const [concept, setConcept] = useState("");
    const [operation, setOperation] = useState(""); // Por defecto entrada
    const [totalPrice, setTotalPrice] = useState(null); // Por defecto entrada
    const [quantity, setQuantity] = useState(null);
    const [showPrice, setShowPrice] = useState(true);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    const productUpdate = useSelector((state) => state.productUpdate);
    const {
        loading: loadingUpdate,
        error: errorUpdate,
        success: successUpdate,
    } = productUpdate;

    useEffect(() => {
        if (successUpdate) {
            dispatch({ type: PRODUCT_UPDATE_RESET });
            dispatch({ type: PRODUCT_DETAILS_RESET });
            if(product.type){
                history.push("/fridgeproduct");
            }
            else{
                history.push("/product");
            }
        } else {
            if (!product.name || product.id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                setName(product.name);
                setPrice(product.price);
                setStock(product.stock);
                setCategory(product.categoryId);
                setIsComposite(product.isComposite);
                setIsSimple(!product.isComposite);
                setMinQty(product.minQty);
                if (product.ingredients) {
                    const ingredients = product.ingredients.map((ingredient) => ({
                        ...ingredient,
                        quantity: ingredient.ProductIngredient.quantity,
                    }));
                    setIngredientsInOrder(ingredients);
                }
            }
        }
    }, [dispatch, history, productId, product, successUpdate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};

        if (isComposite) {
            if (!name) errorsCheck.name = "Nombre es requerido";
            if (!price) errorsCheck.price = "Precio de venta es requerido";
            if (!category) errorsCheck.category = "Categoría es requerida";
            if (ingredientsInOrder.length === 0) errorsCheck.ingredientsInOrder = "Se necesitan ingredientes";
        }

        if (!isComposite) {
            if (!name) errorsCheck.name = "Nombre es requerido";
            if (!price) errorsCheck.price = "Precio de venta es requerido";
            if (!category) errorsCheck.category = "Categoría es requerida";
            if(!minQty) errorsCheck.minQty = "Cantidad mínima es requerida para productos simples";
        }

        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
            const updatedProduct = {
                id: productId,
                name: name,
                price: Number(price),
                categoryId: category,
                isComposite: isComposite,
                ingredients: isComposite ? ingredientsInOrder : [],
                minQty: minQty,
                operation: operation,
                concept: concept,
                totalPrice: totalPrice,
                quantity,
                
            };
            dispatch(updateProduct(updatedProduct));
        }
    };

    const handleOperationChange = (operation) => {
        console.log('Operation selected:', operation); // Registro de la operación seleccionada
        setOperation(operation);
        setShowPrice(operation !== 'entrada');

    };

    const handleSimpleChange = (e) => {
        setIsSimple(e.target.checked);
        if (e.target.checked) {
            setIsComposite(false);
            setIngredientsInOrder([]); // Clear ingredients if switching to simple
        }
    };

    const handleCompositeChange = (e) => {
        setIsComposite(e.target.checked);
        if (e.target.checked) setIsSimple(false);
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

    const renderIngredientsCart = () => (
        <>
            {errors.ingredientsInOrder && <Message message={errors.ingredientsInOrder} color={"warning"} />}
            <IngredientsCart ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
        </>
    );

    const renderIngredientsTable = () => (
        <IngredientsTable ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
    );

    const renderForm = () => (
        <form onSubmit={handleSubmit}>
            <div className="row justify-content-center">
                <div className="col-md-3" style={{ marginTop: '10px' }}>
                    <Input name={"nombre"} type={"text"} data={name} setData={setName} errors={errors} />
                    {errors.name && <Message message={errors.name} color={"warning"} />}
                </div>
                <div className="col-md-3 offset-md-1" style={{ marginTop: '10px' }}>
                    <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
                    {errors.price && <Message message={errors.price} color={"warning"} />}
                </div>
                <div className="col-md-4 offset-md-1" style={{ marginTop: '10px' }}>
                    <label style={{ fontWeight: 'normal' }}>Categoría:</label>
                    {renderCategoriesSelect()}
                    {errors.category && <Message message={errors.category} color={"warning"} />}
                </div>
            </div>

            <div className="container">
                <div className="row justify-content-center">
                {isSimple && (
                    <div className="row justify-content-center" style={{ textAlign: 'center', marginTop: '10px' }}>
                                <div className="col-md-3" style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <Input name={"cantidad mínima"} type={"number"} data={minQty} setData={setMinQty} errors={errors} />
                                    {errors.minQty && <Message message={errors.minQty} color={"warning"} />}
                                </div>
                                <div className="col-md-3 offset-md-1">
                                    <label style={{fontWeight: 'normal'}}>Cantidad en el Inventario:</label>
                                    <input type="text" className="form-control" value={stock} readOnly />
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
                        name={"Cantidad en gr/und"}
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
                                
            {stock < 0 && 
                        
                        <div style={{ backgroundColor: "red", borderColor: "black", padding: "15px", borderRadius: "10px", maxWidth: "900px", margin: "0 auto"}}>
                                    Este ingrediente tiene existencia negativa, se recomienda realizar inventario y registrar la entrada de mercancía actual NOTA: El ajuste de cantidad ${stock} se realiza de forma automática.
                                </div>
                    }
                                
                    </div>
                            )}

                           
                    <div className="col-12 col-md-4 mb-3" style={{ textAlign: 'center', marginTop: '10px' }}>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="simpleProduct"
                                checked={isSimple}
                                onChange={handleSimpleChange}
                                disabled
                            />
                            <label className="form-check-label" htmlFor="simpleProduct">
                                Producto Simple
                            </label>
                        </div>
                    </div>
                    <div className="col-12 col-md-4 mb-3" style={{ textAlign: 'center', marginTop: '10px' }}>
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="compositeProduct"
                                checked={isComposite}
                                onChange={handleCompositeChange}
                                disabled
                            />
                            <label className="form-check-label" htmlFor="compositeProduct">
                                Producto Compuesto
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {isComposite && (
                <div className="container">
                    <hr />
                    <div className="row justify-content-center" style={{ marginTop: '50px' }}>
                        <div className="col-12 col-md-6" style={{ textAlign: 'center' }}>
                            {renderIngredientsTable()}
                        </div>
                        <div className="col-12 col-md-6" style={{ textAlign: 'center' }}>
                            {renderIngredientsCart()}
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ marginTop: isComposite ? '100px' : '20px' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-6" style={{ textAlign: 'center' }}>
                        <button type="submit" className="btn btn-primary">
                            Confirmar
                        </button>
                    </div>
                    <div className="col-12 col-md-6" style={{ textAlign: 'center' }}>
                        <ButtonGoBack history={history} />
                    </div>
                </div>
            </div>
        </form>
    );

    return (
        <>
            <HeaderContent name={"Productos"} />
            <section className="content">
                <div className="container-fluid">
                    <div className="row justify-content-center">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Producto</h3>
                                </div>
                                <div className="card-body">
                                    <LoaderHandler
                                        loading={loadingUpdate}
                                        error={errorUpdate}
                                    />
                                    <LoaderHandler
                                        loading={loading}
                                        error={error}
                                    />
                                    {renderForm()}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductEditScreen;
