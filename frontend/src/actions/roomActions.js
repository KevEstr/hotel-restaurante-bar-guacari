import axios from "axios";
import {
    ROOM_LIST_REQUEST,
    ROOM_LIST_SUCCESS,
    ROOM_LIST_FAIL,
    ROOM_CREATE_REQUEST,
    ROOM_CREATE_SUCCESS,
    ROOM_CREATE_FAIL,
    ROOM_DETAILS_REQUEST,
    ROOM_DETAILS_SUCCESS,
    ROOM_DETAILS_FAIL,
    ROOM_UPDATE_REQUEST,
    ROOM_UPDATE_SUCCESS,
    ROOM_UPDATE_FAIL,
    ROOM_DELETE_REQUEST,
    ROOM_DELETE_SUCCESS,
    ROOM_DELETE_FAIL,
    ROOM_ALL_REQUEST,
    ROOM_ALL_SUCCESS,
    ROOM_ALL_FAIL,
    UPDATE_ROOM_STATUS_SUCCESS,
    UPDATE_ROOM_STATUS_FAIL
} from "../constants/roomConstants";

//get all tables
export const allRooms = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: ROOM_ALL_REQUEST,
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
        const { data } = await axios.get(`/api/rooms/all`, config);

        dispatch({
            type: ROOM_ALL_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_ALL_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get all tables with pagination
export const listRooms = (keyword = "", pageNumber = "") => async (
    dispatch,
    getState
) => {
    try {
        dispatch({
            type: ROOM_LIST_REQUEST,
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
            `/api/rooms?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );

        dispatch({
            type: ROOM_LIST_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_LIST_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//create a table
export const createRoom = (room) => async (dispatch, getState) => {
    const { name, active_status } = room;

    try {
        dispatch({
            type: ROOM_CREATE_REQUEST,
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
        const { data } = await axios.post("/api/rooms", {name, active_status}, config);
        dispatch({
            type: ROOM_CREATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_CREATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//get table details
export const listRoomDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: ROOM_DETAILS_REQUEST });

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
        const { data } = await axios.get(`/api/rooms/${id}`, config);
        dispatch({
            type: ROOM_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_DETAILS_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//update a table
export const updateRoom = (room) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ROOM_UPDATE_REQUEST,
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
            `/api/rooms/${room.id}`,
            room,
            config
        );
        dispatch({
            type: ROOM_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

//delete table
export const deleteRoom = (id) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ROOM_DELETE_REQUEST,
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
        await axios.delete(`/api/rooms/${id}`, config);
        dispatch({
            type: ROOM_DELETE_SUCCESS,
        });
    } catch (error) {
        dispatch({
            type: ROOM_DELETE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};

export const updateStatusRoom = (roomId, active_status) => async (dispatch, getState) => {
    try {
        dispatch({
            type: ROOM_UPDATE_REQUEST,
        });

        const { userLogin: { userInfo } } = getState();

        const config = {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.put(`/api/rooms/roomStatus/${roomId}`, { active_status }, config);

        dispatch({
            type: ROOM_UPDATE_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: ROOM_UPDATE_FAIL,
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
