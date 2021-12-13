import React, {useCallback, useEffect, useState} from 'react';
import {cleangigApi} from "../../../network";
import {useSelector} from "react-redux";
import {Badge, Center, FlatList, Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import AppBar from "../../../components/AppBar";
import FetchContent from "../../../components/FetchContent";
import JobStatusFilter from "../../../components/JobStatusFilter";
import services from "../../../data/services";

const STATUS_ALL = ["pending", "initial", "assigned", "done"];
const STATUS_PENDING = ["pending"];
const STATUS_INITIAL = ["initial"];
const STATUS_ASSIGNED = ["assigned"];
const STATUS_DONE = ["done"];

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [statusFilter, setStatusFilter] = useState(STATUS_ALL);

    useEffect(() => {
        fetchProjects().then(() => {
            setInterval(fetchProjects, 20000);
        });
    }, []);

    const filteredJobs = useCallback(() => {
        return jobs.filter(j => statusFilter.includes(j.status));
    }, [jobs, statusFilter]);

    async function fetchProjects() {
        setLoading(true);
        const {data} = await cleangigApi.get(`customers/${user.id}/jobs`);
        setJobs(data.jobs);
        setLoading(false);
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
        <AppBar screenTitle="Jobb" navigation={navigation} customOptions={[{action: fetchProjects, icon: 'sync'}]}/>
        <VStack flex={0.1}>
            <JobStatusFilter value={statusFilter} onChange={setStatusFilter} options={[
                {value: STATUS_ALL, title: 'Allt'},
                {value: STATUS_PENDING, title: 'Väntar Godkännande'},
                {value: STATUS_INITIAL, title: 'Inte tilldelats'},
                {value: STATUS_ASSIGNED, title: 'Pågående'},
                {value: STATUS_DONE, title: 'Slutfört arbete'},
            ]}/>
        </VStack>
        <VStack flex={0.9}>
            <FetchContent fetch={fetchProjects}>
                <FlatList
                    refreshing={loading}
                    onRefresh={fetchProjects}
                    data={filteredJobs()}
                    keyExtractor={job => job.id}
                    renderItem={ListItem}
                    ListEmptyComponent={function() {
                        return <Center flex={1} py={150}>
                            <Heading size="md" color="dark.300">Inget att visa</Heading>
                        </Center>
                    }}
                />
            </FetchContent>
        </VStack>
    </VStack>;
}
