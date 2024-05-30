// reducers/ingredientMovementReducers.js
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

export const ingredientMovementListReducer = (state = { movements: [] }, action) => {
    switch (action.type) {
        case INGREDIENT_MOVEMENT_LIST_REQUEST:
            return { loading: true, movements: [] };
        case INGREDIENT_MOVEMENT_LIST_SUCCESS:
            return { loading: false, movements: action.payload };
        case INGREDIENT_MOVEMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const ingredientMovementDetailsReducer = (state = { movement: {} }, action) => {
    switch (action.type) {
        case INGREDIENT_MOVEMENT_DETAILS_REQUEST:
            return { ...state, loading: true };
        case INGREDIENT_MOVEMENT_DETAILS_SUCCESS:
            return { loading: false, movement: action.payload };
        case INGREDIENT_MOVEMENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const ingredientMovementCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case INGREDIENT_MOVEMENT_CREATE_REQUEST:
            return { loading: true };
        case INGREDIENT_MOVEMENT_CREATE_SUCCESS:
            return { loading: false, success: true, movement: action.payload };
        case INGREDIENT_MOVEMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const ingredientMovementUpdateReducer = (state = { movement: {} }, action) => {
    switch (action.type) {
        case INGREDIENT_MOVEMENT_UPDATE_REQUEST:
            return { loading: true };
        case INGREDIENT_MOVEMENT_UPDATE_SUCCESS:
            return { loading: false, success: true, movement: action.payload };
        case INGREDIENT_MOVEMENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const ingredientMovementDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case INGREDIENT_MOVEMENT_DELETE_REQUEST:
            return { loading: true };
        case INGREDIENT_MOVEMENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case INGREDIENT_MOVEMENT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
