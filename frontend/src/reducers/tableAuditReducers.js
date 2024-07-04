// reducers/tableAuditReducers.js
import { TABLE_AUDIT_LIST_REQUEST, TABLE_AUDIT_LIST_SUCCESS, TABLE_AUDIT_LIST_FAIL } from '../constants/tableAuditConstants';

export const tableAuditListReducer = (state = { audits: [], page: 1, pages: 1 }, action) => {
    switch (action.type) {
        case TABLE_AUDIT_LIST_REQUEST:
            return { loading: true, audits: [] };
        case TABLE_AUDIT_LIST_SUCCESS:
            return {
                loading: false,
                audits: action.payload.audits,
                page: action.payload.page,
                pages: action.payload.pages,
            };
        case TABLE_AUDIT_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
