import React, { useEffect, useState } from 'react';
import { cleangigApi } from "../../network";
import { useSelector } from "react-redux";
import {
    Center,
    FlatList,
    Heading,
    Pressable,
    HStack,
    VStack,
    Text
} from 'native-base';
import AppBar from "../../components/AppBar";
import FetchContent from "../../components/FetchContent";

const Notification = ({ navigation }) => {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(async () => {
        fatchNotifications().then();
        setInterval(fatchNotifications, 20000);

    }, [])

    const fatchNotifications = async () => {
        setLoading(true);
        const { data } = await cleangigApi.get(`customers/${user.id}/notifications`);
        setNotifications(data.notifications)
        // console.log(data.notifications)
        setLoading(false);
    }

    const openPage = async (notification) => {
        notification.seen = 1

        await cleangigApi.get(`read_notification/${notification.id}`);

        switch (notification.type) {
            case 'proposal':
                navigation.navigate("Job", { screen: "Job", params: { id: notification.job_id } })
                break;
            case 'closed-job':
                navigation.navigate("Job", { screen: "Job", params: { id: notification.job_id } })
                break;
            case 'message':
                navigation.navigate("ChatMain", { screen: "Chat", params: { id: notification.job_id, provider_id: notification.provider_id } });
                break;
            default: 
                break;
        }

        navigation.navigate();
    }

    const ListItem = ({ item }) => {
        return (
            <Pressable
                _pressed={{ bg: "gray.200" }}
                onPress={() => openPage(item)}
                px={2}
                py={4}
                space={2}
                borderBottomWidth={1}
                borderColor="#ccc"
            >
                <HStack alignItems="center">
                    <VStack space={4} flex={0.95}>
                        <Heading fontWeight={item.seen == 1 ? 400 : 700} size="sm" >{item.title}</Heading>
                        <Text>{item.content}</Text>
                    </VStack>
                </HStack>
            </Pressable>
        );
    }

    return (
        <>
            <AppBar navigation={navigation} screenTitle="Aviseringar" />

            <FetchContent fetch={fatchNotifications}>
                <FlatList
                    refreshing={loading}
                    onRefresh={fatchNotifications}
                    data={notifications}
                    keyExtractor={(noti) => noti.id}
                    renderItem={ListItem}
                    ListEmptyComponent={function () {
                        return (
                            <Center flex={1} py={150}>
                                <Heading size="md" color="dark.300">
                                    Inget att visa
                                </Heading>
                            </Center>
                        );
                    }}
                />
            </FetchContent>
        </>
    );
}

export default Notification;