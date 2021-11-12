import React, {useEffect, useState} from 'react';
import {sotApi} from "../../../network";
import AppBar from "../../../components/AppBar";
import {VStack} from "native-base";
import PendingJob from "../../../components/PendingJob";
import UnassignedJob from "../../../components/UnassignedJob";

export default function ({navigation, route}) {
    const [job, setJob] = useState(route.params.job || null);
    const [proposals, setProposals] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!job) {
            const id = route.params.id;
        }
    },[job])

    const fetchProposals = async (id) => {
        const result = await sotApi.get(`proposals/get_all?job=${job.id}`);
        result.success && setProposals(result.proposals);
    };

    const deleteJob = async () => {
        const formData = new FormData();
        formData.append('id', job.id);
        await sotApi.post(`jobs/delete`, formData);
        navigation.goBack();
    }

    return <VStack flex={1}>
        <AppBar screenTitle={job.title} navigation={navigation} backButton/>

        {job.status === 'pending' && <PendingJob id={job.id} navigation={navigation}/>}
        {job.status === 'initial' && <UnassignedJob job={job} navigation={navigation}/>}
    </VStack>;
}
