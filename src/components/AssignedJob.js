import React, {useState} from 'react';
import {Button, Heading, HStack, Text, VStack} from "native-base";
import counties from "../data/counties";
import {formatDate} from "../helpers";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";
import FetchContent from "./FetchContent";
import { Card } from 'react-native-elements';
import { useSelector } from "react-redux";
import { sotApi } from "../network";

export default function ({job, onDelete, pictures, navigation, isProvider = false}) {
    const user = useSelector(state => state.user.data);
    const [warnDelete, setWarnDelete] = useState(false);
    const [proposals, setProposals] = useState([]);

    function goToChat() {
        if (isProvider) {
            navigation.navigate('Chat', { screen: 'Chat', params: { job } })
        } else {
            navigation.navigate('ChatMain', {screen: 'Chat', params: {job}});
        }
    }

    function goToProvider() {
        navigation.navigate('Browse', {screen: 'ProviderProfile', params: {provider: job.provider.id}});
    }

    function goToCustomer() {
        navigation.navigate('customer', {customer: job.customer_id});
    }

    const fetchProposals = async () => {
        const { data: result } = await sotApi.get(`proposals/get_all?job=${job.id}&provider=${user.id}`);
        result.success && setProposals(result.proposals);
    };

    return <VStack m={4} space={4}>
        <Heading>{job.title}</Heading>
        <Text color="dark.400">{job.street}, {job.city}, {counties.find(c => c.code === job.county_code).name}</Text>
        <Text color="dark.400">Publicerad ons {formatDate(job.created_at)}</Text>
        <Text color="dark.400">Deadline {formatDate(job.deadline)}</Text>
        <Text m={4} borderLeftWidth={2} borderColor="dark.600" p={4}>{job.description}</Text>
        {/* {console.log("pictures ===>>>", pictures)} */}
        {pictures.length > 0 && (
            <HStack minH={200} ml={5} my={10}>
                <ImageCarousel images={pictures}/>
            </HStack>
        )}

        <HStack space={4} justifyContent="center" flexWrap="wrap">
            <Button variant="link" onPress={goToChat}>Chatt</Button>
            {!isProvider && <Button variant="link" onPress={goToProvider}>Leverantör</Button>}
            {isProvider && <Button variant="link" onPress={goToCustomer}>Kund</Button>}
            {!isProvider && <Button variant="link" colorScheme="dark" onPress={() => setWarnDelete(true)}>
                Radera
            </Button>}
            {isProvider && <Button variant="link" onPress={() => navigation.navigate('CloseJob', {job})}>
                Fakturera färdigt arbete
            </Button>}
        </HStack>

        { isProvider && <>
            <Card>
                    <Card.Title>Proposa</Card.Title>
                    <FetchContent fetch={fetchProposals}>
                        {proposals.length > 0 && proposals.map(offer => (
                            <HStack key={offer.id}>
                                <Text flex={1} mr="2">{offer.message}</Text>
                                <Text flex={1} textAlign="center">{offer.price}kr</Text>
                            </HStack>
                        ))}
                    </FetchContent>
                </Card>
        </> }

        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </VStack>;
}
