import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

/* components */
import LoaderHandler from "../loader/LoaderHandler";
import Pagination from "../Pagination";
import Search from "../Search";
import { BigSpin } from "../loader/SvgLoaders";

/* actions */
import { listIngredients } from "../../actions/ingredientActions";

const IngredientsTable = ({
    ingredientsInOrder,
    setIngredientsInOrder,
    ingredientsAlreadyOrdered,
}) => {
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(1);
    const [ingredients, setIngredients] = useState([]);
    const [pageSize] = useState(5);

    const addIngredient = (e, ingredient) => {
        e.preventDefault();
        const ingredientIn = {
            id: ingredient.id,
            name: ingredient.name,
            quantity: 1,
        };
        if (!Array.isArray(ingredientsInOrder)) {
            setIngredientsInOrder([ingredientIn]);
        } else {
            if (!inOrder(ingredientIn, ingredientsInOrder)) {
                setIngredientsInOrder([...ingredientsInOrder, ingredientIn]);
            } else {
                alert("Ingrediente ya está en la órden");
            }
        }
    };

    const ingredientList = useSelector((state) => state.ingredientList);
    const {
        loading: loadingIngredientList,
        error: errorIngredientList,
        ingredients: ingredientsFromState,
        page,
        pages,
    } = ingredientList;

    useEffect(() => {
        dispatch(listIngredients(keyword, pageNumber));
    }, [keyword, pageNumber, dispatch]);

    useEffect(() => {
        if (ingredientsFromState) {
            setIngredients(mapIngredients(ingredientsFromState));
        }
    }, [ingredientsFromState]);

    const inOrder = (obj, list) => {
        if (!list) return false;
        for (let index = 0; index < list.length; index++) {
            if (obj.id === list[index].id) {
                return list[index];
            }
        }
        return false;
    };

    

    const refreshIngredients = (e) => {
        e.preventDefault();
        dispatch(listIngredients(keyword, pageNumber));
    };

    const showStock = (ingredient) => {
        const ingredientInOrder = ingredientsInOrder.find(
            (ingredientIn) => ingredientIn.id === ingredient.id
        );
        if (ingredientInOrder) return ingredient.stock - ingredientInOrder.quantity;
        return ingredient.stock;
    };

    const mapIngredients = (ingredientsToMap) => {
        if (!ingredientsAlreadyOrdered) return ingredientsToMap;

        const mappedIngredients = ingredientsToMap.map((item) => {
            ingredientsAlreadyOrdered.map((item2) => {
                if (item.id === item2.id) {
                    item.stock = item.stock + item2.quantity;
                }
            });
            return item;
        });
        return mappedIngredients;
    };

    const renderRefreshButton = () => (
        <button className="btn btn-info float-right" onClick={refreshIngredients}>
            <i className="fas fa-sync-alt"></i>
        </button>
    );

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = pageNumber * pageSize;
    const ingredientsOnPage = ingredients.slice(startIndex, endIndex);

    const renderIngredients = () => {
        // Calcula el índice de inicio y fin de los ingredientes en la página actual
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = pageNumber * pageSize;
        const ingredientsOnPage = ingredients.slice(startIndex, endIndex);

        return (
            <table id="ingredientsTable" className="table table-hover text-nowrap full-width-table align-items-center">
                <thead style={{ color: "#fff" }} className="bg-info">
                    <tr>
                        <th style={{ textAlign: "center" }}>Nombre</th>
                        <th style={{ textAlign: "center" }}>Agregar</th>
                    </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                    {ingredientsOnPage.map((ingredient) => (
                        <tr key={ingredient.id}>
                            <td>{ingredient.name}</td>
                            {inOrder(ingredient, ingredientsInOrder) ? (
                                <td className="text-center">
                                    <button disabled className="btn btn-primary">
                                        Agregado
                                    </button>
                                </td>
                            ) : ingredient.stock > 0 ? (
                                <td className="text-center">
                                    <button
                                        className="btn btn-success"
                                        onClick={(e) => addIngredient(e, ingredient)}
                                    >
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </td>
                            ) : (
                                <td className="text-center">
                                    <button disabled className="btn btn-danger">
                                        Sin inventario
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <>
            {renderRefreshButton()}
            <Search
                keyword={keyword}
                setKeyword={setKeyword}
                setPage={setPageNumber}
            />
            <LoaderHandler
                loading={loadingIngredientList}
                error={errorIngredientList}
                render={renderIngredients}
                loader={<BigSpin />}
            />
            {/* Mover el componente de paginación aquí */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination pages={Math.ceil(ingredients.length / pageSize)} page={page} setPage={setPageNumber} />
            </div>
        </>
    );
};

export default IngredientsTable;
