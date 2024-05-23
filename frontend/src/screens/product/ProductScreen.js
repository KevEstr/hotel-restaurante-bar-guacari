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
import { listProducts, createProduct } from "../../actions/productActions";
import { listCategories } from "../../actions/categoryActions";
import { listIngredients } from "../../actions/ingredientActions";
import { modalStyles } from "../../utils/styles";

Modal.setAppElement("#root");

const ProductScreen = ({ history }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState(null);
    const [errors, setErrors] = useState({});
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [ingredientsInOrder, setIngredientsInOrder] = useState([]);
    const [isSimple, setIsSimple] = useState(false);
    const [isComposite, setIsComposite] = useState(false);

    const dispatch = useDispatch();

    const categoryList = useSelector((state) => state.categoryList);
    const { categories } = categoryList;

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages } = productList;

    const userLogin = useSelector((state) => state.userLogin);
    const { userInfo } = userLogin;

    const productCreate = useSelector((state) => state.productCreate);
    const { loading: createLoading, success: createSuccess, error: createError } = productCreate;

    useEffect(() => {
        if (createSuccess) {
            resetForm();
            setModalIsOpen(false);
        }
        dispatch(listProducts(keyword, pageNumber));
    }, [dispatch, history, userInfo, pageNumber, keyword, createSuccess]);

    const resetForm = () => {
        setName("");
        setPrice(0);
        setStock(0);
        setCategory(null);
        setErrors({});
        setIngredientsInOrder([]);
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
        if (!stock) {
            errorsCheck.stock = "Inventario es requerido";
        }
        if (!category) {
            errorsCheck.category = "Categoría es requerida";
        }
        if (isComposite && !ingredientsInOrder) {
            errorsCheck.ingredients = "Se necesitan ingredientes";
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
            stock: stock,
            categoryId: category,
            isComposite: isComposite,  // Include this to indicate product type
            ingredients: ingredientsInOrder  // Include ingredient IDs for composite products
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
            {errors.products && <Message message={errors.products} color={"warning"} />}
            <IngredientsCart ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
        </>
    );

    const renderIngredientsTable = () => (
        <IngredientsTable ingredientsInOrder={ingredientsInOrder} setIngredientsInOrder={setIngredientsInOrder} />
    );

    const renderModalCreateProduct = () => (
        <>
            <ModalButton modal={modalIsOpen} setModal={setModalIsOpen} classes={"btn-success btn-lg mb-2"} />
            <Modal
                style={{
                    content: {
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        marginRight: '-50%',
                        transform: 'translate(-50%, -50%)',
                        width: 'auto',
                        maxHeight: '90vh',
                        maxWidth: '90vh',
                        minWidth: '90vh',
                    },
                }}
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            >
                <LoaderHandler loading={createLoading} error={createError} />
                <h2>Formulario Creación</h2>
                <form onSubmit={handleSubmit}>
                    <Input name={"nombre"} type={"text"} data={name} setData={setName} errors={errors} />
                    {errors.name && <Message message={errors.name} color={"warning"} />}
                    <Input name={"precio de venta"} type={"number"} data={price} setData={setPrice} errors={errors} />
                    {errors.price && <Message message={errors.price} color={"warning"} />}
                    <Input name={"inventario"} type={"number"} data={stock} setData={setStock} errors={errors} />
                    {errors.stock && <Message message={errors.stock} color={"warning"} />}
                    {renderCategoriesSelect()}
                    {errors.category && <Message message={errors.category} color={"warning"} />}
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

                    {isComposite && (
                        <>
                            <label>Ingredientes</label>
                            <div>
                                {renderIngredientsTable()}
                                {renderIngredientsCart()}
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary">
                        Confirmar
                    </button>
                    <ModalButton modal={modalIsOpen} setModal={setModalIsOpen} classes={"btn-danger float-right"} />
                </form>
            </Modal>
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
                        <td className="d-none d-sm-table-cell">{product.createdAt.slice(0, 10)}</td>
                        <td className="d-none d-sm-table-cell">{product.category.name}</td>
                        <td>
                            <Link to={`/product/${product.id}/edit`} className="btn btn-warning btn-lg">
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
            <HeaderContent name={"Productos"} />
            <section className="content">
                <div className="container-fluid">
                    {renderModalCreateProduct()}

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

export default ProductScreen;
