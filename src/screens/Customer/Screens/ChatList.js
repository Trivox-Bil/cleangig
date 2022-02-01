import React, { useState, useEffect } from 'react';
import { cleangigApi } from "../../../network";
import { useSelector } from "react-redux";
import { Badge, Center, FlatList, Heading, HStack, Image, Pressable, Text, VStack, Box } from "native-base";
import FetchContent from "../../../components/FetchContent";
import AppBar from "../../../components/AppBar";
import { StyleSheet, TouchableOpacity, TouchableHighlight, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';

export default function ({ navigation }) {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState(jobs);

    useEffect(() => {
        fetchProjects().then(() => {
            setInterval(fetchProjects, 20000);
        });
    }, []);

    async function fetchProjects() {
        setLoading(true);
        // const {data} = await cleangigApi.get(`customers/${user.id}/chats`);
        // console.log(data)
        // const {data} = await cleangigApi.get(`customers/${user.id}/jobs`);
        // setJobs(data.jobs.filter(j => ['assigned'].includes(j.status)));
        const { data } = await cleangigApi.get(`customer/${user.id}/chatlists`);
        setJobs(data.jobs);
        setLoading(false);
    }

    function ListItem({ item }) {
        return <Box bg="#fff">
            <Pressable _pressed={{ bg: 'gray.200' }} px={2} space={2} borderBottomWidth={1} borderColor="#ccc"
                onPress={() => navigation.navigate('Chat', { job: item })} >
                <HStack justifyContent="space-between">
                    <HStack alignItems="center">
                        <Image source={{ uri: item.provider.picture }} w={20} h={20} m={4} rounded="full" borderColor="accent.400"
                            borderWidth={2} alt=" " />
                        <VStack space={2}>
                            <Heading size="sm">{item.provider.name}</Heading>
                            <Text>{item.title}</Text>
                        </VStack>
                    </HStack>
                    {
                        item.sender == '0' && item.read_status == 'unread' &&
                        <VStack justifyContent="center" mr={4}>
                            <Badge size="5" bgColor="#ff7e1a" borderRadius={50}  ></Badge>
                        </VStack>
                    }

                </HStack>
            </Pressable>
        </Box>
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.actionButton, styles.closeBtn]}
                onPress={() => closeItem(rowMap, data.item.id)}
            >
                <Text style={styles.btnText}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={() => deleteItem(data.item)}
            >
                <Text style={styles.btnText}>Delete</Text>
            </TouchableOpacity>
        </View>
    );

    const closeItem = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };
    
    const deleteItem = async item => {
        console.log(item)
        const { data } = await cleangigApi.get(`delete_chat/${item.id}/${item.customer_id}/${item.provider.id}`);
        fetchProjects().then();
    }

    return <>
        <AppBar screenTitle="Chatt" navigation={navigation} />

        <FetchContent fetch={fetchProjects}>
            {/* <FlatList
                refreshing={loading}
                onRefresh={fetchProjects}
                data={jobs}
                keyExtractor={job => job.id}
                renderItem={ListItem}
                ListEmptyComponent={function () {
                    return <Center flex={1} py={150}>
                        <Heading size="md" color="dark.300">Inget att visa</Heading>
                    </Center>
                }}
            /> */}
            <SwipeListView
                data={jobs}
                // data={listData}
                keyExtractor={(job) => job.id}
                renderItem={ListItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={75}
                rightOpenValue={-150}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
            ></SwipeListView>
        </FetchContent>
    </>;
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