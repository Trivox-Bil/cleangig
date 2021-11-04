import {SET_NOTIFICATION, SET_PUSH_TOKEN} from "../actions/types";

const initialState = {
    pushToken: '',
    notification: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PUSH_TOKEN:
            return {...state, pushToken: action.payload};
        case SET_NOTIFICATION:
            return {...state, notification: action.payload};
        default:
            return state;
    }
}
