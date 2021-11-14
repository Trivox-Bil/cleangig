import React, {useCallback} from "react";
import {Button, ScrollView} from "native-base";
import {isEqual} from "lodash";

export default function ({options, value, onChange}) {
    const itemColor = useCallback((status) => {
        return isEqual(status, value) ? 'accent' : 'brand';
    }, [value]);

    const itemRounded = useCallback((status) => {
        return isEqual(status, value) ? 'sm' : 'full';
    }, [value]);

    return <ScrollView horizontal _contentContainerStyle={{mx: 1, alignItems: 'center'}} maxH={20} mt={2}>
        {options.map((option, i) => {
            return <Button key={i} mx={1} colorScheme={itemColor(option.value)}
                           rounded={itemRounded(option.value)} onPress={() => onChange(option.value)}>
                {option.title}
            </Button>;
        })}
    </ScrollView>;
}
