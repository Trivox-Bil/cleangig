import React, { useRef, useState, useEffect } from "react";
import { cleangigApi, sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import * as ImagePicker from "expo-image-picker";
import { useSelector } from "react-redux";
import {
  Center,
  Actionsheet,
  useDisclose,
  Divider,
  HStack,
  Icon,
  IconButton,
  Image,
  KeyboardAvoidingView,
  Text,
  VStack,
} from "native-base";
import ChatItem from "../../../components/ChatItem";
import FetchContent from "../../../components/FetchContent";
import FumiInput from "../../../components/FumiInput";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import askForPicture, { askForCamera } from "../../../helpers";
import mime from "mime";
import SafeFlatList from "../../../components/SafeFlatList";
import { Keyboard } from "react-native";

export default function ({ navigation, route }) {
  // const job = route.params.job;
  const job = useRef(route.params.job || null);
  const user = useSelector((state) => state.user.data);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [sending, setSending] = useState(false);
  const listRef = useRef();
  const { isOpen, onOpen, onClose } = useDisclose();
  const [jobPrice, setJobPrice] = useState(0);
  let provider_id = route.params.provider_id
    || (job.current !== null
      ? job.current.candidate != null && job.current.candidate != ''
        ? job.current.candidate : job.current.provider_id : 0)

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
      let providerId = route.params.provider_id
        || (job.current !== null
          ? job.current.candidate != null && job.current.candidate != ''
            ? job.current.candidate : job.current.provider_id : 0)

        result.proposals.forEach(proposal => {
            if ((providerId !== 0 && provider_id === proposal?.provider?.id)) {
                console.log(proposal.price)
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
      // const { data } = await cleangigApi.get(`jobs/${job.current?.id}/messages`);
      // setMessages(data.chats.map((m) => ({ ...m, user })));

      const { data } = await cleangigApi.get(`messages/${job.current.id}/${user.id}/${provider_id}`);
      await cleangigApi.get(`read_messages/${job.current.id}/0`);
      setMessages(data.chats);
      setIsLoading(false);
    }
  }

  async function choosePicture() {
    onClose();
    const file = await askForPicture();
    if (!file.cancelled) {
      const filePaths = file.uri.split("/");
      const request = new FormData();
      request.append("files[]", {
        uri: file.uri,
        name: filePaths[filePaths.length - 1],
        type: mime.getType(file.uri),
      });
      const { data } = await cleangigApi.post("files", request);

      setAttachment(data.files[0]);
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

      setAttachment(data.files[0]);
    }
  }

  async function sendMessage() {
    if (newMessage.trim() !== '') {
      setSending(true);
      // console.log("sending");
      const request = new FormData();
      // request.append("sender", user.id);
      // request.append("content", newMessage);
      // request.append("attachment", attachment);
      // console.log('job', job)
      // await cleangigApi.post(`jobs/${job.current.id}/messages`, request);
      request.append('sender', 1);
      request.append('provider_id', provider_id);
      request.append('customer_id', user.id);
      request.append('content', newMessage);
      request.append('file', attachment);
      await cleangigApi.post(`messages/${job.current.id}`, request);
      if (job.current.provider || job.current.provider_notification_token) {
        const message = {
          to: job.current.provider ? job.current.provider.notification_token : job.current.provider_notification_token,
          sound: 'default',
          title: `Du har ett nytt meddelande`,
          body: `${user.fname} ${user.lname}: ${newMessage}`,
          data: { type: 'message', details: { job: job.current } },
        };
        const notificationData = new FormData();
        notificationData.append('customer_id', user.id);
        notificationData.append('job_id', job.current.id);
        notificationData.append('content', message.body);
        notificationData.append('title', message.title);
        notificationData.append('type', `message`);
        const { data: notification } = await cleangigApi.post(`providers/${provider_id}/notification`, notificationData);
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
      }
      setSending(false);
      setNewMessage("");
      setAttachment("");
      await loadChats();
    }
  }

  function _backButtonHandler() {
    navigation.replace('Customer', { screen: 'ChatMain' });
  }

  return (

    <VStack flex={1} safeArea justifyContent="space-between">
      <AppBar
        screenTitle={`${job.current?.title} (prisförslag - ${jobPrice} KR)`}
        navigation={navigation}
        backButton
        backButtonHandler={_backButtonHandler}
        customOptions={[{ action: loadChats, icon: "sync" }]}
      />
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
              keyExtractor={(job) => job.id}
              renderItem={({ item }) => <ChatItem message={item} user={user}></ChatItem>}
              ref={listRef}
              onContentSizeChange={() =>
                listRef.current && listRef.current.scrollToEnd({ animated: true })
              }
              ListEmptyComponent={function () {
                return (
                  <Center flex={1} py={150}>
                    <Text color="dark.300">Var den första att kommentera</Text>
                  </Center>
                );
              }}
            />
          </FetchContent>

          {attachment.length > 0 && (
            <VStack h={100} p={4} bg="white">
              <Image
                source={{ uri: attachment }}
                resizeMode="center"
                w={100}
                h={100}
                alt=" "
              />
              <Divider />
            </VStack>
          )}
        </VStack>
        <HStack alignItems="center" bg="white">
          <FumiInput
            label="Skicka meddelande"
            icon={{ type: FontAwesome5, name: "comments" }}
            value={newMessage}
            onChangeText={setNewMessage}
            style={{ flex: 1 }}
            multiline
            height={70}
          />
          <IconButton
            icon={
              <Icon as={FontAwesome5} name="image" color="brand.400" size="sm" />
            }
            onPress={() => { Keyboard.dismiss(); onOpen() }}
          />
          <IconButton
            icon={
              <Icon as={FontAwesome} name="send" color="brand.400" size="sm" />
            }
            onPress={sendMessage}
            disabled={sending}
          />
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
    </VStack>

  );
}
