import {SET_NOTIFICATION, SET_PUSH_TOKEN, SET_NOTIFICATION_OPEN, SET_NOTIFICATION_OPENED} from "../actions/types";

const initialState = {
    pushToken: '',
    notification: null,
    isOpen: false,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PUSH_TOKEN:
            return {...state, pushToken: action.payload};
        case SET_NOTIFICATION:
            return {...state, notification: action.payload};
        case SET_NOTIFICATION_OPEN:
            return {...state, notification: action.payload, isOpen: true};
        case SET_NOTIFICATION_OPENED:
            return {...state, isOpen: false};
        default:
            return state;
    }
}
