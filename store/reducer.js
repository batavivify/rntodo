import {
    SET_ADD_DIALOG,
    SET_ITEM_OBJECT,
    SET_ITEM_VALUE
} from './actionTypes';

const initialState = {
    addDialog: false,
    item: {
        index: 0,
        name: '',
        priority: 0,
        isCompleted: false
    }
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADD_DIALOG:
            return {
                ...state,
                addDialog: action.payload.addDialog
            };
        case SET_ITEM_OBJECT:
            return {
                ...state,
                item:action.payload.item
            };
        case SET_ITEM_VALUE:
            return {
                ...state,
                item: {
                    ...state.item,
                    [action.payload.name]: action.payload.value
                }
            };
        default:
            return state;
    }
};

export default reducer;