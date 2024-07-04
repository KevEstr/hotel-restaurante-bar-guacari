// actions/tableAuditActions.js
import axios from 'axios';
import { TABLE_AUDIT_LIST_REQUEST, TABLE_AUDIT_LIST_SUCCESS, TABLE_AUDIT_LIST_FAIL } from '../constants/tableAuditConstants';

export const listTableAudits = (keyword = '', pageNumber = '', startDate = '', endDate = '') => async (dispatch) => {
    try {
        dispatch({ type: TABLE_AUDIT_LIST_REQUEST });

        const { data } = await axios.get(`/api/tableaudits`, {
            params: { keyword, pageNumber, startDate, endDate },
        });

        dispatch({ type: TABLE_AUDIT_LIST_SUCCESS, payload: data });
    } catch (error) {
        dispatch({
            type: TABLE_AUDIT_LIST_FAIL,
            payload: error.response && error.response.data.message ? error.response.data.message : error.message,
        });
    }
};
