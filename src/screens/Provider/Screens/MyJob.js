import React, {useEffect, useState} from 'react';
import {cleangigApi, sotApi} from "../../../network";
import AppBar from "../../../components/AppBar";
import {Button, HStack, VStack} from "native-base";
import PendingJob from "../../../components/PendingJob";
import UnassignedJob from "../../../components/UnassignedJob";
import voca from "voca";
import AssignedJob from "../../../components/AssignedJob";
import ClosedJob from "../../../components/ClosedJob";
import SafeScrollView from "../../../components/SafeScrollView";

export default function ({navigation, route}) {
    const [job, setJob] = useState(route.params.data || null);
    const [pictures, setPictures] = useState([]);

    useEffect(() => {
        if (job) {
            let pictures;
            try {
                pictures = JSON.parse(voca.unescapeHtml(job.picture));
                pictures = pictures.map(pic => `https://cleangig.se/uploads/${pic}`)
            } catch (e) {
                console.error(e);
            }

            setPictures(pictures || []);
        } else if (route.params.id) {
            fetchJob().then();
        }
    },[job])

    async function fetchJob() {
        const {data} = await cleangigApi.get(`jobs/${route.params.id}`);
        setJob(data.job);
    }

    async function deleteJob() {
        await cleangigApi.delete(`jobs/${job.id}`);
        navigation.goBack();
    }

    return <VStack flex={1}>
        <AppBar screenTitle={job ? job.title : 'loading...'} navigation={navigation} backButton/>

        <SafeScrollView flex={1} paddingBottom={20}>
            {job && job.status === 'assigned' && <>
                <AssignedJob job={job} pictures={pictures} navigation={navigation} onDelete={deleteJob} isProvider/>
            </>}

            {job && job.status === 'done' && <ClosedJob id={job.id} pictures={pictures}/>}
        </SafeScrollView>
    </VStack>;
}
