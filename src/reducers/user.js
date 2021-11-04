import {LOGIN, LOGIN_ERROR, LOGIN_ERROR_NOT_FOUND, LOGIN_SUCCESS, LOGOUT, SET_PUSH_TOKEN} from "../actions/types";

const initialState = {
    loggedIn: false,
    loggedInStatus: LOGOUT,
    data: null,
    pushToken: '',
};

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN:
            return {...state, loggedInStatus: LOGIN};
        case LOGIN_SUCCESS:
            return {
                ...state,
                loggedIn: true,
                loggedInStatus: LOGIN_SUCCESS,
                data: action.payload,
            };
        case LOGIN_ERROR_NOT_FOUND:
            return {...state, loggedInStatus: LOGIN_ERROR_NOT_FOUND}
        case LOGIN_ERROR:
            return {...state, loggedInStatus: LOGIN_ERROR}
        case LOGOUT:
            return {...state, loggedInStatus: LOGOUT, loggedIn: false};
        case SET_PUSH_TOKEN:
            return {...state, pushToken: action.payload};
        default:
            return state;
    }
}
