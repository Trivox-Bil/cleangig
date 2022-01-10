import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Image, Input, ListItem, Text } from 'react-native-elements';
import { cleangigApi, sotApi } from "../../../network";
import { formatDate } from "../../../helpers";
import ImageCarousel from "../../../components/ImageCarousel";
import { HStack } from "native-base";
import SafeScrollView from "../../../components/SafeScrollView";
import FetchContent from "../../../components/FetchContent";
import { useSelector } from "react-redux";
import voca from "voca";
import AppBar from "../../../components/AppBar";

export default function ({ route, navigation }) {
    const job = route.params.job;
    // console.log("job ==>>>", route.params)
    const user = useSelector(state => state.user.data);
    const [proposals, setProposals] = useState([]);
    const [proposal, setProposal] = useState('');
    const [price, setPrice] = useState(50);
    const [pictures, setPictures] = useState([]);
    const [sendingProposal, setSendingProposal] = useState(false);

    useEffect(() => {
        let pictures;
        try {
            pictures = JSON.parse(voca.unescapeHtml(job.picture));
        } catch (e) {
            console.error(e);
        }

        setPictures(pictures || []);
    }, []);

    const fetchProposals = async () => {
        const { data: result } = await sotApi.get(`proposals/get_all?job=${job.id}&provider=${user.id}`);
        result.success && setProposals(result.proposals);
    };

    const sendProposal = async () => {
        setSendingProposal(true);
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', user.id);
        formData.append('proposal', proposal);
        formData.append('price', price);
        await sotApi.post(`proposals/create`, formData);
        // console.log('job.customer ===>>>', job.customer)        
        const notificationData = new FormData();
        notificationData.append('provider_id', user.id);
        notificationData.append('job_id', job.id);
        notificationData.append('content', proposal);
        notificationData.append('title', `Nytt prisförslag på "${job.title}"`);
        notificationData.append('type', `proposal`);
        const { data: notification } = await cleangigApi.post(`customers/${job.customer.id}/notification`, notificationData);
        const message = {
            to: job.customer.notification_token,
            sound: 'default',
            title: `Nytt prisförslag på "${job.title}"`,
            body: proposal,
            data: { type: 'proposal', details: { job: job }, notification_id: notification.id },
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
        await fetchProposals();
        setSendingProposal(false);
        setProposal('');
        setPrice('');
    };

    const deleteProposal = async (id) => {
        const formData = new FormData();
        formData.append('id', id);
        await sotApi.post(`proposals/delete`, formData);
        await setProposals([]);
    }

    const archive = async () => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', user.id);
        await sotApi.post(`jobs/archive`, formData);
        navigation.navigate('JobList');
    }

    const unarchive = async () => {
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('provider', user.id);
        await sotApi.post(`jobs/unarchive`, formData);
        navigation.navigate('JobList');
    }

    return <>
        <AppBar screenTitle={job.title} navigation={navigation} backButton />
        <SafeScrollView flex={1}>
            {job && <>
                <Card>
                    <Card.Title>Kund</Card.Title>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={{ uri: job.customer.picture }} style={{ width: 70, height: 70, borderRadius: 35 }} />
                        <View>
                            <Text
                                style={{ fontSize: 18, marginLeft: 10 }}>{job.customer.fname} {job.customer.lname}</Text>
                        </View>
                    </View>
                    <Button
                        title="Chatta med kunden"
                        type="clear"
                        titleStyle={{ color: '#ff7e1a' }}
                        onPress={() => navigation.navigate('Chat', { screen: 'Chat', params: { job } })}
                    />
                </Card>
                <Card>
                    <Card.Title style={{ marginBottom: 10 }}>Publicerat {formatDate(job.created_at)}</Card.Title>
                    <Card.Divider />
                    <Text style={{ marginBottom: 10 }}>{job.description}</Text>
                    <HStack minH={200} ml={5} my={10}>
                        <ImageCarousel images={pictures} />
                    </HStack>
                    <Card.Divider />
                    <Text style={{ opacity: 0.6 }}>{job.street}{job.city ? `, ${job.city}` : ''}, {job.county.name}</Text>
                    <Text style={{ opacity: 0.6 }}>Förfaller den {formatDate(job.deadline)}</Text>
                </Card>

                <Card>
                    <Card.Title>Förslag</Card.Title>
                    <FetchContent fetch={fetchProposals}>
                        {proposals.length > 0 ? proposals.map(offer => (
                            <ListItem
                                key={offer.id}
                                bottomDivider
                                containerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <ListItem.Title>{offer.message}</ListItem.Title>
                                <ListItem.Subtitle>{offer.price}kr</ListItem.Subtitle>
                                <Button
                                    type="clear"
                                    icon={{ type: 'font-awesome', name: 'trash', color: 'red' }}
                                    onPress={() => deleteProposal(offer.id)}
                                />
                            </ListItem>
                        )) : (
                            <>
                                <Input
                                    placeholder="Text"
                                    label="Skicka in förslag på jobb"
                                    value={proposal}
                                    onChangeText={setProposal}
                                    multiline
                                    numberOfLines={4}
                                />
                                <Input
                                    placeholder="Pris"
                                    label="Pris(SEK)"
                                    value={price}
                                    onChangeText={setPrice}
                                    keyboardType="numeric"
                                />
                                <Button title="Skicka förslag" buttonStyle={{ backgroundColor: '#ff7e1a' }}
                                    onPress={sendProposal} loading={sendingProposal} />
                            </>
                        )}
                    </FetchContent>
                </Card>
                {
                    !!job.archived
                        ? <Button
                            type="clear"
                            title="Oarkiverat jobb"
                            titleStyle={{ color: '#ff7e1a' }}
                            containerStyle={{ marginVertical: 50 }}
                            onPress={unarchive}
                        />
                        : <Button
                            type="clear"
                            title="Arkivera jobbet"
                            titleStyle={{ color: '#ff7e1a' }}
                            containerStyle={{ marginVertical: 50 }}
                            onPress={archive}
                        />
                }


            </>}
        </SafeScrollView>
    </>;
}
