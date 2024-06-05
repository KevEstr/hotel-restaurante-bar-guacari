import {
    GET_SERVICES_REQUEST,
    GET_SERVICES_SUCCESS,
    GET_SERVICES_FAIL,
    CREATE_SERVICE_REQUEST,
    CREATE_SERVICE_SUCCESS,
    CREATE_SERVICE_FAIL,
    SERVICE_LIST_REQUEST,
    SERVICE_LIST_SUCCESS,
    SERVICE_LIST_FAIL,
} from '../constants/serviceConstants';


export const serviceListReducer = (state = { loading: true, services: [] },
    action
) => {
    switch (action.type) {
        case SERVICE_LIST_REQUEST:
            return { loading: true, services: [] };
        case SERVICE_LIST_SUCCESS:
            return {
                loading: false,
                services: action.payload,
            };
        case SERVICE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const serviceCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case CREATE_SERVICE_REQUEST:
            return { loading: true };
        case CREATE_SERVICE_SUCCESS:
            return { loading: false, success: true, service: action.payload };
        case CREATE_SERVICE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
