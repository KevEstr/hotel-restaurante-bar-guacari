import {
    AGREEMENT_LIST_REQUEST,
    AGREEMENT_LIST_SUCCESS,
    AGREEMENT_LIST_FAIL,
    AGREEMENT_LIST_RESET,
    AGREEMENT_CREATE_REQUEST,
    AGREEMENT_CREATE_SUCCESS,
    AGREEMENT_CREATE_FAIL,
    AGREEMENT_DETAILS_REQUEST,
    AGREEMENT_DETAILS_SUCCESS,
    AGREEMENT_DETAILS_FAIL,
    AGREEMENT_DETAILS_RESET,
    AGREEMENT_UPDATE_REQUEST,
    AGREEMENT_UPDATE_SUCCESS,
    AGREEMENT_UPDATE_FAIL,
    AGREEMENT_UPDATE_RESET,
    AGREEMENT_DELETE_REQUEST,
    AGREEMENT_DELETE_SUCCESS,
    AGREEMENT_DELETE_FAIL,
    AGREEMENT_DELETE_RESET,
} from "../constants/agreementConstants";

export const agreementListReducer = (
    state = { loading: true, agreements: [] },
    action
) => {
    switch (action.type) {
        case AGREEMENT_LIST_REQUEST:
            return { loading: true, agreements: [] };
        case AGREEMENT_LIST_SUCCESS:
            return {
                loading: false,
                agreements: action.payload.agreements,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case AGREEMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        case AGREEMENT_LIST_RESET:
            return { agreements: [] };
        default:
            return state;
    }
};

export const agreementCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case AGREEMENT_CREATE_REQUEST:
            return { loading: true };
        case AGREEMENT_CREATE_SUCCESS:
            return { loading: false, success: true };
        case AGREEMENT_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const agreementDetailsReducer = (state = { agreement: {} }, action) => {
    switch (action.type) {
        case AGREEMENT_DETAILS_REQUEST:
            return { ...state, loading: true };
        case AGREEMENT_DETAILS_SUCCESS:
            return { loading: false, agreement: action.payload };
        case AGREEMENT_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case AGREEMENT_DETAILS_RESET:
            return { agreement: {} };
        default:
            return state;
    }
};

export const agreementUpdateReducer = (state = { agreement: {} }, action) => {
    switch (action.type) {
        case AGREEMENT_UPDATE_REQUEST:
            return { loading: true };
        case AGREEMENT_UPDATE_SUCCESS:
            return { loading: false, success: true, agreement: action.payload };
        case AGREEMENT_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case AGREEMENT_UPDATE_RESET:
            return { agreement: {} };
        default:
            return state;
    }
};

export const agreementDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case AGREEMENT_DELETE_REQUEST:
            return { loading: true };
        case AGREEMENT_DELETE_SUCCESS:
            return { loading: false, success: true };
        case AGREEMENT_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case AGREEMENT_DELETE_RESET:
            return {};
        default:
            return state;
    }
};
