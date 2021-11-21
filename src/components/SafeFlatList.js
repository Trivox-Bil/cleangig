import React from 'react';
import {KeyboardAwareFlatList} from "react-native-keyboard-aware-scroll-view";

export default function ({children, ...props}) {
    return <KeyboardAwareFlatList
        extraScrollHeight={100}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        {...props}
    >{children}</KeyboardAwareFlatList>
}
