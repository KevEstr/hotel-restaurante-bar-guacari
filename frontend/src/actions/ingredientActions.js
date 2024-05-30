import axios from "axios";
import {
    INGREDIENT_LIST_REQUEST,
    INGREDIENT_LIST_SUCCESS,
    INGREDIENT_LIST_FAIL,
    INGREDIENT_CREATE_REQUEST,
    INGREDIENT_CREATE_SUCCESS,
    INGREDIENT_CREATE_FAIL,
    INGREDIENT_DETAILS_REQUEST,
    INGREDIENT_DETAILS_SUCCESS,
    INGREDIENT_DETAILS_FAIL,
    INGREDIENT_UPDATE_REQUEST,
    INGREDIENT_UPDATE_SUCCESS,
    INGREDIENT_UPDATE_FAIL,
    INGREDIENT_DELETE_REQUEST,
    INGREDIENT_DELETE_SUCCESS,
    INGREDIENT_DELETE_FAIL,
} from "../constants/ingredientConstants";

//get all ingredients
export const listIngredients = (keyword = "", pageNumber = "") => async (
    dispatch,
    getState
) => {
    try {
        dispatch({
            type: INGREDIENT_LIST_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //get all ingredients
        const { data } = await axios.get(
            `/api/ingredients?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );

        dispatch({
            type: INGREDIENT_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INGREDIENT_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//create a Ingredient
export const createIngredient = (ingredient) => async (dispatch, getState) => {
    try {
        dispatch({
            type: INGREDIENT_CREATE_REQUEST,
        });

        //get ingredient from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //create ingredient
        const { data } = await axios.post("/api/ingredients", ingredient, config);
        dispatch({
            type: INGREDIENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INGREDIENT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get ingredient details
export const listIngredientDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_DETAILS_REQUEST });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //api call to get Ingredient
        const { data } = await axios.get(`/api/ingredients/${id}`, config);
        dispatch({
            type: INGREDIENT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INGREDIENT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a ingredient
export const updateIngredient = (ingredient) => async (dispatch, getState) => {
    try {
        dispatch({
            type: INGREDIENT_UPDATE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //update ingredient
        const { data } = await axios.put(
            `/api/ingredients/${ingredient.id}`,
            ingredient,
            config
        );
        dispatch({
            type: INGREDIENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INGREDIENT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete ingredient
export const deleteIngredient = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: INGREDIENT_DELETE_REQUEST,
        });

        //get user from state
        const {
            userLogin: { userInfo },
        } = getState();
        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        //api call to delete Ingredient
        await axios.delete(`/api/ingredients/${id}`, config);
        dispatch({
            type: INGREDIENT_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: INGREDIENT_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
