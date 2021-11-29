import React from 'react';
import {defaultTheme} from "../theme";
import {Hoshi} from "react-native-textinput-effects";

export default function ({label, color, ...props}) {
    return <Hoshi
        label={label}
        borderColor={color || defaultTheme.colors.brand["400"]}
        borderHeight={3}
        inputPadding={16}
        labelStyle={{fontWeight: '700'}}
        inputStyle={{fontWeight: '300'}}
        backgroundColor={'#F9F7F600'}
        {...props}
    />;
}
