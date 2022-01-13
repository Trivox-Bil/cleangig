import React, { useState } from 'react';
import { Button, HStack, Image, Pressable, Text, VStack } from "native-base";
import { downloadFile, formatDate } from "../helpers";
import ImageView from "react-native-image-viewing";

export default function ({ message, user }) {
    // const isSender = message.sender.id === message.user.id;
    // console.log("message", message)
    const isSender = message.provider.id == user.id
        ? message.sender == 0 ? true : false
        : message.customer.id == user.id && message.sender == 1 ? true : false;

    function TextContent() {
        return message.content.length > 0 ? <VStack alignItems="stretch" px={2} py={2}>
            <Text fontSize="md">{message.content}</Text>
            <Text color="dark.400">{formatDate(message.created_at, true)}</Text>
        </VStack> : null;
    }

    function ImageContent({ ...props }) {
        const [visible, setIsVisible] = useState(false);
        return message.file.trim().length <= 0 ? null : <VStack {...props}>
            <Pressable onPress={() => setIsVisible(!visible)}>
                <Image source={{ uri: message.file }} resizeMode="contain" w="full" h={200} rounded="sm" />
            </Pressable>
            {/* <Button variant="subtle" alignSelf="center" onPress={() => downloadFile(message.file)}>
                Ladda ner
            </Button> */}
            <ImageView
                images={[{ uri: message.file }]}
                imageIndex={0}
                visible={visible}
                onRequestClose={() => setIsVisible(false)}
            />
        </VStack>;
    }

    return isSender ? (
        <>
            <HStack bg="accent.400" ml={20} m={4} rounded="2xl">
                <TextContent />
            </HStack>
            <ImageContent ml={20} />
        </>
    ) : (
        <>
            <HStack space={2} bg="dark.700" mr={20} m={4} px={2} py={2} rounded="2xl">
                <Image source={{ uri: message.sender == 0 ? message.provider.picture : message.customer.picture }} w={10} h={10} rounded="full" alt=" " />
                <TextContent />
            </HStack>
            <ImageContent mr={20} />
        </>
    );
}
