import {LOGIN, LOGIN_ERROR, LOGIN_ERROR_NOT_FOUND, LOGIN_SUCCESS, LOGOUT} from "./types";
import {cleangigApi} from "../network";
import {storeLocal, USER_DATA_KEY} from "../storage";
import {resetRoute} from "../helpers";

export const login = (userType, formData) => async dispatch => {
    const endPoint = userType === 'private' ? 'customers/login' : 'providers/login';

    try {
        dispatch({type: LOGIN});
        const {data: response} = await cleangigApi.post(endPoint, formData);
        if (response.length === 0) {
            dispatch({type: LOGIN_ERROR_NOT_FOUND});
        } else {
            dispatch({type: LOGIN_SUCCESS, payload: response});
            await storeLocal(USER_DATA_KEY, response);
        }
    } catch (e) {
        console.error(e);
        dispatch({type: LOGIN_ERROR});
    }
}

export const logOut = (navigation) => async dispatch => {
    dispatch({type: LOGOUT});
    await storeLocal(USER_DATA_KEY, '{}');
    navigation.dispatch(resetRoute('Login'));
}
