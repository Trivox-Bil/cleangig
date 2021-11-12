import React, {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {cleangigApi} from "../../../network";
import {useSelector} from "react-redux";
import {Center, FlatList, Heading, Image, HStack, VStack, Pressable, Badge} from "native-base";
import AppBar from "../../../components/AppBar";
import FetchContent from "../../../components/FetchContent";
import services from "../../../data/services";

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchProjects().then(() => {
            setInterval(fetchProjects, 20000);
        });
    }, []);

    async function fetchProjects() {
        setLoading(true);
        const {data} = await cleangigApi.get(`customers/${user.id}/jobs`);
        setJobs(data.jobs);
        setLoading(false);
    }

    function EmptyComponent() {
        return <Center flex={1} py={150}>
            <Heading size="md" color="dark.300">Inget att visa</Heading>
        </Center>;
    }

    function ListItem({item: job}) {
        return <Pressable _pressed={{bg: 'gray.200'}} onPress={() => navigation.navigate('Job', {data: job})}
                          px={2} py={4} space={2} borderBottomWidth={1} borderColor="#ccc">
            <HStack alignItems="center">
                <Image source={services.find(s => s.id === job.service_id).icon} w={10} h={10} m={4} alt=" "/>
                <VStack space={4}>
                    <Heading size="sm">{job.title}</Heading>
                    <HStack space={4}>
                        <Badge>{job.visibility === 'private' ? 'Privat' : 'Offentligt'}</Badge>
                        <Badge>
                            {job.status === 'pending' && 'Väntar Godkännande'}
                            {job.status === 'initial' && 'Inte tilldelats'}
                            {job.status === 'assigned' && 'Pågående'}
                            {job.status === 'done' && 'Slutfört arbete'}
                        </Badge>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    }

    return <VStack flex={1}>
        <AppBar screenTitle="Jobb" navigation={navigation} backButton/>
        <FetchContent fetch={fetchProjects}>
            <FlatList
                onRefresh={fetchProjects}
                refreshing={loading}
                data={jobs.length > 0 ? jobs : []}
                keyExtractor={job => job.id}
                renderItem={ListItem}
                ListEmptyComponent={EmptyComponent}
            />
        </FetchContent>
    </VStack>;
}
