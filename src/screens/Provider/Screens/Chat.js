import React, { useRef, useState, useEffect } from 'react';
import { cleangigApi, sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import { useSelector } from "react-redux";
import * as ImagePicker from "expo-image-picker";
import { Center, Actionsheet, Divider, HStack, Icon, IconButton, Image, Text, VStack, KeyboardAvoidingView, useDisclose } from "native-base";
// import { KeyboardAvoidingView } from 'react-native';
import ChatItem from "../../../components/ChatItem";
import FetchContent from "../../../components/FetchContent";
import FumiInput from "../../../components/FumiInput";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import askForPicture, { askForCamera } from "../../../helpers";
import mime from "mime";
// import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import SafeFlatList from "../../../components/SafeFlatList";
import { Keyboard } from "react-native";

export default function ({ navigation, route }) {
    // const job = route.params.job;
    const job = useRef(route.params.job || null);
    const user = useSelector(state => state.user.data);
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [attachment, setAttachment] = useState('');
    const [isSendDisabled, setisSendDisabled] = useState(true);
    const listRef = useRef();
    const { isOpen, onOpen, onClose } = useDisclose();
    const [jobPrice, setJobPrice] = useState(0);

    useEffect(() => {
        if (job.current == null && route.params.id) {
            fetchJob().then();
            fetchProposals(route.params.id)
        } else {
            fetchProposals(job.current.id)
        }
    }, [job.current])

    const fetchProposals = async (id) => {
        const { data: result } = await sotApi.get(`proposals/get_all?job=${id}`);
        if (result.success) {
            result.proposals.forEach(proposal => {
                if (proposal?.provider?.id === user.id) {
                    setJobPrice(proposal.price);
                }
            });
        }
    };

    async function fetchJob() {
        const { data } = await cleangigApi.get(`jobs/${route.params.id}`);
        // setJob(data.job);
        job.current = data.job
        loadChats();
    }

    async function loadChats() {
        if (job.current !== null) {
            setIsLoading(true);
            // const { data } = await cleangigApi.get(`jobs/${job.id}/messages`);
            const { data } = await cleangigApi.get(`messages/${job.current.id}/${job.current.customer_id}/${user.id}`);
            // setMessages(data.chats.map(m => ({ ...m, user })));
            console.log(data.chats.map(m => console.log(m)));
            await cleangigApi.get(`read_messages/${job.current.id}/1`);
            setMessages(data.chats);
            setIsLoading(false);
        }
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
            const { data } = await cleangigApi.post('files', request);

            setAttachment(data.files[0]);
            setisSendDisabled(false);
        }
    }

    async function openCamera() {
        onClose();
        const { cameraStatus } = await ImagePicker.getCameraPermissionsAsync();
        // console.log("cameraStatus", cameraStatus);
        if (cameraStatus !== "granted") {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== "granted") {
                return;
            }
        }

        let file = await askForCamera();
        if (!file.cancelled) {
            const filePaths = file.uri.split("/");
            const request = new FormData();
            request.append("files[]", {
                uri: file.uri,
                name: filePaths[filePaths.length - 1],
                type: mime.getType(file.uri),
            });
            const { data } = await cleangigApi.post("files", request);
            setisSendDisabled(false);
            setAttachment(data.files[0]);
        }
    }

    async function sendMessage() {
        if (newMessage.trim() !== '') {
            const request = new FormData();
            // request.append('sender', user.id);
            // request.append('content', newMessage);
            // request.append('attachment', attachment);
            // await cleangigApi.post(`jobs/${job.current.id}/messages`, request);
            request.append('sender', 0);
            request.append('provider_id', user.id);
            request.append('customer_id', job.current.customer.id);
            request.append('content', newMessage);
            request.append('file', attachment);
            await cleangigApi.post(`messages/${job.current.id}`, request);
            const message = {
                to: job.current.customer.notification_token,
                sound: 'default',
                title: `Du har ett nytt meddelande`,
                body: `${user.name}: ${newMessage}`,
                data: { type: 'message', details: { job: job.current } },
            };
            const notificationData = new FormData();
            notificationData.append('provider_id', user.id);
            notificationData.append('job_id', job.current.id);
            notificationData.append('content', message.body);
            notificationData.append('title', message.title);
            notificationData.append('type', `message`);
            const { data: notification } = await cleangigApi.post(`customers/${job.current.customer.id}/notification`, notificationData);
            message.data.notification_id = notification.id;
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
            setisSendDisabled(true);
            setNewMessage('');
            setAttachment('');
            await loadChats();
        }
    }

    function _backButtonHandler() {
        navigation.replace('Provider', { screen: 'Chat' });
    }

    return <VStack flex={1} justifyContent="space-between">
        <AppBar screenTitle={`${job.current?.title} (prisförslag - ${jobPrice} KR)`} navigation={navigation} backButton
            customOptions={[{ action: loadChats, icon: 'sync' }]}
            />
            {/* backButtonHandler={_backButtonHandler}  */}
        <KeyboardAvoidingView
            h={{
                base: "705px",
                lg: "auto",
            }}
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : ""}
        >
            <VStack flex={1} p={4} bg="white">
                <FetchContent fetch={loadChats}>
                    <SafeFlatList
                        flex={1}
                        refreshing={isLoading}
                        onRefresh={loadChats}
                        data={messages}
                        keyExtractor={job => job.id}
                        renderItem={({ item }) => <ChatItem message={item} user={user}></ChatItem>}
                        ref={listRef}
                        onContentSizeChange={() => listRef.current && listRef.current.scrollToEnd({ animated: true })}
                        ListEmptyComponent={function () {
                            return <Center flex={1} py={150}>
                                <Text color="dark.300">Var den första att kommentera</Text>
                            </Center>
                        }}
                    />
                </FetchContent>

                {attachment.length > 0 && (
                    <VStack h={100} p={4} bg="white">
                        <Image source={{ uri: attachment }} resizeMode="center" w={100} h={100} alt=" " />
                        <Divider />
                    </VStack>
                )}
            </VStack>
            <HStack alignItems="center" bg="white">
                <FumiInput label="Skicka meddelande" icon={{ type: FontAwesome5, name: 'comments' }} value={newMessage}
                    onChangeText={(text) => { setNewMessage(text); setisSendDisabled(false); }} style={{ flex: 1 }} multiline height={70} />
                <IconButton icon={<Icon as={FontAwesome5} name="image" color="brand.400" size="sm" />}
                    onPress={() => { Keyboard.dismiss(); onOpen() }} />
                <IconButton icon={<Icon as={FontAwesome} name="send" color="brand.400" size="sm" />} onPress={sendMessage}
                    disabled={isSendDisabled} />
            </HStack>
        </KeyboardAvoidingView>
        <Actionsheet isOpen={isOpen} onClose={onClose}>
            <Actionsheet.Content>
                <Actionsheet.Item onPress={openCamera}>Öppna kamera</Actionsheet.Item>
                <Actionsheet.Item onPress={choosePicture}>
                    Välj från biblioteket
                </Actionsheet.Item>
                <Actionsheet.Item onPress={onClose}>Avbryt</Actionsheet.Item>
            </Actionsheet.Content>
        </Actionsheet>
    </VStack>;
}
