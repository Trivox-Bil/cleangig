import React, {useEffect} from 'react';
import {Image} from 'native-base';
import {getLocal, storeLocal, USER_DATA_KEY} from "../storage";
import {LOGIN_SUCCESS, LOGOUT} from "../actions/types";
import {useDispatch} from "react-redux";

export default function ({navigation}) {
    const dispatch = useDispatch();

    useEffect(() => {
        setTimeout(async () => {
            const onFailed = async (e) => {
                await storeLocal(USER_DATA_KEY, {});
                dispatch({type: LOGOUT});
                navigation.replace('Login');
                return e;
            }

            try {
                const userData = JSON.parse(await getLocal(USER_DATA_KEY, '{}'));
                if (!userData.id) {
                    onFailed().then();
                    return;
                }

                dispatch({type: LOGIN_SUCCESS, payload: userData});

                if (userData.id[0] === 'c') {
                    navigation.replace('Customer');
                } else if (userData.id[0] === 'p') {
                    navigation.replace('Provider');
                }
            } catch (e) {
                onFailed(e).then(console.error);
            }
        }, 2000);
    }, []);

    return <Image source={require('../../assets/splash.png')} resizeMode="contain" style={{flex: 1}} alt=" "/>;
}
