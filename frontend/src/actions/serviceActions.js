import axios from 'axios';
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


export const listServices = (keyword = "", pageNumber = "") => async (dispatch, getState) => {
    try {
        dispatch({ type: SERVICE_LIST_REQUEST });

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

        const { data } = await axios.get(
            `/api/services?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );
        dispatch({ type: SERVICE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: SERVICE_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const getServices = () => async (dispatch,getState) => {
    try {
        dispatch({ type: SERVICE_LIST_REQUEST });

         //get category from state
         const {
            userLogin: { userInfo },
        } = getState();

        //headers
        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get('/api/services', config);

        dispatch({
            type: SERVICE_LIST_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: SERVICE_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const createServicio = (nombre) => async (dispatch) => {
    try {
        dispatch({ type: CREATE_SERVICE_REQUEST });

        const { data } = await axios.post('/api/services', { nombre });

        dispatch({
            type: CREATE_SERVICE_SUCCESS,
            payload: data
        });
    } catch (error) {
        dispatch({
            type: CREATE_SERVICE_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
