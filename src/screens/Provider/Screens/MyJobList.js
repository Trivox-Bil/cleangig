import React, { useCallback, useEffect, useState } from 'react';
import { cleangigApi } from "../../../network";
import { useSelector } from "react-redux";
import { Badge, Center, FlatList, Heading, HStack, Image, Pressable, Text, SectionList, VStack, Icon } from "native-base";
import AppBar from "../../../components/AppBar";
import FetchContent from "../../../components/FetchContent";
import JobStatusFilter from "../../../components/JobStatusFilter";
import services from "../../../data/services";
import { county } from "../../../data/counties"
import { FontAwesome5 } from '@expo/vector-icons';

const STATUS_ALL = ["assigned", "done", "initial"];
const STATUS_ASSIGNED = ["assigned"];
const STATUS_DONE = ["done"];
const STATUS_WAITING = ["initial"];

export default function ({ navigation }) {
    const user = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [jobs, setJobs] = useState([]);
    const [showListId, setShowListId] = useState(0);

    useEffect(() => {
        fetchProjects().then(() => {
            setInterval(fetchProjects, 20000);
        });
    }, []);

    /*     const filteredJobs = useCallback(() => {
            return jobs.filter(j => statusFilter.includes(j.status));
        }, [jobs, statusFilter]); */

    async function fetchProjects() {
        setLoading(true);
        const { data } = await cleangigApi.get(`providers/${user.id}/jobs`);
        let temp = {
            all: data.jobs,
            assigned: data.jobs.filter(j => STATUS_ASSIGNED.includes(j.status)),
            done: data.jobs.filter(j => STATUS_DONE.includes(j.status)),
            waiting: data.jobs.filter(j => STATUS_WAITING.includes(j.status)),
        }
        setJobs(temp);
        setLoading(false);
    }

    const openJobDetails = (job) => {
        if (job.status === 'initial') {
            job.county = { code: job.county_code, name: county(job.county_code).name }
            navigation.navigate('Browse', { screen: 'Job', params: { job: job } })
        } else {
            navigation.navigate('MyJob', { data: job })
        }
    }

    const ListHead = (id, title) => {
        return <Pressable borderBottomWidth={1} borderColor="#ccc" onPress={() => showListId === id ? setShowListId(null) : setShowListId(id)}>
            <HStack px={2} py={4} space={2}  justifyContent="space-between">
                <Text fontWeight="bold">{title}</Text>
                {
                    id === showListId 
                    ? <Icon as={FontAwesome5} size="5" name="chevron-down" />
                    : <Icon as={FontAwesome5} size="5" name="chevron-right" />
                }
                
            </HStack>
        </Pressable>
    }

    const ListItem = ({ item }) => {
        return <Pressable _pressed={{ bg: 'gray.200' }} onPress={() => openJobDetails(item)}
            px={2} py={4} space={2} borderBottomWidth={1} borderColor="#ccc">
            <HStack alignItems="center">
                <Image source={services.find(s => s.id === item.service_id).icon} w={10} h={10} m={4} alt=" " />
                <VStack space={4}>
                    <Heading size="sm">{item.title}</Heading>
                    <HStack space={4}>
                        <Badge>{item.visibility === 'private' ? 'Privat' : 'Offentligt'}</Badge>
                        <Badge>
                            {item.status === 'assigned' && 'Pågående'}
                            {item.status === 'done' && 'Slutfört arbete'}
                            {item.status === 'initial' && 'Väntar på svar'}
                        </Badge>
                    </HStack>
                </VStack>
            </HStack>
        </Pressable>
    }

    return <VStack flex={1}>
        <AppBar screenTitle="Jobb" navigation={navigation} customOptions={[{ action: fetchProjects, icon: 'sync' }]} />

        {ListHead(0, 'Allt')}
        {0 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.all}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}

        {ListHead(1, 'Pågående')}
        {1 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.assigned}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}

        {ListHead(2, 'Slutfört arbete')}
        {2 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.done}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}

        {ListHead(3, 'Väntar på svar')}
        {3 === showListId && <FlatList
            refreshing={loading}
            onRefresh={fetchProjects}
            data={jobs.waiting}
            keyExtractor={job => job.id}
            renderItem={ListItem}
            ListEmptyComponent={function () {
                return <Center flex={1} py={150}>
                    <Heading size="md" color="dark.300">Inget att visa</Heading>
                </Center>
            }}
        />}
    </VStack>;
}
