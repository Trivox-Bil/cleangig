import React, { useEffect, useState, useRef } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { VStack } from "native-base";
import { CheckBox, ListItem, Text } from 'react-native-elements';
import { useSelector } from "react-redux";
import { sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import services from "../../../data/services";
import { county } from "../../../data/counties";
import { formatDate } from "../../../helpers";
import JobStatusFilter from "../../../components/JobStatusFilter";
import { includes } from 'lodash';

export default function ({ navigation }) {
    const provider = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [onlyLocation, setOnlyLocation] = useState(false);
    // const [jobs, setJobs] = useState([]);
    const jobs = useRef([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    // const [statusFilter, setStatusFilter] = useState('all');
    const statusFilter = useRef('all');

    useEffect(() => {
        fetchJobs().then();
        setInterval(fetchJobs, 20000);
    }, []);

    async function fetchJobs() {
        setLoading(true);
        const { data } = await sotApi.get(`jobs/relevant?provider=${provider.id}`);
        if (data.success) {
            jobs.current=data.jobs;
            filter(statusFilter.current)
            // setFilteredJobs(data.jobs.filter(j => j.status === 'initial'))
        }
        setLoading(false);
    }

    const filter = (status) => {
        statusFilter.current = status;
        if (status === 'local') {
            setFilteredJobs(jobs.current.filter(job => includes(provider.county_code.split(",") && !job.archived, job.county_code, 0)));
        } else if (status === 'archived') {
            setFilteredJobs(jobs.current.filter(job => job.archived));
        } else {
            setFilteredJobs(jobs.current.filter(job => !job.archived));
        }
    }

    return <VStack flex={1}>
        <AppBar screenTitle="Sök lediga jobb" navigation={navigation} />

        <ScrollView contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs} />}>

            {/* <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
                <CheckBox checked={onlyLocation} onPress={() => setOnlyLocation(!onlyLocation)} checkedColor="#ff7e1a"/>
                <TouchableOpacity onPress={() => setOnlyLocation(!onlyLocation)}>
                    <Text>Via enbart lokala jobb</Text>
                </TouchableOpacity>
            </View> */}
            <VStack flex={0.1}>
                <JobStatusFilter value={statusFilter.current} onChange={(status) => {filter(status)}} options={[
                    { value: 'all', title: 'Allt' },
                    { value: 'local', title: 'Via only local jobs' },
                    { value: 'archived', title: 'Arkiverade jobb' },
                ]} />
            </VStack>
            <VStack flex={0.9}>
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
        </ScrollView>
    </VStack>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
