import {
    LAUNDRY_LIST_REQUEST,
    LAUNDRY_LIST_SUCCESS,
    LAUNDRY_LIST_FAIL,
    LAUNDRY_LIST_RESET,
    LAUNDRY_CREATE_REQUEST,
    LAUNDRY_CREATE_SUCCESS,
    LAUNDRY_CREATE_FAIL,
    LAUNDRY_DETAILS_REQUEST,
    LAUNDRY_DETAILS_SUCCESS,
    LAUNDRY_DETAILS_FAIL,
    LAUNDRY_DETAILS_RESET,
    LAUNDRY_UPDATE_REQUEST,
    LAUNDRY_UPDATE_SUCCESS,
    LAUNDRY_UPDATE_FAIL,
    LAUNDRY_UPDATE_RESET,
    LAUNDRY_DELETE_REQUEST,
    LAUNDRY_DELETE_SUCCESS,
    LAUNDRY_DELETE_FAIL,
    LAUNDRY_DELETE_RESET,
} from "../constants/laundryConstants";

export const laundryListReducer = (
    state = { loading: true, laundries: [] },
    action
) => {
    switch (action.type) {
        case LAUNDRY_LIST_REQUEST:
            return { loading: true, laundries: [] };
        case LAUNDRY_LIST_SUCCESS:
            return {
                loading: false,
                laundries: action.payload.laundries,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case LAUNDRY_LIST_FAIL:
            return { loading: false, error: action.payload };
        case LAUNDRY_LIST_RESET:
            return { laundries: [] };
        default:
            return state;
    }
};

export const laundryCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case LAUNDRY_CREATE_REQUEST:
            return { loading: true };
        case LAUNDRY_CREATE_SUCCESS:
            return { loading: false, success: true };
        case LAUNDRY_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const laundryDetailsReducer = (state = { laundry: {} }, action) => {
    switch (action.type) {
        case LAUNDRY_DETAILS_REQUEST:
            return { ...state, loading: true };
        case LAUNDRY_DETAILS_SUCCESS:
            return { loading: false, laundry: action.payload };
        case LAUNDRY_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case LAUNDRY_DETAILS_RESET:
            return { laundry: {} };
        default:
            return state;
    }
};

export const laundryUpdateReducer = (state = { laundry: {} }, action) => {
    switch (action.type) {
        case LAUNDRY_UPDATE_REQUEST:
            return { loading: true };
        case LAUNDRY_UPDATE_SUCCESS:
            return { loading: false, success: true, laundry: action.payload };
        case LAUNDRY_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case LAUNDRY_UPDATE_RESET:
            return { laundry: {} };
        default:
            return state;
    }
};

export const laundryDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case LAUNDRY_DELETE_REQUEST:
            return { loading: true };
        case LAUNDRY_DELETE_SUCCESS:
            return { loading: false, success: true };
        case LAUNDRY_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case LAUNDRY_DELETE_RESET:
            return {};
        default:
            return state;
    }
};
