import React, {useRef, useState} from 'react';
import {cleangigApi} from "../../../network";
import AppBar from "../../../components/AppBar";
import {useSelector} from "react-redux";
import {Center, Divider, HStack, Icon, IconButton, Image, Text, VStack} from "native-base";
import ChatItem from "../../../components/ChatItem";
import FetchContent from "../../../components/FetchContent";
import FumiInput from "../../../components/FumiInput";
import {FontAwesome, FontAwesome5} from "@expo/vector-icons";
import askForPicture from "../../../helpers";
import mime from "mime";
import SafeFlatList from "../../../components/SafeFlatList";

export default function ({navigation, route}) {
    const job = route.params.job;
    const user = useSelector(state => state.user.data);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState('');
    const [sending, setSending] = useState(true);
    const listRef = useRef();

    async function loadChats() {
        setIsLoading(true);
        const {data} = await cleangigApi.get(`jobs/${job.id}/messages`);
        setMessages(data.chats.map(m => ({...m, user})));
        setIsLoading(false);
    }

    async function choosePicture() {
        const file = await askForPicture();
        if (!file.cancelled) {
            const filePaths = file.uri.split('/');
            const request = new FormData();
            request.append('files[]', {
                uri: file.uri,
                name: filePaths[filePaths.length - 1],
                type: mime.getType(file.uri),
            });
            const {data} = await cleangigApi.post('files', request);

            setAttachment(data.files[0]);
        }
    }

    async function sendMessage() {
        setSending(true);
        const request = new FormData();
        request.append('sender', user.id);
        request.append('content', newMessage);
        request.append('attachment', attachment);
        await cleangigApi.post(`jobs/${job.id}/messages`, request);
        setSending(false);
        setNewMessage('');
        setAttachment('');
        await loadChats();
    }

    return <VStack flex={1} justifyContent="space-between">
        <AppBar screenTitle={job.title} navigation={navigation} backButton
                customOptions={[{action: loadChats, icon: 'sync'}]}/>

        <FetchContent fetch={loadChats}>
            <SafeFlatList
                flex={1}
                refreshing={isLoading}
                onRefresh={loadChats}
                data={messages}
                keyExtractor={job => job.id}
                renderItem={ChatItem}
                ref={listRef}
                onContentSizeChange={() => listRef.current && listRef.current.scrollToEnd({animated: true})}
                ListEmptyComponent={function () {
                    return <Center flex={1} py={150}>
                        <Text color="dark.300">Var den första att kommentera</Text>
                    </Center>
                }}
            />
        </FetchContent>

        {attachment.length > 0 && (
            <VStack h={100} p={4} bg="white">
                <Image source={{uri: attachment}} resizeMode="center" w={100} h={100} alt=" "/>
                <Divider/>
            </VStack>
        )}
        <HStack alignItems="center" bg="white">
            <FumiInput label="Skicka meddelande" icon={{type: FontAwesome5, name: 'comments'}} value={newMessage}
                       onChangeText={setNewMessage} style={{flex: 1}} multiline height={70}/>
            <IconButton icon={<Icon as={FontAwesome5} name="image" color="brand.400" size="sm"/>}
                        onPress={choosePicture}/>
            <IconButton icon={<Icon as={FontAwesome} name="send" color="brand.400" size="sm"/>} onPress={sendMessage}
                        disabled={sending}/>
        </HStack>
    </VStack>;
}
