import axios from 'axios';
import { PAID_ORDER_DETAILS_REQUEST, 
        PAID_ORDER_DETAILS_SUCCESS, 
        PAID_ORDER_DETAILS_FAIL,
     } from '../constants/paidOrderConstants';

export const getPaidOrderDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: PAID_ORDER_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/paidorders/${id}`, config);

        dispatch({
            type: PAID_ORDER_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: PAID_ORDER_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
