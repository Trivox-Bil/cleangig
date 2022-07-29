import React, {useEffect, useState} from 'react';
import { Button, Center, Heading, HStack, Text, VStack } from "native-base";
import counties from "../data/counties";
import {CLEANING_TYPES, formatDate, providerCountyName} from "../helpers";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";
import { cleangigApi, sotApi } from "../network";
import FetchContent from "./FetchContent";
import Proposal from "./Proposal";
import {Image} from "react-native";
import {ListItem} from "react-native-elements";

export default function ({ job, onDelete, pictures, navigation }) {
    const [warnDelete, setWarnDelete] = useState(false);
    const [proposals, setProposals] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const fetchProposals = async (id) => {
        const { data: result } = await sotApi.get(`proposals/get_all?job=${job.id}`);
        result.success && setProposals(result.proposals);
    };

    const fetchSuppliers = async (id) => {
        const { data } = await cleangigApi.get(`jobs/${job.id}/suppliers/window_cleaning`);
        setSuppliers(data.suppliers);
    };

    useEffect(function () {
        if (job.cleaning_type == 2) {
            fetchSuppliers();
        }
    }, []);

    const assignJob = async (proposal) => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', proposal.provider.id);
        formData.append('proposal', proposal.id);

        const { data: result } = await sotApi.post(`proposals/approve`, formData);

        job.status = 'assigned';
        if (result.token) {
            const message = {
                to: result.token,
                sound: 'default',
                title: `Nya jobb`,
                body: `En köpare har tilldelat dig ett jobb. Du kan se jobbet på fliken historik.`,
                data: { type: 'assigned-job', details: { job: job } },
            };
            const notificationData = new FormData();
            notificationData.append('customer_id', job.customer.id);
            notificationData.append('job_id', job.id);
            notificationData.append('content', message.body);
            notificationData.append('title', message.title);
            notificationData.append('type', `assigned-job`);
            const { data: notification } = await cleangigApi.post(`providers/${proposal.provider.id}/notification`, notificationData);
            message.data.notification_id = notification.id;
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
            params: { screen: 'Ongoing' },
        });
    }

    return <VStack m={4} space={4}>
        <Heading>{job.title}</Heading>
        <Text color="dark.400">{job.street}, {job.city}, {counties.find(c => c.code === job.county_code).name}</Text>
        <Text color="dark.400">Publicerad ons {formatDate(job.created_at)}</Text>
        {
            job?.service_id === "4" && 
            <Text color="dark.400" style={{ marginBottom: 2 }}>{CLEANING_TYPES[job.cleaning_type]}</Text>
        }
        {
            job?.service_id === "3"
                ? <>
                    <Text style={{ marginBottom: 2 }}>Boka för: {job.book_type === "1" ? "Behållare" : "Byggsäckar"}</Text>
                    <Text style={{ marginBottom: 2 }}>Storlek: {job.size}</Text>
                    <Text style={{ marginBottom: 10 }}>Farligt avfall: {job.dangerous_material === "1" ? "Ja" : "Nej"}</Text>
                </>
                : null
        }
        <Text m={4} borderLeftWidth={2} borderColor="dark.600" p={4}>{job.description}</Text>

        {pictures.length > 0 && (
            <HStack minH={200} ml={5} my={10}>
                <ImageCarousel images={pictures} />
            </HStack>
        )}

        <FetchContent fetch={fetchProposals}>
            <VStack>
                <Heading size="sm">Prisförslag på jobbet</Heading>
                {proposals.map(proposal =>
                    <Proposal navigation={navigation} job={job} proposal={proposal} onAssign={assignJob} />)}
                {proposals.length > 0 || (
                    <Center>
                        <Text style={{ fontSize: 18, textAlign: 'center', color: '#555' }}>Inga förslag ännu</Text>
                    </Center>
                )}
            </VStack>
        </FetchContent>

        {suppliers.length > 0 && <>
            <VStack>
                <Heading size="sm">Tillgängliga leverantörer</Heading>
                {suppliers.map(supplier => {
                    return <ListItem key={supplier.provider_id}
                                     onPress={() => navigation.push('ProviderProfile', {provider: supplier.provider_id})}>
                        <Image
                            source={{uri: supplier.picture}}
                            style={{width: 50, height: 50, borderRadius: 25, marginHorizontal: 10}}/>
                        <ListItem.Content>
                            <ListItem.Title>{supplier.name}</ListItem.Title>
                            <ListItem.Subtitle>Kosta: {supplier.rate * job.item_count}</ListItem.Subtitle>
                        </ListItem.Content>
                    </ListItem>;
                })}
            </VStack>
        </>}

        <Button colorScheme="red" onPress={() => setWarnDelete(true)} my={4}>Ta bort jobb</Button>
        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
            message="Är du säker att du vill radera" />
    </VStack>;
}
