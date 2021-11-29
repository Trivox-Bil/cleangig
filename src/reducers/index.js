import {combineReducers} from "redux";
import userReducer from './user';
import notificationReducer from './notification';

export default combineReducers({
    user: userReducer,
    notification: notificationReducer,
});
