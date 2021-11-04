import {LOGIN, LOGIN_ERROR, LOGIN_ERROR_NOT_FOUND, LOGIN_SUCCESS} from "./types";
import {cleangigApi} from "../network";

export const login = formData => async dispatch => {
    try {
        dispatch({type: LOGIN});
        const {data: response} = await cleangigApi.post('customers/login', formData);
        if (response.length === 0) {
            dispatch({type: LOGIN_ERROR_NOT_FOUND});
        } else {
            dispatch({type: LOGIN_SUCCESS, payload: response});
        }
    } catch (e) {
        console.error(e);
        dispatch({type: LOGIN_ERROR});
    }
}