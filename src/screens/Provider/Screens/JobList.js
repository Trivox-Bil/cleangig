import React, {useEffect, useState} from 'react';
import {Image, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {CheckBox, ListItem, Text} from 'react-native-elements';
import {useSelector} from "react-redux";
import {sotApi} from "../../../network";
import AppBar from "../../../components/AppBar";
import services from "../../../data/services";
import {county} from "../../../data/counties";
import {formatDate} from "../../../helpers";

export default function ({navigation}) {
    const provider = useSelector(state => state.user.data);
    const [loading, setLoading] = useState(false);
    const [onlyLocation, setOnlyLocation] = useState(false);
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        fetchJobs().then();
        setInterval(fetchJobs, 20000);
    }, []);

    async function fetchJobs() {
        setLoading(true);
        const {data} = await sotApi.get(`jobs/relevant?provider=${provider.id}`);
        data.success && setJobs(data.jobs.filter(j => j.status === 'initial'));
        setLoading(false);
    }

    return <>
        <AppBar screenTitle="Sök lediga jobb" navigation={navigation}/>

        <ScrollView contentContainerStyle={styles.container}
                    refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchJobs}/>}>

            <View style={{flexDirection: 'row', margin: 10, alignItems: 'center'}}>
                <CheckBox checked={onlyLocation} onPress={() => setOnlyLocation(!onlyLocation)} checkedColor="#ff7e1a"/>
                <TouchableOpacity onPress={() => setOnlyLocation(!onlyLocation)}>
                    <Text>Via enbart lokala jobb</Text>
                </TouchableOpacity>
            </View>

            {jobs.filter(job => onlyLocation ? job.county_code === provider.county_code : true).map(job => (
                <ListItem key={job.id} bottomDivider onPress={() => navigation.push('Job', {job})}>
                    <View style={{padding: 12.5}}>
                        <Image
                            source={services.find(s => s.id === job.service_id).icon}
                            style={{width: 50, height: 50}}/>
                    </View>
                    <ListItem.Content>
                        <ListItem.Title>{job.title}</ListItem.Title>
                        <ListItem.Subtitle>{county(job.county_code).name} • {services.find(s => s.id === job.service_id).name}</ListItem.Subtitle>
                        <ListItem.Subtitle>{formatDate(job.deadline, true)}</ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            ))}
            {jobs.length < 1 && (
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <Text style={{fontSize: 18, textAlign: 'center', color: '#555'}}>Inget att visa</Text>
                </View>
            )}
        </ScrollView>
    </>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
