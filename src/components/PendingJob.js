import React from 'react';
import {Button, Center, Heading, Text} from "native-base";
import {cleangigApi} from "../network";

export default function ({id, navigation}) {
    async function deleteJob() {
        await cleangigApi.delete(`jobs/${id}`);
        navigation.goBack();
    }

    return <Center p={4}>
        <Heading my={4}>Väntar Godkännande</Heading>
        <Text>Du kan inte se eller göra ändringar i det här jobbet än. Det granskas av CleanGig.</Text>
        <Button colorScheme="red" onPress={deleteJob} my={4}>Ta bort jobb</Button>
    </Center>;
}
