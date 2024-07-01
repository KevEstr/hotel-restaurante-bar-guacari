import axios from 'axios'; // Importa axios

import {
    RESERVATION_LIST_REQUEST,
    RESERVATION_LIST_SUCCESS,
    RESERVATION_LIST_FAIL,
    RESERVATION_LIST_RESET,
    RESERVATION_CREATE_REQUEST,
    RESERVATION_CREATE_SUCCESS,
    RESERVATION_CREATE_FAIL,
    RESERVATION_DETAILS_REQUEST,
    RESERVATION_DETAILS_SUCCESS,
    RESERVATION_DETAILS_FAIL,
    RESERVATION_DETAILS_RESET,
    RESERVATION_UPDATE_REQUEST,
    RESERVATION_UPDATE_SUCCESS,
    RESERVATION_UPDATE_FAIL,
    RESERVATION_UPDATE_RESET,
    RESERVATION_DELETE_REQUEST,
    RESERVATION_DELETE_SUCCESS,
    RESERVATION_DELETE_FAIL,
    RESERVATION_DELETE_RESET,
    RESERVATION_STATISTICS_REQUEST,
    RESERVATION_STATISTICS_SUCCESS,
    RESERVATION_STATISTICS_FAIL,
    RESERVATION_STATISTICS_RESET,
    RESERVATION_CREATE_RESET,
    CLIENT_RESERVATIONS_REQUEST,
    CLIENT_RESERVATIONS_SUCCESS,
    CLIENT_RESERVATIONS_FAIL
} from "../constants/reservationConstants";

export const reservationListReducer = (
    state = { loading: true, reservations: [] },
    action
) => {
    switch (action.type) {
        case RESERVATION_LIST_REQUEST:
            return { loading: true, reservations: [] };
        case RESERVATION_LIST_SUCCESS:
            return {
                loading: false,
                reservations: action.payload.reservations,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case RESERVATION_LIST_FAIL:
            return { loading: false, error: action.payload };
        case RESERVATION_LIST_RESET:
            return { reservations: [] };
        default:
            return state;
    }
};

export const ReservationStatisticsReducer = (
    state = {
        loading: true,
        data: {
            reservations: [],
            sales: [],
            statistics: {
                total: 0,
                today: 0,
                reservations: 0,
            },
        },
    },
    action
) => {
    switch (action.type) {
        case RESERVATION_STATISTICS_REQUEST:
            return { loading: true, ...state };
        case RESERVATION_STATISTICS_SUCCESS:
            return {
                loading: false,
                data: action.payload,
            };
        case RESERVATION_STATISTICS_FAIL:
            return { loading: false, error: action.payload, ...state };
        case RESERVATION_STATISTICS_RESET:
            return {
                ...state,
                data: {
                    reservations: [],
                    sales: [],
                    statistics: {
                        total: 0,
                        today: 0,
                        reservations: 0,
                    },
                },
            };
        default:
            return state;
    }
};

export const reservationCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case RESERVATION_CREATE_REQUEST:
            return { loading: true };
        case RESERVATION_CREATE_SUCCESS:
            return { loading: false, success: true };
        case RESERVATION_CREATE_FAIL:
            return { loading: false, error: action.payload };
        case RESERVATION_CREATE_RESET:
            return {};
        default:
            return state;
    }
};

export const reservationDetailsReducer = (state = { reservation: {} }, action) => {
    switch (action.type) {
        case RESERVATION_DETAILS_REQUEST:
            return { ...state, loading: true };
        case RESERVATION_DETAILS_SUCCESS:
            return { loading: false, reservation: action.payload };
        case RESERVATION_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case RESERVATION_DETAILS_RESET:
            return { reservation: {} };
        default:
            return state;
    }
};

export const reservationUpdateReducer = (state = { reservation: {} }, action) => {
    switch (action.type) {
        case RESERVATION_UPDATE_REQUEST:
            return { loading: true };
        case RESERVATION_UPDATE_SUCCESS:
            return { loading: false, success: true, reservation: action.payload };
        case RESERVATION_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case RESERVATION_UPDATE_RESET:
            return { reservation: {} };
        default:
            return state;
    }
};

export const reservationDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case RESERVATION_DELETE_REQUEST:
            return { loading: true };
        case RESERVATION_DELETE_SUCCESS:
            return { loading: false, success: true };
        case RESERVATION_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case RESERVATION_DELETE_RESET:
            return {};
        default:
            return state;
    }
};

export const clientReservationsReducer = (state = { reservations: [] }, action) => {
    switch (action.type) {
        case CLIENT_RESERVATIONS_REQUEST:
            return { loading: true };
        case CLIENT_RESERVATIONS_SUCCESS:
            return { loading: false, reservations: action.payload };
        case CLIENT_RESERVATIONS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const reservationAllListReducer = (state = { reservations: [] }, action) => {
    switch (action.type) {
        case RESERVATION_LIST_REQUEST:
            return { loading: true, reservations: [] };
        case RESERVATION_LIST_SUCCESS:
            return {
                loading: false,
                reservations: action.payload.reservations,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case RESERVATION_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};