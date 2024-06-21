import axios from 'axios';
import { INVOICE_DETAILS_REQUEST, INVOICE_DETAILS_SUCCESS, INVOICE_DETAILS_FAIL } from '../constants/invoiceConstants';

export const getInvoiceDetails = (id) => async (dispatch, getState) => {
    try {
        dispatch({ type: INVOICE_DETAILS_REQUEST });

        const {
            userLogin: { userInfo },
        } = getState();

        const config = {
            headers: {
                Authorization: `Bearer ${userInfo.token}`,
            },
        };

        const { data } = await axios.get(`/api/invoices/${id}`, config);

        dispatch({
            type: INVOICE_DETAILS_SUCCESS,
            payload: data,
        });
    } catch (error) {
        dispatch({
            type: INVOICE_DETAILS_FAIL,
            payload: error.response && error.response.data.message
                ? error.response.data.message
                : error.message,
        });
    }
};
