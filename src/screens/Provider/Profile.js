import React from 'react';
import AppBar from "../../components/AppBar";
import {useDispatch} from "react-redux";
import {LOGOUT} from "../../actions/types";
import {storeLocal, USER_DATA_KEY} from "../../storage";
import {resetRoute} from "../../helpers";

export default function ({navigation}) {
    const dispatch = useDispatch();

    async function logOut() {
        dispatch({type: LOGOUT});
        await storeLocal(USER_DATA_KEY, '{}');
        navigation.dispatch(resetRoute('Login'));
    }

    return <>
        <AppBar navigation={navigation} screenTitle="Profil" customOptions={[
            {action: logOut, icon: 'sign-out-alt'},
        ]}/>
    </>;
};
