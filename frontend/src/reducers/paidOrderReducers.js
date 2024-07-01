// reducers/invoiceReducers.js
import { PAID_ORDER_DETAILS_REQUEST, PAID_ORDER_DETAILS_SUCCESS, PAID_ORDER_DETAILS_FAIL } from '../constants/paidOrderConstants';

export const paidOrderDetailsReducer = (state = { paidOrder: {} }, action) => {
    switch (action.type) {
        case PAID_ORDER_DETAILS_REQUEST:
            return { loading: true, ...state };
        case PAID_ORDER_DETAILS_SUCCESS:
            return { loading: false, paidOrder: action.payload };
        case PAID_ORDER_DETAILS_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
