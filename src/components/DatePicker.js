import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform } from "react-native";
import { Heading, Pressable } from "native-base";
import format from "date-fns/format";
import DateTimePickerModal from "react-native-modal-datetime-picker";

export default function DatePicker({ value, onChange, minimumDate = new Date(), ...pickerProps }) {
    const [isVisible, setIsVisible] = useState(false);

    function onChangeFn(selectedDate) {
        setIsVisible(false);
        onChange(selectedDate || value);
    }


    const hideDatePicker = () => {
        setIsVisible(false);
    };


    return <>
        <Pressable onPress={() => setIsVisible(!isVisible)} alignItems="center" bg="light.200" p={4} rounded="md">
            <Heading size="sm">{format(value, 'yyyy-MM-dd HH:mm')}</Heading>
        </Pressable>
        <DateTimePickerModal
            isVisible={isVisible}
            mode="datetime"
            display={Platform.OS === 'ios' ? "inline" : "default"}
            date={value}
            minimumDate={minimumDate}
            onConfirm={onChangeFn}
            onCancel={hideDatePicker}
        />
    </>;
}
