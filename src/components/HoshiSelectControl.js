import {Divider, Select, Text, VStack} from "native-base";
import React from "react";

export default function ({label, collection, ...selectProps}) {
    return <>
        <VStack px={4} borderColor="brand.400" borderBottomWidth={4}>
            <Text color="dark.400" fontSize="md" fontWeight={200}>{label}</Text>
            <Select fontSize="lg" color="dark.400" fontWeight="bold" variant="unstyled" h={10}
                    _selectedItem={{bg: 'accent.400'}} {...selectProps}>
                {collection.map((c, i) => {
                    return <Select.Item key={i} label={c.label} value={c.value}/>;
                })}
            </Select>
        </VStack>
        <Divider height={.5} bg="dark.600"/>
    </>;
}
