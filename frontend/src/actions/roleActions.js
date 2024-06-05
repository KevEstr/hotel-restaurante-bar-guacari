import axios from 'axios';
import { ROLE_LIST_REQUEST, ROLE_LIST_SUCCESS, ROLE_LIST_FAIL } from '../constants/roleConstants';

export const listRoles = (keyword = "", pageNumber = "") => async (dispatch, getState) => {
    try {
        dispatch({ type: ROLE_LIST_REQUEST });

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
            `/api/roles?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );
        dispatch({ type: ROLE_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: ROLE_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const allRoles = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: "ROLE_ALL_REQUEST",
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
        const { data } = await axios.get(`/api/roles/all`, config);

        dispatch({
            type: "ROLE_ALL_SUCCESS",
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: "ROLE_ALL_FAIL",
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
