import axios from "axios";
import {
    RESERVATION_LIST_REQUEST,
    RESERVATION_LIST_SUCCESS,
    RESERVATION_LIST_FAIL,
    RESERVATION_CREATE_REQUEST,
    RESERVATION_CREATE_SUCCESS,
    RESERVATION_CREATE_FAIL,
    RESERVATION_DETAILS_REQUEST,
    RESERVATION_DETAILS_SUCCESS,
    RESERVATION_DETAILS_FAIL,
    RESERVATION_UPDATE_REQUEST,
    RESERVATION_UPDATE_SUCCESS,
    RESERVATION_UPDATE_FAIL,
    RESERVATION_DELETE_REQUEST,
    RESERVATION_DELETE_SUCCESS,
    RESERVATION_DELETE_FAIL,
} from "../constants/reservationConstants";

import { CLIENT_UPDATE_REQUEST, CLIENT_UPDATE_SUCCESS, CLIENT_UPDATE_FAIL } from "../constants/clientConstants";

//get all categories with pagination
export const listReservations =
    (keyword = "", pageNumber = "") =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: RESERVATION_LIST_REQUEST,
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
                `/api/reservations?keyword=${keyword}&pageNumber=${pageNumber}`,
                config
            );

            dispatch({
                type: RESERVATION_LIST_SUCCESS,
                payload: data,
            });
            
        } catch (error) {
            dispatch({
                type: RESERVATION_LIST_FAIL,
                payload:
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            });
        }
    };

//create a category
export const createReservation = (reservation) => async (dispatch, getState) => {
    const { price, start_date, end_date, note, quantity, clientId, roomId, paymentId, is_paid} = reservation;

    try {
        dispatch({
            type: RESERVATION_CREATE_REQUEST,
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
        const { data } = await axios.post("/api/reservations", { price, start_date, end_date, note, quantity, clientId, roomId, paymentId, is_paid }, config);
        dispatch({
            type: RESERVATION_CREATE_SUCCESS,
            payload: data,
        });

        dispatch(updateClientHasReservation(reservation.clientId, true));

    } catch (error) {
        dispatch({
            type: RESERVATION_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get category details
export const listReservationsDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: RESERVATION_DETAILS_REQUEST });

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
        const { data } = await axios.get(`/api/reservations/${id}`, config);
        dispatch({
            type: RESERVATION_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a category
export const updateReservation = (reservation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESERVATION_UPDATE_REQUEST,
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
            `/api/reservations/${reservation.id}`,
            reservation,
            config
        );
        dispatch({
            type: RESERVATION_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete category
export const deleteReservation = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESERVATION_DELETE_REQUEST,
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
        await axios.delete(`/api/reservations/${id}`, config);
        dispatch({
            type: RESERVATION_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }

};

export const updateReservationToPaid = (reservation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESERVATION_UPDATE_REQUEST,
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
        //update order
        const { data } = await axios.post(
            `/api/reservations/${reservation.id}/pay`,
            reservation,
            config
        );
        dispatch({
            type: RESERVATION_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a order
export const updateReservationToEnd = (reservation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: RESERVATION_UPDATE_REQUEST,
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
        //update order
        const { data } = await axios.post(
            `/api/reservations/${reservation.id}/pay`,
            {},
            config
        );
        dispatch({
            type: RESERVATION_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateClientHasReservation = (clientId, hasReservation) => async (dispatch, getState) => {
    try {
        dispatch({
            type: CLIENT_UPDATE_REQUEST,
        });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/clients/${clientId}`, { has_reservation: hasReservation }, config);

        dispatch({
            type: CLIENT_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: CLIENT_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

