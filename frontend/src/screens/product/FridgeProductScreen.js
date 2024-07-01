import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "react-modal";
import HeaderContent from "../../components/HeaderContent";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Select from "../../components/Select";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";
import IngredientsCart from "../../components/order/IngredientsCart";
import IngredientsTable from "../../components/order/IngredientsTable";
import { listProducts, createProduct, deleteProduct } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";
import { listIngredients } from "../../actions/ingredientActions";
import { modalStyles } from "../../utils/styles";
import useWindowSize from '../../utils/sizeWindow';



Modal.setAppElement("#root");

const FridgeProductScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [minQty, setMinQty] = useState(0);




    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState(null);
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ingredientsInOrder, setIngredientsInOrder] = useState([]);
    const [isSimple, setIsSimple] = useState(false);
    const [isComposite, setIsComposite] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const { width } = useWindowSize(); // Obtén el ancho de la ventana
    const [productIdToDelete, setProductIdToDelete] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreate = useSelector((state) => state.productCreate);
    const { loading: createLoading, success: createSuccess, error: createError } = productCreate;

    const productDelete = useSelector((state) => state.productDelete || {});
    const { success: deleteSuccess } = productDelete;

    useEffect(() => {
        if (createSuccess) {
            resetForm();
            setModalIsOpen(false);
        }
        let type= true;
        dispatch(listProducts(null, null, type, null));
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess, deleteSuccess]);

    
    const resetForm = () => {
        setName("");
        setPrice(0);
        setStock(0);
        setCategory(null);
        setErrors({});
        setIngredientsInOrder(null);
        setIsSimple(false);
        setIsComposite(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!price) {
            errorsCheck.price = "Precio de venta es requerido";
        }
        if (!category) {
            errorsCheck.category = "Categoría es requerida";
        }
        console.log("ingredientsInOrder: ",ingredientsInOrder)
        if (isComposite && ingredientsInOrder.length === 0) {
            errorsCheck.ingredientsInOrder = "Se necesitan ingredientes";
        }
        if (isSimple && !minQty) {
            errorsCheck.minQty = "Cantidad mínima es requerida para productos simples";
        }


        if (Object.keys(errorsCheck).length > 0) {
            setErrors(errorsCheck);
            return;
        }
        else{
            setErrors({})
        }



        const product = {
            name: name,
            price: price,
            categoryId: category,
            isComposite: isComposite,  // Include this to indicate product type
            ingredients: isComposite ? ingredientsInOrder : [], // Solo incluir ingredientes si es compuesto
            minQty: isSimple? minQty : null, // Solo incluir cantidad mínima si es simple
            type: true,
        };

        dispatch(createProduct(product));
    };

    

    const searchCategories = (e) => {
        dispatch(listCategories(e.target.value));
    };

    const renderCategoriesSelect = () => (
        <Select data={category} setData={setCategory} items={categories} search={searchCategories} />
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
                    onClick={() => handleDelete(productIdToDelete)}
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
        dispatch(deleteProduct(id));
        setConfirmDelete(false);
    };

    const handleDeleteClick = (id) => {
        setProductIdToDelete(id);
        setConfirmDelete(true);
    };

    const renderModalCreateProduct = () => (
        <>
            <ModalButton modal={modalIsOpen} setModal={setModalIsOpen} classes={"btn-success btn-lg mb-2"} />
            <Modal
                style={{
                    content: {
                        top: "50%",
                        left: width < 768 ? "50%" : "57%",
                        right: "auto",
                        bottom: "auto",
                        marginRight: "-50%",
                        transform: "translate(-50%, -50%)",
                        width: "auto",
                        maxHeight: "90vh",
                        minHeight: "50vh",
                        // Usamos min-width y max-width para definir el tamaño base del modal
                        minWidth: "60%",
                        maxWidth: "80%"
                    },
                    "@media (min-width: 768px)": {
                        // Media query para dispositivos medianos y grandes
                        content: {
                            minWidth: "60vh",
                            maxWidth: "100vh"
                        }
                    },
                    "@media (min-width: 1024px)": {
                        // Media query para dispositivos grandes
                        content: {
                            minWidth: "80vh",
                            maxWidth: "150vh"
                        }
                    }
                }}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <LoaderHandler loading={createLoading} error={createError} />
                <h2 style={{fontSize: "24px", fontWeight: 'normal'}}>Creación de Productos</h2>
                <hr />

                <form onSubmit={handleSubmit}>

                <div className="row justify-content-center">
                <div className="col-md-3" style={{marginTop: '10px'}}>
                    <Input name={"nombre"} type={"text"} data={name} setData={setName} errors={errors} />
                    {errors.name && <Message message={errors.name} color={"warning"} />}
                </div>
                <div className="col-md-3 offset-md-1" style={{marginTop: '10px'}}>
                    <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
                    {errors.price && <Message message={errors.price} color={"warning"} />}
                </div>
                <div className="col-md-4 offset-md-1" style={{marginTop: '10px'}}>
                    <label style={{ fontWeight: 'normal' }}>Categoría:</label>
                    {renderCategoriesSelect()}
                    {errors.category && <Message message={errors.category} color={"warning"} />}
                </div>
            </div>

                <div className="container">
                    <div className="row justify-content-center">
                    {isSimple && (
                                <div className="col-12 col-md-4 mb-3" style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <Input name={"cantidad mínima"} type={"number"} data={minQty} setData={setMinQty} errors={errors} />
                                    {errors.minQty && <Message message={errors.minQty} color={"warning"} />}
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
                            <ModalButton modal={modalIsOpen} setModal={setModalIsOpen} classes={"btn-danger"} />
                        </div>
                    </div>
                </div>
            </form>
        </Modal>
    </>
);

const renderNegativeStockProducts = () => {
    const negativeStockProducts = products.filter(product => product.stock < 0);
    if (negativeStockProducts.length === 0) return null;

    return (
        <div className="alert alert-danger mt-3">
            <strong>EXISTENCIA NEGATIVA:</strong> Se recomienda realizar inventario de los siguientes products y realizar la entrada respectiva:
            <ul>
                {negativeStockProducts.map(product => (
                    <li key={product.id}>{product.name}</li>
                ))}
            </ul>
        </div>
    );
};

const renderProductsTable = () => (
    <table className="table table-hover text-nowrap">
        <thead>
            <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio de venta</th>
                <th className="d-none d-sm-table-cell">Inventario</th>
                <th className="d-none d-sm-table-cell">Cantidad mínima</th>
                <th className="d-none d-sm-table-cell">Categoría</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {products.map((product) => (
                <tr 
                    key={product.id}
                    style={{ backgroundColor: !product.isComposite &&product.stock <= product.minQty ? '#f8d7da' : 'inherit' }}
                >{console.log(product)}
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.price}</td>
                    <td className="d-none d-sm-table-cell">{!product.isComposite ? product.stock : ''}</td>
                    <td className="d-none d-sm-table-cell">{!product.isComposite ? product.minQty : ''}</td>
                    <td className="d-none d-sm-table-cell">{product.category.name}</td>
                    <td>
                        
                        <Link to={`/product/${product.id}/edit`} className="btn btn-warning btn-lg mr-3">
                            Editar
                        </Link>
                        <button
                            onClick={() => handleDeleteClick(product.id)}
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
            <style>
                {`
                .flex-container {
                    display: flex;
                    gap: 20px;
                }
                `}
            </style>
            <HeaderContent name={"Productos"} />
            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateProduct()}
                    {renderDeleteConfirmationModal()}
                    {renderNegativeStockProducts()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">Tabla de Productos</h3>
                                    <div className="card-tools">
                                        <Search keyword={keyword} setKeyword={setKeyword} setPage={setPageNumber} />
                                    </div>
                                </div>
                                <div className="card-body table-responsive p-0">
                                    <LoaderHandler loading={loading} error={error} loader={<DataTableLoader />} render={renderProductsTable} />
                                </div>
                            </div>
                            <Pagination page={page} pages={pages} setPage={setPageNumber} />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default FridgeProductScreen;
