import axios from "axios";
import {
    LAUNDRY_LIST_REQUEST,
    LAUNDRY_LIST_SUCCESS,
    LAUNDRY_LIST_FAIL,
    LAUNDRY_CREATE_REQUEST,
    LAUNDRY_CREATE_SUCCESS,
    LAUNDRY_CREATE_FAIL,
    LAUNDRY_DETAILS_REQUEST,
    LAUNDRY_DETAILS_SUCCESS,
    LAUNDRY_DETAILS_FAIL,
    LAUNDRY_UPDATE_REQUEST,
    LAUNDRY_UPDATE_SUCCESS,
    LAUNDRY_UPDATE_FAIL,
    LAUNDRY_DELETE_REQUEST,
    LAUNDRY_DELETE_SUCCESS,
    LAUNDRY_DELETE_FAIL,
} from "../constants/laundryConstants";

//get all categories with pagination
export const listLaundries =
    (keyword = "", pageNumber = "") =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: LAUNDRY_LIST_REQUEST,
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

            //get all categories
            const { data } = await axios.get(
                `/api/laundries?keyword=${keyword}&pageNumber=${pageNumber}`,
                config
            );

            dispatch({
                type: LAUNDRY_LIST_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: LAUNDRY_LIST_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

//create a category
export const createLaundry = (laundry) => async (dispatch, getState) => {
    const { quantity, price, clientId } = laundry;

    try {
        dispatch({
            type: LAUNDRY_CREATE_REQUEST,
        });

        //get category from state
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

        //create category
        const { data } = await axios.post("/api/laundries", { quantity, price, clientId }, config);
        dispatch({
            type: LAUNDRY_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: LAUNDRY_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get category details
export const listLaundriesDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: LAUNDRY_DETAILS_REQUEST });

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

        //api call to get category
        const { data } = await axios.get(`/api/laundries/${id}`, config);
        dispatch({
            type: LAUNDRY_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: LAUNDRY_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateLaundry = (laundry) => async (dispatch, getState) => {
    try {
        dispatch({
            type: LAUNDRY_UPDATE_REQUEST,
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

        //update category
        const { data } = await axios.put(
            `/api/laundries/${laundry.id}`,
            laundry,
            config
        );
        dispatch({
            type: LAUNDRY_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: LAUNDRY_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete category
export const deleteLaundry = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: LAUNDRY_DELETE_REQUEST,
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

        await axios.delete(`/api/laundries/${id}`, config);
        dispatch({
            type: LAUNDRY_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: LAUNDRY_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
