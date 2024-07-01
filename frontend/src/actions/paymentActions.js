import axios from 'axios';
import { PAYMENT_LIST_REQUEST, PAYMENT_LIST_SUCCESS, PAYMENT_LIST_FAIL } from '../constants/paymentConstants';

export const listPayments = (keyword = "", pageNumber = "") => async (dispatch, getState) => {
    try {
        dispatch({ type: PAYMENT_LIST_REQUEST });

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
            `/api/payments?keyword=${keyword}&pageNumber=${pageNumber}`,
            config
        );
        dispatch({ type: PAYMENT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: PAYMENT_LIST_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};

export const allPayments = () => async (dispatch, getState) => {
    try {
        dispatch({
            type: "PAYMENT_ALL_REQUEST",
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
        const { data } = await axios.get(`/api/payments/all`, config);

        dispatch({
            type: "PAYMENT_ALL_SUCCESS",
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: "PAYMENT_ALL_FAIL",
            payload:
                error.response && error.response.data.message
                    ? error.response.data.message
                    : error.message,
        });
    }
};
