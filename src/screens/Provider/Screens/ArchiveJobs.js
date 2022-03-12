import React, { useEffect, useState, useRef } from 'react';
import { Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Pressable, VStack } from "native-base";
import { CheckBox, ListItem, Text } from 'react-native-elements';
import { useSelector } from "react-redux";
import { sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import services from "../../../data/services";
import { county } from "../../../data/counties";
import { formatDate } from "../../../helpers";
import { SearchBar } from 'react-native-elements';

export default function ({ navigation }) {
    const provider = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [onlyLocation, setOnlyLocation] = useState(false);
    const jobs = useRef([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const statusFilter = useRef('all');
    const [searchToken, setSearchToken] = useState('');
    const [searching, setSearching] = useState(false);

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
        let tempJobs = jobs.current.filter(job => job.archived);
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


    return <VStack flex={1} position='relative'>
        <AppBar screenTitle="Arkiverade jobb" backButton navigation={navigation} />
        <SearchBar
            placeholder="Sök"
            platform={Platform.OS}
            onChangeText={setSearchToken}
            value={searchToken}
            showLoading={searching}
            onSubmitEditing={filterJobs}
        />

        <ScrollView contentContainerStyle={styles.container}
            refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs} />}>

            {/* <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
                <CheckBox checked={onlyLocation} onPress={() => setOnlyLocation(!onlyLocation)} checkedColor="#ff7e1a"/>
                <TouchableOpacity onPress={() => setOnlyLocation(!onlyLocation)}>
                    <Text>Via enbart lokala jobb</Text>
                </TouchableOpacity>
            </View> */}
            {/* <VStack flex={0.1}>
                <JobStatusFilter value={statusFilter.current} onChange={(status) => {filter(status)}} options={[
                    { value: 'all', title: 'Allt' },
                    // { value: 'local', title: 'Via only local jobs' },
                    { value: 'archived', title: 'Arkiverade jobb' },
                ]} />
            </VStack> */}
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
        </ScrollView>
        <Button position='absolute' bottom={2} right={2} rounded="full" _text={{color: 'white'}}>
            Arkiverade jobb
        </Button>
    </VStack>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
