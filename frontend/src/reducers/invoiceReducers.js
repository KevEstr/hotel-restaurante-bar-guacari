// reducers/invoiceReducers.js
import { INVOICE_DETAILS_REQUEST, INVOICE_DETAILS_SUCCESS, INVOICE_DETAILS_FAIL } from '../constants/invoiceConstants';

export const invoiceDetailsReducer = (state = { invoice: {} }, action) => {
    switch (action.type) {
        case INVOICE_DETAILS_REQUEST:
            return { loading: true, ...state };
        case INVOICE_DETAILS_SUCCESS:
            return { loading: false, invoice: action.payload };
        case INVOICE_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
