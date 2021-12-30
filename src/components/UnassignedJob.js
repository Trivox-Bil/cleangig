import React, {useState} from 'react';
import {Button, Center, Heading, HStack, Text, VStack} from "native-base";
import counties from "../data/counties";
import {formatDate} from "../helpers";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";
import {sotApi} from "../network";
import FetchContent from "./FetchContent";
import Proposal from "./Proposal";

export default function ({job, onDelete, pictures, navigation}) {
    const [warnDelete, setWarnDelete] = useState(false);
    const [proposals, setProposals] = useState([]);

    const fetchProposals = async (id) => {
        const {data: result} = await sotApi.get(`proposals/get_all?job=${job.id}`);
        result.success && setProposals(result.proposals);
    };

    const assignJob = async (proposal) => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', proposal.provider.id);
        formData.append('proposal', proposal.id);
        console.log(formData)
        const { data: result } = await sotApi.post(`proposals/approve`, formData);
        console.log(result);
        job.status='assigned';
        if (result.token) {
            const message = {
                to: result.token,
                sound: 'default',
                title: `Nya jobb`,
                body: `En köpare har tilldelat dig ett jobb. Du kan se jobbet på fliken historik.`,
                data: {type: 'assigned-job', details: {job: job}},
            };
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(message),
            });
        }
        navigation.goBack();
    }

    const assignDirect = async (provider) => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', provider);
        await sotApi.post(`jobs/assign-direct`, formData);
        navigation.replace('CustomerTab', {
            screen: 'History',
            params: {screen: 'Ongoing'},
        });
    }

    return <VStack m={4} space={4}>
        <Heading>{job.title}</Heading>
        <Text color="dark.400">{job.street}, {job.city}, {counties.find(c => c.code === job.county_code).name}</Text>
        <Text color="dark.400">Publicerad ons {formatDate(job.created_at)}</Text>
        <Text m={4} borderLeftWidth={2} borderColor="dark.600" p={4}>{job.description}</Text>

        {pictures.length > 0 && (
            <HStack minH={200} ml={5} my={10}>
                <ImageCarousel images={pictures}/>
            </HStack>
        )}

        <FetchContent fetch={fetchProposals}>
            <VStack>
                <Heading size="sm">Prisförslag på jobbet</Heading>
                {proposals.map(proposal =>
                    <Proposal navigation={navigation} job={job} proposal={proposal} onAssign={assignJob}/>)}
                {proposals.length > 0 || (
                    <Center>
                        <Text style={{fontSize: 18, textAlign: 'center', color: '#555'}}>Inga förslag ännu</Text>
                    </Center>
                )}
            </VStack>
        </FetchContent>

        <Button colorScheme="red" onPress={() => setWarnDelete(true)} my={4}>Ta bort jobb</Button>
        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </VStack>;
}
