import React from 'react';
import {defaultTheme} from "../theme";
import {Fumi} from "react-native-textinput-effects";

export default function ({label, icon: {type, name, color, size, width}, ...props}) {
    return <Fumi
        label={label}
        iconClass={type}
        iconName={name}
        iconColor={color || defaultTheme.colors.dark["400"]}
        iconSize={size || 20}
        iconWidth={width || 40}
        inputPadding={16}
        {...props}
    />;
}
