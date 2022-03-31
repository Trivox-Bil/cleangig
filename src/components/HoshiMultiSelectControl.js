import {Divider, Select, Text, VStack} from "native-base";
import React from "react";
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

export default function ({label, collection, onValueChange, selectedValue, searchPlaceholderText, confirmText}) {

    return <>
        <VStack px={4} borderColor="brand.400" borderBottomWidth={4}>
            <Text color="dark.400" bold fontSize="md" fontWeight={200}>{label}</Text>
            {/* <Select fontSize="md" color="dark.400" variant="unstyled" h={10}
                    _selectedItem={{bg: 'accent.400'}} {...selectProps}>
                {collection.map((c, i) => {
                    return <Select.Item key={i} label={c.label} value={c.value}/>;
                })}
            </Select> */}
            <SectionedMultiSelect 
                items={collection} uniqueKey="id" 
                selectText="Välj plats..." 
                searchPlaceholderText={searchPlaceholderText}
                confirmText={confirmText}
                onSelectedItemsChange={onValueChange} 
                selectedItems={selectedValue}
                IconRenderer={MaterialIcons} />
        </VStack>
        <Divider height={.5} bg="dark.600"/>
    </>;
}
