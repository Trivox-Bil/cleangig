import React from "react";
import {Box, HStack, Icon, IconButton, StatusBar, Text, VStack} from "native-base";
import {FontAwesome5} from "@expo/vector-icons";

export default function ({screenTitle, navigation, backButton, customOptions = []}) {
    return <>
        <StatusBar backgroundColor="#ff7e1a"/>
        <Box safeAreaTop bg="brand.400"/>

        <VStack bg="brand.400">
            <HStack px={2} py={3} justifyContent="space-between" alignItems="center">
                <HStack space={4} alignItems="center">
                    {!!backButton && (
                        <IconButton icon={<Icon as={<FontAwesome5 name="angle-left"/>} size="sm" color="light.100"/>}
                                    onPress={() => navigation.goBack()}/>
                    )}
                    <Text fontSize={16} fontWeight="bold" color="light.100" isTruncated
                          flexShrink={1}>{screenTitle}</Text>
                </HStack>
                <HStack space={2}>
                    {customOptions.map(({action, icon}, i) => (
                        <IconButton key={i} onPress={action}
                                    icon={<Icon as={<FontAwesome5 name={icon}/>} size="sm" color="light.100"/>}/>
                    ))}
                </HStack>
            </HStack>
        </VStack>
    </>;
}
