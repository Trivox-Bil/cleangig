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
    Text,
    Box,
    Icon
} from 'native-base';
import AppBar from "../../components/AppBar";
import FetchContent from "../../components/FetchContent";
import { StyleSheet, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { FontAwesome5 } from '@expo/vector-icons';


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
        const { data } = await cleangigApi.get(`providers/${user.id}/notifications`);
        setNotifications(data.notifications)
        setLoading(false);
    }

    const openPage = async (notification) => {
        notification.seen = 1

        await cleangigApi.get(`read_notification/${notification.id}`);

        switch (notification.type) {
            case 'assigned-job':
                navigation.navigate("Jobs", { screen: "MyJob", params: { id: notification.job_id } });
                break;
            case 'message':
                navigation.navigate("Chat", { screen: "Chat", params: { id: notification.job_id } });
                break;
            default:
                break;
        }

        navigation.navigate();
    }

    const ListItem = ({ item }) => {
        return (
            <Box bg="#fff">
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
            </Box>
        );
    }

    // const ListItem = ({ item }) => {

    //     return (
    //         <TouchableHighlight
    //             onPress={() => openPage(item)}
    //             style={styles.rowFront}
    //             underlayColor={'#fff'}
    //         >
    //             {/* <HStack alignItems="center">
    //                 <VStack space={4} flex={0.95}>
    //                 <Text>{item.content}</Text>
    //                 </VStack>
    //             </HStack> */}
    //             <View>
    //                 <Heading fontWeight={item.seen == 1 ? 400 : 700} size="sm" mb={2} >{item.title}</Heading>
    //                 <Text>{item.content}</Text>
    //             </View>
    //         </TouchableHighlight>
    //     );
    // }

    const closeItem = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteItem = async item => {
        const { data } = await cleangigApi.get(`delete_notification/${item.id}`);
        fatchNotifications().then();
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={() => { deleteItem(data.item) }}
            >
                {/* <Text style={styles.btnText}>Delete</Text> */}
                <Icon as={FontAwesome5} name="trash" color="#ffffff" size="6"></Icon>
            </TouchableOpacity>
        </View>
    );

    return (
        <>
            <AppBar navigation={navigation} screenTitle="Aviseringar" />

            <FetchContent fetch={fatchNotifications}>
                {/* <FlatList
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
                /> */}
                <SwipeListView
                    data={notifications}
                    // data={listData}
                    keyExtractor={(noti) => noti.id}
                    renderItem={ListItem}
                    renderHiddenItem={renderHiddenItem}
                    leftOpenValue={0}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                ></SwipeListView>
            </FetchContent>
        </>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    list: {
        // color: '#FFF',
    },
    btnText: {
        color: '#FFF',
    },
    rowFront: {
        // alignItems: 'center',
        // backgroundColor: 'lightcoral',
        backgroundColor: 'white',
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 4,
        paddingVertical: 2,
        // height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#fff',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 5,
    },
    actionButton: {
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75,
    },
    closeBtn: {
        backgroundColor: 'blue',
        right: 75,
    },
    deleteBtn: {
        backgroundColor: 'red',
        right: 0,
    }
});

export default Notification;