import { PAYMENT_LIST_REQUEST, PAYMENT_LIST_SUCCESS, PAYMENT_LIST_FAIL } from '../constants/paymentConstants';

export const paymentListReducer = (state = { loading: true, payments: [] },
    action
) => {
    switch (action.type) {
        case PAYMENT_LIST_REQUEST:
            return { loading: true, payments: [] };
        case PAYMENT_LIST_SUCCESS:
            return {
                loading: false,
                payments: action.payload.payments,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case PAYMENT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
