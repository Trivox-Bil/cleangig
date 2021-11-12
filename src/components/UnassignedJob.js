import React from 'react';
import {Button, Heading, Text, VStack} from "native-base";
import {cleangigApi} from "../network";
import counties from "../data/counties";
import {formatDate} from "../helpers";

export default function ({job, navigation}) {
    async function deleteJob() {
        await cleangigApi.delete(`jobs/${job.id}`);
        navigation.goBack();
    }

    return <VStack m={4} space={4}>
        <Heading>{job.title}</Heading>
        <Text color="dark.400">{job.street}, {job.city}, {counties.find(c => c.code === job.county_code).name}</Text>
        <Text color="dark.400">Publicerad ons {formatDate(job.created_at)}</Text>
        <Text m={4} borderLeftWidth={2} borderColor="dark.600" p={4}>{job.description}</Text>

        <Button colorScheme="red" onPress={deleteJob} my={4}>Ta bort jobb</Button>
    </VStack>;
}
