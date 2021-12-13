import React, { useEffect, useState } from 'react';
import { cleangigApi, sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import { ScrollView, VStack } from "native-base";
import PendingJob from "../../../components/PendingJob";
import UnassignedJob from "../../../components/UnassignedJob";
import voca from "voca";
import AssignedJob from "../../../components/AssignedJob";
import SafeScrollView from "../../../components/SafeScrollView";
import ClosedJob from "../../../components/ClosedJob";

export default function ({ navigation, route }) {
    const [job, setJob] = useState(route.params.data || null);
    const [pictures, setPictures] = useState([]);

    // console.log('navigation ===>>>', navigation);
    // console.log('route ===>>>', route);

    useEffect(() => {
        if (job && job.picture != null) {
            let pictures;
            try {
                pictures = JSON.parse(voca.unescapeHtml(job.picture));
            } catch (e) {
                console.error(e);
            }

            setPictures(pictures || []);
        } else if (route.params.id) {
            fetchJob().then();
        }
    }, [job])

    async function fetchJob() {
        const { data } = await cleangigApi.get(`jobs/${route.params.id}`);
        setJob(data.job);
    }

    async function deleteJob() {
        await cleangigApi.delete(`jobs/${job.id}`);
        navigation.goBack();
    }

    function _backButtonHandler() {
        navigation.replace('Customer', { screen: 'Job' });
    }

    return <VStack flex={1}>
        <AppBar screenTitle={job ? job.title : 'loading...'} navigation={navigation} backButton backButtonHandler={_backButtonHandler} />

        <SafeScrollView flex={1}>
            {job && job.status === 'pending' && <PendingJob pictures={pictures} job={job} onDelete={deleteJob} />}
            {job && job.status === 'initial' && <UnassignedJob job={job} pictures={pictures} onDelete={deleteJob} navigation={navigation} />}
            {job && job.status === 'assigned' && <AssignedJob job={job} pictures={pictures} navigation={navigation}
                onDelete={deleteJob} />}
            {job && job.status === 'done' && <ClosedJob id={job.id} pictures={pictures} />}
        </SafeScrollView>
    </VStack>;
}
