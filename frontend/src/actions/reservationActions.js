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
    CLIENT_RESERVATIONS_REQUEST,
    CLIENT_RESERVATIONS_SUCCESS,
    CLIENT_RESERVATIONS_FAIL,
    RESERVATION_UPDATE_RESET
} from "../constants/reservationConstants";

import { USER_UPDATE_REQUEST, USER_UPDATE_SUCCESS, USER_UPDATE_FAIL } from '../constants/userConstants';
import { ROOM_UPDATE_REQUEST, ROOM_UPDATE_SUCCESS, ROOM_UPDATE_FAIL } from '../constants/roomConstants';

import { CLIENT_UPDATE_REQUEST, CLIENT_UPDATE_SUCCESS, CLIENT_UPDATE_FAIL } from "../constants/clientConstants";

import { updateRoom } from './roomActions';
import { updateClient } from './clientActions';

//get all categories with pagination
export const listReservations =
    (keyword = "", pageNumber = "") =>
    async (dispatch, getState) => {
        try {
            dispatch({
                type: RESERVATION_LIST_REQUEST,
            });

            console.log("Fetching reservations with keyword:", keyword, "and pageNumber:", pageNumber);

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

            console.log("Data received:", data);

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
    const { price, start_date, end_date, note, quantity, clientId, rooms, paymentId, is_paid, services, total} = reservation;

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
        const { data } = await axios.post("/api/reservations", { price, start_date, end_date, note, quantity, clientId, rooms, paymentId, is_paid, services, total }, config);
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
export const deleteReservation = (reservationId, reason) => async (dispatch, getState) => {
    try {
      dispatch({
        type: RESERVATION_DELETE_REQUEST,
      });

      console.log('Enviando solicitud DELETE al backend');

      const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
                "Content-Type": "application/json",
            },
        };

  
      // Enviar la solicitud para eliminar la reserva
      const { data } = await axios.delete(`/api/reservations/${reservationId}`,  {
        data: { reason }, ...config
      });
  
      dispatch({
        type: RESERVATION_DELETE_SUCCESS,
        payload: data,
      });

      const { reservationDetails: { reservation } } = getState();

      const clientUpdate = {
        id: reservation.clientId,
        has_reservation: false
      };

      dispatch({
        type: USER_UPDATE_REQUEST,
      });

      try {
        await axios.put(`/api/clients/${clientUpdate.id}`, clientUpdate, config);
        dispatch({
          type: USER_UPDATE_SUCCESS,
          payload: clientUpdate,
        });
      } catch (error) {
        dispatch({
          type: USER_UPDATE_FAIL,
          payload:
            error.response && error.response.data.message
              ? error.response.data.message
              : error.message,
        });
      }
  
  // Actualizar el estado de las habitaciones a active_status: false
      const rooms = reservation.rooms;
    await Promise.all(rooms.map(async (room) => {
      const updatedRoom = { ...room, active_status: false };
      await axios.put(`/api/rooms/${room.id}`, updatedRoom, config);
    }));

  } catch (error) {
    dispatch({
      type: RESERVATION_DELETE_FAIL,
      payload: error.response && error.response.data.message ? error.response.data.message : error.message,
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
            `/api/reservations/${reservation.id}/end`,
            { is_paid: true },
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

export const listReservationsByClient = (clientId) => async (dispatch, getState) => {
    try {
        dispatch({ type: CLIENT_RESERVATIONS_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`
            }
        };

        const { data } = await axios.get(`/api/reservations/client/${clientId}`, config);

        const reservationsWithRooms = await Promise.all(data.map(async (reservation) => {
            const response = await axios.get(`/api/reservations/${reservation.id}/rooms`, config);
            return { ...reservation, rooms: response.data };
        }));

        dispatch({
            type: CLIENT_RESERVATIONS_SUCCESS,
            payload: reservationsWithRooms
        });
    } catch (error) {
        dispatch({
            type: CLIENT_RESERVATIONS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const listAllReservations = ({ keyword = '', pageNumber = '' }) => async (dispatch, getState) => {
    try {
        dispatch({ type: RESERVATION_LIST_REQUEST });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/reservations?keyword=${keyword}&pageNumber=${pageNumber}`, config);

        dispatch({
            type: RESERVATION_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: RESERVATION_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};


