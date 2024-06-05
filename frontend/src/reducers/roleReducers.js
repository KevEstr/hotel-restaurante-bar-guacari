import { ROLE_LIST_REQUEST, ROLE_LIST_SUCCESS, ROLE_LIST_FAIL } from '../constants/roleConstants';

export const roleListReducer = (state = { loading: true, roles: [] },
    action
) => {
    switch (action.type) {
        case ROLE_LIST_REQUEST:
            return { loading: true, roles: [] };
        case ROLE_LIST_SUCCESS:
            return {
                loading: false,
                roles: action.payload.roles,
                pages: action.payload.pages,
                page: action.payload.page,
            };
        case ROLE_LIST_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;
    }
};
