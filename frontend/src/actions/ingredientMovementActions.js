// actions/ingredientMovementActions.js
import axios from 'axios';
import {
    INGREDIENT_MOVEMENT_LIST_REQUEST,
    INGREDIENT_MOVEMENT_LIST_SUCCESS,
    INGREDIENT_MOVEMENT_LIST_FAIL,
    INGREDIENT_MOVEMENT_DETAILS_REQUEST,
    INGREDIENT_MOVEMENT_DETAILS_SUCCESS,
    INGREDIENT_MOVEMENT_DETAILS_FAIL,
    INGREDIENT_MOVEMENT_CREATE_REQUEST,
    INGREDIENT_MOVEMENT_CREATE_SUCCESS,
    INGREDIENT_MOVEMENT_CREATE_FAIL,
    INGREDIENT_MOVEMENT_UPDATE_REQUEST,
    INGREDIENT_MOVEMENT_UPDATE_SUCCESS,
    INGREDIENT_MOVEMENT_UPDATE_FAIL,
    INGREDIENT_MOVEMENT_DELETE_REQUEST,
    INGREDIENT_MOVEMENT_DELETE_SUCCESS,
    INGREDIENT_MOVEMENT_DELETE_FAIL,
} from '../constants/ingredientMovementConstants';

// List all ingredient movements with optional filters
export const listIngredientMovements = (filters = {}) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_MOVEMENT_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
            params: filters,
        };

        const { data } = await axios.get('/api/ingredientmovements', config);

        dispatch({ type: INGREDIENT_MOVEMENT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: INGREDIENT_MOVEMENT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Get details of a single ingredient movement
export const getIngredientMovementDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_MOVEMENT_DETAILS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/ingredientmovements/${id}`, config);

        dispatch({ type: INGREDIENT_MOVEMENT_DETAILS_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: INGREDIENT_MOVEMENT_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Create a new ingredient movement
export const createIngredientMovement = (movement) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_MOVEMENT_CREATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.post('/api/ingredientmovements', movement, config);

        dispatch({ type: INGREDIENT_MOVEMENT_CREATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: INGREDIENT_MOVEMENT_CREATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Update an ingredient movement
export const updateIngredientMovement = (movement) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_MOVEMENT_UPDATE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                'Content-Type': 'application/json',
            },
        };

        const { data } = await axios.put(`/api/ingredientmovements/${movement.id}`, movement, config);

        dispatch({ type: INGREDIENT_MOVEMENT_UPDATE_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: INGREDIENT_MOVEMENT_UPDATE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

// Delete an ingredient movement
export const deleteIngredientMovement = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: INGREDIENT_MOVEMENT_DELETE_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        await axios.delete(`/api/ingredientmovements/${id}`, config);

        dispatch({ type: INGREDIENT_MOVEMENT_DELETE_SUCCESS });
    } catch (error) {
        dispatch({
            type: INGREDIENT_MOVEMENT_DELETE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
