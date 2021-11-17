import React, {useState} from 'react';
import {cleangigApi} from "../../../network";
import {useSelector} from "react-redux";
import {Center, FlatList, Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import FetchContent from "../../../components/FetchContent";
import AppBar from "../../../components/AppBar";

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState(jobs);

    async function fetchProjects() {
        setLoading(true);
        const {data} = await cleangigApi.get(`providers/${user.id}/jobs`);
        setJobs(data.jobs.filter(j => ['assigned', 'done'].includes(j.status)));
        setLoading(false);
    }

    function ListItem({item: job}) {
        return <Pressable _pressed={{bg: 'gray.200'}} px={2} space={2} borderBottomWidth={1} borderColor="#ccc"
                          onPress={() => navigation.navigate('Chat', {job})}>
            <HStack alignItems="center">
                <Image source={{uri: job.customer.picture}} w={20} h={20} m={4} rounded="full" borderColor="accent.400"
                       borderWidth={2} alt=" "/>
                <VStack space={2}>
                    <Heading size="sm">{job.customer.fname} {job.customer.lname}</Heading>
                    <Text>{job.title}</Text>
                </VStack>
            </HStack>
        </Pressable>
    }

    return <>
        <AppBar screenTitle="Chatt" navigation={navigation}/>

        <FetchContent fetch={fetchProjects}>
            <FlatList
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
            />
        </FetchContent>
    </>;
}
