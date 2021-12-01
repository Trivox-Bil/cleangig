import DateTimePicker from "@react-native-community/datetimepicker";
import React, {useState} from "react";
import {Platform} from "react-native";
import {Heading, Pressable} from "native-base";
import format from "date-fns/format";

export default function DatePicker({value, onChange, minimumDate = new Date(), ...pickerProps}) {
    const [isVisible, setIsVisible] = useState(false);

    function onChangeFn(e, selectedDate) {
        setIsVisible(Platform.OS === 'ios');
        onChange(selectedDate || value);
    }

    return <>
        <Pressable onPress={() => setIsVisible(!isVisible)} alignItems="center" bg="light.200" p={4} rounded="md">
            <Heading size="sm">{format(value, 'yyyy-MM-dd HH:mm')}</Heading>
        </Pressable>
        {isVisible && (
            <DateTimePicker mode="datetime" is24Hour={true} display="default" minimumDate={minimumDate} value={value}
                            onChange={onChangeFn} {...pickerProps}/>
        )}
    </>;
}
