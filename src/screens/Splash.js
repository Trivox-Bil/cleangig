import React, {useEffect} from 'react';
import {Image} from 'native-base';
import {getLocal, storeLocal, USER_ID_KEY} from "../storage";

export default function ({navigation}) {
    useEffect(() => {
        setTimeout(async () => {
            const userId = await getLocal(USER_ID_KEY, '');
            if (userId[0] === 'c') {
                navigation.replace('Customer');
            } else if (userId[0] === 'p') {
                navigation.replace('Provider');
            } else {
                await storeLocal(USER_ID_KEY, '');
                navigation.replace('Login');
            }
        }, 2000);
    }, []);

    return <Image source={require('../../assets/splash.png')} resizeMode="contain" style={{flex: 1}}/>;
}
