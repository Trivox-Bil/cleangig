import React, { useEffect, useState, useRef } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Box, HStack, Pressable, Icon, Text, VStack } from "native-base";
// import { CheckBox, ListItem, Text } from 'react-native-elements';
import { useSelector } from "react-redux";
import { sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import services from "../../../data/services";
import { county } from "../../../data/counties";
import { formatDate } from "../../../helpers";
import JobStatusFilter from "../../../components/JobStatusFilter";
import { includes } from 'lodash';
import { SearchBar } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import FetchContent from "../../../components/FetchContent";
import { Ionicons } from '@expo/vector-icons';

export default function ({ navigation }) {
    const user = useSelector(state => state.user.data);
    const provider = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [onlyLocation, setOnlyLocation] = useState(false);
    // const [jobs, setJobs] = useState([]);
    const jobs = useRef([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    // const [statusFilter, setStatusFilter] = useState('all');
    const statusFilter = useRef('all');
    const [searchToken, setSearchToken] = useState('');
    const [searching, setSearching] = useState(false);
    const [selectedJob, setSelectedJob] = useState(false);

    useEffect(() => {
        fetchJobs().then();
        // setInterval(fetchJobs, 20000);
    }, []);

    async function fetchJobs() {
        setLoading(true);
        const { data } = await sotApi.get(`jobs/relevant?provider=${provider.id}`);
        if (data.success) {
            jobs.current=data.jobs;
            filterJobs()
            // setFilteredJobs(data.jobs.filter(j => j.status === 'initial'))
        }
        setLoading(false);
    }

    /* const filter = (status) => {
        statusFilter.current = status;
         if (status === 'archived') {
            setFilteredJobs(jobs.current.filter(job => job.archived));
        } else {
            setFilteredJobs(jobs.current.filter(job => !job.archived && provider.county_code.split(",").includes(job.county_code)));
        }
        // if (status === 'local') {
        //     setFilteredJobs(jobs.current.filter(job => includes(provider.county_code.split(",") && !job.archived, job.county_code, 0)));
        // } else if (status === 'archived') {
        //     setFilteredJobs(jobs.current.filter(job => job.archived));
        // } else {
        //     setFilteredJobs(jobs.current.filter(job => !job.archived));
        // }
    } */

    const filterJobs = () => {
        let tempJobs = jobs.current.filter(job => !job.archived && provider.county_code.split(",").includes(job.county_code));
        if (searchToken.trim() !== "") {
            console.log('yes here', searchToken);
            const searchedService = [];
            services.map(s => {
                if (s.name.includes(searchToken)) {
                    searchedService.push(s.id)
                }
            });
            setFilteredJobs(tempJobs.filter(job => 
                job.title.includes(searchToken) 
                || job.city.includes(searchToken) 
                || job.street.includes(searchToken) 
                || (searchedService.length > 0 && searchedService.includes(job.service_id))
            ));
        } else {
            setFilteredJobs(tempJobs)
        }
    }

    const archive = async (job) => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', user.id);
        await sotApi.post(`jobs/archive`, formData);
        fetchJobs();
    }

    function ListItem({ item }) {
        return (
            <Box bg="#fff">
                <Pressable _pressed={{ bg: 'gray.200' }} borderBottomWidth={1} borderColor="#ccc" onPress={() => navigation.push('Job', { job: item })}>
                    <HStack alignItems="center">
                        <View style={{ padding: 12.5, paddingHorizontal: 25 }}>
                            <Image
                                source={services.find(s => s.id === item.service_id).icon}
                                style={{ width: 50, height: 50 }} />
                        </View>
                        <View>
                            <Text fontSize={16}>{item.title}</Text>
                            <Text fontSize={13}>{county(item.county_code).name} • {services.find(s => s.id === item.service_id).name}</Text>
                            <Text fontSize={13}>{formatDate(item.deadline, true)}</Text>
                        </View>
                    </HStack>
                </Pressable>
            </Box>
        )
    }

    const renderHiddenItem = (data, rowMap) => (
        <View style={styles.rowBack}>
            <TouchableOpacity
                style={[styles.actionButton, styles.deleteBtn]}
                onPress={() => { closeItem(rowMap, data.item.id); archive(data.item)}}
            >
                <Icon as={Ionicons} name="archive" color="#ffffff" size="6"></Icon>
            </TouchableOpacity>
        </View>
    );

    const closeItem = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    return <VStack flex={1} position='relative'>
        <AppBar screenTitle="Tillgängliga jobb" navigation={navigation} />
        <SearchBar
            placeholder="Sök"
            platform={Platform.OS}
            onChangeText={setSearchToken}
            value={searchToken}
            showLoading={searching}
            onSubmitEditing={filterJobs}
        />

        {/* <ScrollView contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs} />}>
            <VStack flex={0.9} style={{borderTopColor: '#CCCCCC', borderTopWidth: 1, marginBottom: 10}}>
                {filteredJobs.map(job => (
                    <ListItem key={job.id} bottomDivider onPress={() => navigation.push('Job', { job })}>
                        <View style={{ padding: 12.5 }}>
                            <Image
                                source={services.find(s => s.id === job.service_id).icon}
                                style={{ width: 50, height: 50 }} />
                        </View>
                        <ListItem.Content>
                            <ListItem.Title>{job.title}</ListItem.Title>
                            <ListItem.Subtitle>{county(job.county_code).name} • {services.find(s => s.id === job.service_id).name}</ListItem.Subtitle>
                            <ListItem.Subtitle>{formatDate(job.deadline, true)}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>
                ))}
                {filteredJobs.length < 1 && (
                    <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: '#555' }}>Inget att visa</Text>
                    </View>
                )}
            </VStack>
        </ScrollView> */}
        <FetchContent fetch={fetchJobs}>
            <SwipeListView
                data={filteredJobs}
                keyExtractor={(job) => job.id}
                renderItem={ListItem}
                renderHiddenItem={renderHiddenItem}
                leftOpenValue={0}
                rightOpenValue={-75}
                previewRowKey={'0'}
                previewOpenValue={-40}
                previewOpenDelay={3000}
            ></SwipeListView>
        </FetchContent>
        
        <Button position='absolute' bottom={2} right={2} rounded="full" _text={{color: 'white'}} onPress={() => navigation.navigate('ArchiveJobList')}>
            Arkiverade jobb
        </Button>
    </VStack>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    list: {
        // color: '#FFF',
    },
    btnText: {
        color: '#FFF',
    },
    rowFront: {
        backgroundColor: 'white',
        borderBottomColor: '#ccc',
        borderBottomWidth: 0.5,
        justifyContent: 'center',
        paddingHorizontal: 4,
        paddingVertical: 2,
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
    deleteBtn: {
        backgroundColor: 'red',
        right: 0,
    }
});