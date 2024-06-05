const initialState = {
    section: 'restaurante',  // El restaurante es el predeterminado
};

export const sectionReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_SECTION':
            return { ...state, section: action.payload };
        default:
            return state;
    }
};