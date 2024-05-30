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
import ModalButton from "../../components/ModalButton";
import Modal from "react-modal";


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

const ProductEditScreen = ({match }) => {
    const {id} = useParams();
    const productId = parseInt(id);
    const history = useHistory();  // Usando useHistory para la navegación
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState("");
    const [isSimple, setIsSimple] = useState(false);
    const [isComposite, setIsComposite] = useState(false);
    const [ingredientsInOrder, setIngredientsInOrder] = useState("");
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [errors, setErrors] = useState({});
    
    const [productType, setProductType] = useState(null);
    const [concept, setConcept] = useState("");
    const [operation, setOperation] = useState(""); // Por defecto entrada
    const [totalPrice, setTotalPrice] = useState(null); // Por defecto entrada
    const [quantity, setQuantity] = useState(null);
    const [showPrice, setShowPrice] = useState(true);

    const dispatch = useDispatch();

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    //product details state
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;

    //product update state
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
            history.push("/product");
        } else {
            if (!product.name || product.id !== productId) {
                dispatch(listProductDetails(productId));
            } else {
                console.log(product)
                setName(product.name);
                setPrice(product.price);
                setStock(product.stock);
                setCategory(product.categoryId);
                setIsComposite(product.isComposite);
                setIsSimple(!product.isComposite);
                if (product.ingredients) {
                    const ingredients = product.ingredients.map((ingredient) => {
                        return {
                            ...ingredient,
                            quantity: ingredient.ProductIngredient.quantity,
                        };
                    });
                    setIngredientsInOrder(ingredients);
                }
                setProductType(product.isComposite ? 'Compuesto' : 'Simple');
                setStock(product.stock);
            }
        }
    }, [dispatch, history, productId, product, successUpdate]);


    const handleSubmit = (e) => {
        e.preventDefault();
        let errorsCheck = {};
    
        if(isComposite){
            if (!name) {
                errorsCheck.name = "Nombre es requerido";
            }
            if (!price) {
                errorsCheck.price = "Precio de venta es requerido";
            }
            if (!category) {
                errorsCheck.category = "Categoría es requerida";
            }
            if (ingredientsInOrder.length === 0) {
                errorsCheck.ingredientsInOrder = "Se necesitan ingredientes";
            }
        }
    
        if (!isComposite) {
            if (operation!=="") {
                if (!concept) {
                    errorsCheck.concept = "Concepto es requerido";
                }
                if (!totalPrice && operation === 'entrada') {
                    errorsCheck.totalPrice = "Precio de compra es requerido";
                }
                if (!quantity || quantity <= 0) {
                    errorsCheck.quantity = "Cantidad es requerida y debe ser mayor que cero";
                }
            }
        }
    
        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }
    
        if (Object.keys(errorsCheck).length === 0) {
            const updatedProduct = {
                id: productId,
                name: name,
                price: Number(price),
                categoryId: category,
                isComposite: isComposite,
                ingredients: isComposite ? ingredientsInOrder : [],
                quantity: isComposite ? null : Number(quantity),
                concept: isComposite ? null : concept,
                operation: isComposite ? null : operation,
                totalPrice: isComposite ? null : Number(totalPrice)
            };
            dispatch(updateProduct(updatedProduct));}             
           
    };

    const handleOperationChange = (operation) => {
        console.log('Operation selected:', operation); // Registro de la operación seleccionada
        setOperation(operation);
        setShowPrice(operation !== 'entrada');

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
                {/* Input para el nombre */}
                <Input name={"nombre"} type={"text"} data={name} setData={setName} errors={errors} />
                {errors.name && <Message message={errors.name} color={"warning"} />}

                {/* Input para el precio de venta */}
                <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
                {errors.price && <Message message={errors.price} color={"warning"} />}

                {/* Select para la categoría */}
                <label>Categoría:</label>
                {renderCategoriesSelect()}
                {errors.category && <Message message={errors.category} color={"warning"} />}
    
                {/* Checkbox para el tipo de producto */}
                <hr />
                <label>Tipo de producto</label>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="simpleProduct"
                        checked={isSimple}
                        onChange={handleSimpleChange}
                    />
                    <label className="form-check-label" htmlFor="simpleProduct">
                        Producto Simple
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="compositeProduct"
                        checked={isComposite}
                        onChange={handleCompositeChange}
                    />
                    <label className="form-check-label" htmlFor="compositeProduct">
                        Producto Compuesto
                    </label>
                </div>
    
                {/* Renderización de los ingredientes en caso de ser producto compuesto */}
                {isComposite && (
                    <>
                        <label>Ingredientes</label>
                        <div>
                            {renderIngredientsTable()}
                            {renderIngredientsCart()}
                        </div>
                    </>
                )}
    
                {/* Botón de confirmación */}
                <button type="submit" className="btn btn-primary">
                    Confirmar
                </button>
            </form>
    );

    const handleSimpleChange = (e) => {
        setIsSimple(e.target.checked);
        if (e.target.checked) {
            setIsComposite(false);
            setIngredientsInOrder([]);  // Clear ingredients if switching to simple
        }
    };

    const handleCompositeChange = (e) => {
        setIsComposite(e.target.checked);
        if (e.target.checked) setIsSimple(false);
    };

    const renderIngredientsCart = () => (
        <>
            {errors.ingredientsInOrder && <Message message={errors.ingredientsInOrder} color={"warning"} />}
            <IngredientsCart ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
        </>
    );

    const renderIngredientsTable = () => (
        <IngredientsTable ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
    );

    const openModal = () => {
        setModalIsOpen(true);
    };
    
    const closeModal = () => {
        setModalIsOpen(false);
    };

    const renderForm3 = () => (
        
        <form onSubmit={handleSubmit}>
            <Input
                name={"nombre"}
                type={"text"}
                data={name}
                setData={setName}
                errors={errors}
            />
            {errors.name && <Message message={errors.name} color={"warning"} />}

            <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
            {errors.price && <Message message={errors.price} color={"warning"} />}
    
                {/* Select para la categoría */}
                <label>Categoría:</label>
                {renderCategoriesSelect()}
                {errors.category && <Message message={errors.category} color={"warning"} />}
            <div className="form-group">
                <label>Tipo de Producto:</label>
                <input type="text" className="form-control" value={productType} readOnly />
            </div>
            <div className="form-group">
                <label>Cantidad en el Inventario:</label>
                <input type="text" className="form-control" value={stock} readOnly />
            </div>
            <label>Tipo de Movimiento:</label>
            <div>
                <input
                    type="radio"
                    name="operation"
                    value="entrada"
                    checked={operation === 'entrada'}
                    onChange={() => handleOperationChange('entrada')}
                /> Entrada
                <input
                    type="radio"
                    name="operation"
                    value="salida"
                    checked={operation === 'salida'}
                    onChange={() => handleOperationChange('salida')}
                /> Salida
            </div>
            <Input
                name={"Cantidad"}
                type={"number"}
                data={quantity}
                setData={setQuantity}
                errors={errors}
            />
            {errors.quantity && <Message message={errors.quantity} color={"warning"} />}
            <Input
                name={"Precio de compra"}
                type={"number"}
                data={totalPrice}
                setData={setTotalPrice}
                errors={errors}
                hidden={showPrice}
            />
            {errors.totalPrice && <Message message={errors.totalPrice} color={"warning"} />}
            <Input
                name={"Concepto"}
                type={"text"}
                data={concept}
                setData={setConcept}
                errors={errors}
            />
            {errors.concept && <Message message={errors.concept} color={"warning"} />}
            <hr />
            <button type="submit" className="btn btn-success">
                Confirmar
            </button>
        </form>
    );


    const renderForm1 = () => (
        <Modal
            // Estilos y propiedades del modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
        >
            {/* Contenido del modal */}
            <h2>Editar Producto</h2>
            <form onSubmit={handleSubmit}>
                {/* Input para el nombre */}
                <Input name={"nombre"} type={"text"} data={name} setData={setName} errors={errors} />
                {errors.name && <Message message={errors.name} color={"warning"} />}
    
                {/* Input para el precio de venta */}
                <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
                {errors.price && <Message message={errors.price} color={"warning"} />}
    
                {/* Select para la categoría */}
                <label>Categoría:</label>
                {renderCategoriesSelect()}
                {errors.category && <Message message={errors.category} color={"warning"} />}
    
                {/* Checkbox para el tipo de producto */}
                <hr />
                <label>Tipo de producto</label>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="simpleProduct"
                        checked={isSimple}
                        onChange={handleSimpleChange}
                        readOnly   
                    />
                    <label className="form-check-label" htmlFor="simpleProduct">
                        Producto Simple
                    </label>
                </div>
                <div className="form-check">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        id="compositeProduct"
                        checked={isComposite}
                        onChange={handleCompositeChange}
                        readOnly   
                    />
                    <label className="form-check-label" htmlFor="compositeProduct">
                        Producto Compuesto
                    </label>
                </div>
    
                {/* Renderización de los ingredientes en caso de ser producto compuesto */}
                {isComposite && (
                    <>
                        <label>Ingredientes</label>
                        <div>
                            {renderIngredientsTable()}
                            {renderIngredientsCart()}
                        </div>
                    </>
                )}
    
                {/* Botón de confirmación */}
                <button type="submit" className="btn btn-primary">
                    Confirmar
                </button>
            </form>
        </Modal>
    );
    

    return (
        <>
            {/* Content Header (Page header) */}
            <HeaderContent name={"Productos"} />

            {/* Main content */}
            <section className="content">
                <div className="container-fluid">
                    <ButtonGoBack history={history} />
                    <div className="row justify-content-center">
                        <div className="col-12 col-md-6">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Editar Producto</h3>
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
                                        render={isComposite ? renderForm : renderForm3}
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

export default ProductEditScreen;
