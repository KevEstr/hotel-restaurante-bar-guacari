import axios from "axios";
import {
    SERVICE_LIST_REQUEST,
    SERVICE_LIST_SUCCESS,
    SERVICE_LIST_FAIL,
    SERVICE_CREATE_REQUEST,
    SERVICE_CREATE_SUCCESS,
    SERVICE_CREATE_FAIL,
    SERVICE_DETAILS_REQUEST,
    SERVICE_DETAILS_SUCCESS,
    SERVICE_DETAILS_FAIL,
    SERVICE_UPDATE_REQUEST,
    SERVICE_UPDATE_SUCCESS,
    SERVICE_UPDATE_FAIL,
    SERVICE_DELETE_REQUEST,
    SERVICE_DELETE_SUCCESS,
    SERVICE_DELETE_FAIL,
    SERVICE_ALL_REQUEST,
    SERVICE_ALL_SUCCESS,
    SERVICE_ALL_FAIL,
} from "../constants/serviceConstants";

//get all tables
export const allServices = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: SERVICE_ALL_REQUEST,
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

        //if tables available is needed
        const { data } = await axios.get(`/api/services/all`, config);

        dispatch({
            type: SERVICE_ALL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_ALL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get all tables with pagination
export const listServices = (keyword = "", pageNumber = "") => async (
    dispatch,
    getState
) => {
    try {
        dispatch({
            type: SERVICE_LIST_REQUEST,
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

        //get all tables
        const { data } = await axios.get(
            `/api/services?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );

        dispatch({
            type: SERVICE_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//create a table
export const createService = (service) => async (dispatch, getState) => {
    const { name } = service;

    try {
        dispatch({
            type: SERVICE_CREATE_REQUEST,
        });

        //get table from state
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

        //create table
        const { data } = await axios.post("/api/services", { name }, config);
        dispatch({
            type: SERVICE_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get table details
export const listServiceDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: SERVICE_DETAILS_REQUEST });

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

        //api call to get table
        const { data } = await axios.get(`/api/services/${id}`, config);
        dispatch({
            type: SERVICE_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a table
export const updateService = (service) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SERVICE_UPDATE_REQUEST,
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

        //update table
        const { data } = await axios.put(
            `/api/services/${service.id}`,
            service,
            config
        );
        dispatch({
            type: SERVICE_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete table
export const deleteService = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: SERVICE_DELETE_REQUEST,
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

        //api call to delete table
        await axios.delete(`/api/services/${id}`, config);
        dispatch({
            type: SERVICE_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: SERVICE_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
