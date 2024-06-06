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
    //add ingredient to order
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState("");
    const [pageNumber, setPageNumber] = useState(0);
    const [ingredients, setIngredients] = useState([]);

    const addIngredient = (e, ingredient) => {
        e.preventDefault();

        //ingredient object
        const ingredientIn = {
            id: ingredient.id,
            name: ingredient.name,
            quantity: 1,
        };
        // Verifica si ingredientsInOrder es un array antes de intentar iterar sobre él
    if (!Array.isArray(ingredientsInOrder)) {
        // Si no es un array, inicialízalo como un array vacío
        setIngredientsInOrder([ingredientIn]);
    } else {
        //ingredientInOrder es un array, procede a agregar el nuevo ingrediente
        //if is already in order
        if (!inOrder(ingredientIn, ingredientsInOrder)) {
            setIngredientsInOrder([...ingredientsInOrder, ingredientIn]);
        } else {
            alert("Ingrediente ya está en la órden");
        }
    }
    };

    //ingredient list state
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
    }, [keyword, pageNumber]);

    useEffect(() => {
        if (ingredientsFromState) {
            setIngredients(mapIngredients(ingredientsFromState));
        }
    }, [ingredientsFromState]);

    //check if ingredient is already in order
    const inOrder = (obj, list) => {
        if (!list) return false; // Verifica si la lista está definida
        for (let index = 0; index < list.length; index++) {
            if (obj.id === list[index].id) {
                return list[index];
            }
        }
        return false;
    };

    //refresh ingredients table
    const refreshIngredients = (e) => {
        e.preventDefault();
        dispatch(listIngredients(keyword, pageNumber));
    };

    //check stock to show
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

    const renderIngredients = () => (
        <table id="ingredientsTable" className="table table-hover text-nowrap full-width-table align-items-center">
            <thead
                style={{
                    color: "#fff",
                }}
                className="bg-info"
            >
                <tr>
                    <th style={{ textAlign: "center" }}>Nombre</th>
                    <th style={{ textAlign: "center" }}>Agregar</th>
                </tr>
            </thead>
            <tbody style={{ textAlign: "center" }}>
                {ingredients.map((ingredient) => (
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

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '-100px' }}>
                <Pagination pages={pages} page={page} setPage={setPageNumber} />
            </div>

        </>
    );
};

export default IngredientsTable;
