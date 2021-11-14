import React from 'react';
import {Button, HStack, Image, Text, VStack} from "native-base";
import {downloadFile, formatDate} from "../helpers";

export default function ({item: message}) {
    const isSender = message.sender.id === message.user.id;

    function TextContent() {
        return message.content.length > 0 ? <VStack alignItems="stretch" px={2} py={2}>
            <Text fontSize="md">{message.content}</Text>
            <Text color="dark.400">{formatDate(message.date, true)}</Text>
        </VStack> : null;
    }

    function ImageContent({...props}) {
        return message.attachment.trim().length <= 0 ? null : <VStack {...props}>
            <Image source={{uri: message.attachment}} resizeMode="contain" w="full" h={200} rounded="sm"/>
            <Button variant="subtle" alignSelf="center" onPress={() => downloadFile(message.attachment)}>
                Ladda ner
            </Button>
        </VStack>;
    }

    return isSender ? (
        <>
            <HStack bg="accent.400" ml={20} m={4} rounded="2xl">
                <TextContent/>
            </HStack>
            <ImageContent ml={20}/>
        </>
    ) : (
        <>
            <HStack space={2} bg="dark.600" mr={20} m={4} px={2} py={2} rounded="2xl">
                <Image source={{uri: message.sender.picture}} w={10} h={10} rounded="full" alt=" "/>
                <TextContent/>
            </HStack>
            <ImageContent mr={20}/>
        </>
    );
}
