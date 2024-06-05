import axios from "axios";
import {
    AGREEMENT_LIST_REQUEST,
    AGREEMENT_LIST_SUCCESS,
    AGREEMENT_LIST_FAIL,
    AGREEMENT_CREATE_REQUEST,
    AGREEMENT_CREATE_SUCCESS,
    AGREEMENT_CREATE_FAIL,
    AGREEMENT_DETAILS_REQUEST,
    AGREEMENT_DETAILS_SUCCESS,
    AGREEMENT_DETAILS_FAIL,
    AGREEMENT_UPDATE_REQUEST,
    AGREEMENT_UPDATE_SUCCESS,
    AGREEMENT_UPDATE_FAIL,
    AGREEMENT_DELETE_REQUEST,
    AGREEMENT_DELETE_SUCCESS,
    AGREEMENT_DELETE_FAIL,
} from "../constants/agreementConstants";

//get all categories with pagination
export const listAgreements =
    (keyword = "", pageNumber = "") =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: AGREEMENT_LIST_REQUEST,
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
                `/api/agreements?keyword=${keyword}&pageNumber=${pageNumber}`,
                config
            );

            dispatch({
                type: AGREEMENT_LIST_SUCCESS,
                payload: data,
            });
        } catch (error) {
            dispatch({
                type: AGREEMENT_LIST_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

//create a category
export const createAgreement = (agreement) => async (dispatch, getState) => {
    const { name, serviceIds } = agreement;

    try {
        dispatch({
            type: AGREEMENT_CREATE_REQUEST,
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
        const { data } = await axios.post("/api/agreements", { name, serviceIds }, config);
        dispatch({
            type: AGREEMENT_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AGREEMENT_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get category details
export const listAgreementDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: AGREEMENT_DETAILS_REQUEST });

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
        const { data } = await axios.get(`/api/agreements/${id}`, config);
        dispatch({
            type: AGREEMENT_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AGREEMENT_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a category
export const updateAgreement = (agreement) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AGREEMENT_UPDATE_REQUEST,
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
            `/api/agreements/${agreement.id}`,
            agreement,
            config
        );
        dispatch({
            type: AGREEMENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: AGREEMENT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete category
export const deleteAgreement = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: AGREEMENT_DELETE_REQUEST,
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

        //api call to delete category
        await axios.delete(`/api/agreements/${id}`, config);
        dispatch({
            type: AGREEMENT_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: AGREEMENT_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
