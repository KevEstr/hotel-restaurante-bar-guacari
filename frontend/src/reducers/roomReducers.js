import {
    ROOM_LIST_REQUEST,
    ROOM_LIST_SUCCESS,
    ROOM_LIST_FAIL,
    ROOM_LIST_RESET,
    ROOM_CREATE_REQUEST,
    ROOM_CREATE_SUCCESS,
    ROOM_CREATE_FAIL,
    ROOM_DETAILS_REQUEST,
    ROOM_DETAILS_SUCCESS,
    ROOM_DETAILS_FAIL,
    ROOM_DETAILS_RESET,
    ROOM_UPDATE_REQUEST,
    ROOM_UPDATE_SUCCESS,
    ROOM_UPDATE_FAIL,
    ROOM_UPDATE_RESET,
    ROOM_DELETE_REQUEST,
    ROOM_DELETE_SUCCESS,
    ROOM_DELETE_FAIL,
    ROOM_DELETE_RESET,
    ROOM_ALL_REQUEST,
    ROOM_ALL_SUCCESS,
    ROOM_ALL_FAIL,
    ROOM_ALL_RESET
} from "../constants/roomConstants";

export const roomListReducer = (
    state = { loading: true, rooms: [] },
    action
) => {
    switch (action.type) {
        case ROOM_LIST_REQUEST:
            return { loading: true, rooms: [] };
        case ROOM_LIST_SUCCESS:
            return {
                loading: false,
                rooms: action.payload.rooms,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case ROOM_LIST_FAIL:
            return { loading: false, error: action.payload };
        case ROOM_LIST_RESET:
            return { rooms: [] };
        default:
            return state;
    }
};

export const roomAllReducer = (
    state = { loading: true, rooms: [] },
    action
) => {
    switch (action.type) {
        case ROOM_ALL_REQUEST:
            return { loading: true, rooms: [] };
        case ROOM_ALL_SUCCESS:
            return {
                rooms: action.payload,
                loading: false,
            };
        case ROOM_ALL_FAIL:
            return { loading: false, error: action.payload };
        case ROOM_ALL_RESET:
            return { rooms: [] };
        default:
            return state;
    }
};

export const roomCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case ROOM_CREATE_REQUEST:
            return { loading: true };
        case ROOM_CREATE_SUCCESS:
            return { loading: false, success: true };
        case ROOM_CREATE_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};

export const roomDetailsReducer = (state = { room: {} }, action) => {
    switch (action.type) {
        case ROOM_DETAILS_REQUEST:
            return { ...state, loading: true };
        case ROOM_DETAILS_SUCCESS:
            return { loading: false, room: action.payload };
        case ROOM_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        case ROOM_DETAILS_RESET:
            return { room: {} };
        default:
            return state;
    }
};

export const roomUpdateReducer = (state = { room: {} }, action) => {
    switch (action.type) {
        case ROOM_UPDATE_REQUEST:
            return { loading: true };
        case ROOM_UPDATE_SUCCESS:
            return { loading: false, success: true, room: action.payload };
        case ROOM_UPDATE_FAIL:
            return { loading: false, error: action.payload };
        case ROOM_UPDATE_RESET:
            return { room: {} };
        default:
            return state;
    }
};

export const roomDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ROOM_DELETE_REQUEST:
            return { loading: true };
        case ROOM_DELETE_SUCCESS:
            return { loading: false, success: true };
        case ROOM_DELETE_FAIL:
            return { loading: false, error: action.payload };
        case ROOM_DELETE_RESET:
            return {};
        default:
            return state;
    }
};
