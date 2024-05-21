import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

/* Components */
import HeaderContent from "../../components/HeaderContent";
import Modal from "react-modal";
import Input from "../../components/form/Input";
import ModalButton from "../../components/ModalButton";
import DataTableLoader from "../../components/loader/DataTableLoader";
import Select from "../../components/Select";

/* Actions */
import { listProducts, createProduct } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";

/* Styles */
import { modalStyles } from "../../utils/styles";
import Search from "../../components/Search";
import LoaderHandler from "../../components/loader/LoaderHandler";
import Pagination from "../../components/Pagination";
import Message from "../../components/Message";

import IngredientsCart from "../../components/order/IngredientsCart";
import IngredientsTable from "../../components/order/IngredientsTable";

import { listIngredients} from "../../actions/ingredientActions";
import "../../../src/utils/menu.css"



Modal.setAppElement("#root");

const ProductScreen = ({ history }) => {

    const [isSimple, setIsSimple] = useState(false);
    const [isComposite, setIsComposite] = useState(false);
    const [typeError, setTypeError] = useState(""); // Nuevo estado para el error de tipo de producto

    const [ingredientsInOrder, setIngredientsInOrder] = useState([]);


    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState(null);

    const [errors, setErrors] = useState({});

    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreate = useSelector((state) => state.productCreate);
    const {
        loading: createLoading,
        success: createSuccess,
        error: createError,
    } = productCreate;

    useEffect(() => {
        if (createSuccess) {
            setName("");
            setPrice(0);
            setStock(0);
            setCategory(null);

            setModalIsOpen(false);
        }
        dispatch(listProducts(keyword, pageNumber));
        dispatch(listIngredients());
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

    const handleSubmit = (e) => {
        e.preventDefault();

        let errorsCheck = {};

        if (!name) {
            errorsCheck.name = "Nombre es requerido";
        }
        if (!price) {
            errorsCheck.price = "Precio de venta es requerido";
        }

        if (!stock) {
            errorsCheck.stock = "Inventario es requerido";
        }
        if (!category) {
            errorsCheck.category = "Categoría es requerida";
        }

        if (!isSimple && !isComposite) {
            setTypeError("Debe seleccionar si el producto es simple o compuesto"); // Establece el error si no se selecciona ninguno
        } else {
            setTypeError(""); // Limpia el error si uno de los dos está seleccionado
        }

        if (Object.keys(errorsCheck).length > 0 || (!isSimple && !isComposite)) {
            setErrors(errorsCheck);
        } else {
            setErrors({});
        }

        if (Object.keys(errorsCheck).length === 0) {
            const product = {
                name: name,
                price: price,
                stock: stock,
                categoryId: category,
                isSimple: isSimple,
                isComposite: isComposite,
                
            };

            dispatch(createProduct(product));
        }

        
    };

    const handleSimpleChange = (e) => {
        setIsSimple(e.target.checked);
        if (e.target.checked) setIsComposite(false); // Deselect composite if simple is selected
    };
    
    const handleCompositeChange = (e) => {
        setIsComposite(e.target.checked);
        if (e.target.checked) setIsSimple(false); // Deselect simple if composite is selected
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

    const renderIngredientsTable = () => (
        <IngredientsTable
            ingredientsInOrder={ingredientsInOrder}
            setIngredientsInOrder={setIngredientsInOrder}
        />
    );

    const renderModalCreateProduct = () => (
        <>
        <div>
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
                <div>
                <LoaderHandler loading={createLoading} error={createError} />
                <h2>Formulario Creación</h2>
                <form onSubmit={handleSubmit} className="form-container">
                    <Input
                        name={"nombre"}
                        type={"text"}
                        data={name}
                        setData={setName}
                        errors={errors}
                    />
                    <Input
                        name={"precio de venta"}
                        type={"number"}
                        data={price}
                        setData={setPrice}
                        errors={errors}
                    />
                    <label>Categoría de producto</label>
                    {renderCategoriesSelect()}
                    {errors.category && (
                        <Message message={errors.category} color={"warning"} />
                    )}
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
                    {typeError && (
                    <Message message={typeError} color={"warning"} />
                     )}
                     <label>Ingredientes</label>
                     <div className="form-group">
                        {renderIngredientsTable()}
                    
                    {renderIngredientsCart()}
                    {errors.category && (
                        <Message message={errors.category} color={"warning"} />
                    )}
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


                </div>
                
            </Modal>
        </div>
            
        </>
    );

    const renderProductsTable = () => (
        <table className="table table-hover text-nowrap">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Precio de venta</th>
                    <th>Inventario</th>
                    <th className="d-none d-sm-table-cell">Creado en</th>
                    <th className="d-none d-sm-table-cell">Categoría</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>{product.stock}</td>
                        <td className="d-none d-sm-table-cell">
                            {product.createdAt.slice(0, 10)}
                        </td>
                        <td className="d-none d-sm-table-cell">
                            {product.category.name}
                        </td>
                        <td>
                            <Link
                                to={`/product/${product.id}/edit`}
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

    const renderIngredientsCart = () => (
        <>
            {errors.products && (
                <Message message={errors.products} color={"warning"} />
            )}
            <IngredientsCart
                ingredientsInOrder={ingredientsInOrder}
                setIngredientsInOrder={setIngredientsInOrder}
            />
        </>
    );

    return (
        <>
            <HeaderContent name={"Productos"} />
            {/* Main content */}

            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateProduct()}

                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-header">
                                    <h3 className="card-title">
                                        Tabla de Productos
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
                                        render={renderProductsTable}
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

export default ProductScreen;
