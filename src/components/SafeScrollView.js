import React from 'react';
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";

export default function ({children, ...props}) {
    return <KeyboardAwareScrollView
        extraScrollHeight={100}
        resetScrollToCoords={{x: 0, y: 0}}
        scrollEnabled={true}
        keyboardShouldPersistTaps="handled"
        {...props}
    >{children}</KeyboardAwareScrollView>
}
