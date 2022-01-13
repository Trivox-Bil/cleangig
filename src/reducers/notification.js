import {SET_NOTIFICATION, SET_PUSH_TOKEN, SET_NOTIFICATION_OPEN, SET_NOTIFICATION_OPENED, SET_NOTIFICATION_COUNT} from "../actions/types";

const initialState = {
    pushToken: '',
    notification: null,
    isOpen: false,
    count: 0
};

export default function (state = initialState, action) {
    switch (action.type) {
        case SET_PUSH_TOKEN:
            return {...state, pushToken: action.payload};
        case SET_NOTIFICATION:
            return {...state, notification: action.payload, count: action.payload.count};
        case SET_NOTIFICATION_OPEN:
            return {...state, notification: action.payload, isOpen: true};
        case SET_NOTIFICATION_OPENED:
            return {...state, isOpen: false};
        case SET_NOTIFICATION_COUNT:
            return {...state, count: action.payload};
        default:
            return state;
    }
}
