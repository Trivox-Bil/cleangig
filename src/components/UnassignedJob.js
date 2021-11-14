import React, {useState} from 'react';
import {Button, Heading, HStack, Text, VStack} from "native-base";
import counties from "../data/counties";
import {formatDate} from "../helpers";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";

export default function ({job, onDelete, pictures, navigation}) {
    const [warnDelete, setWarnDelete] = useState(false);

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

        <Button colorScheme="red" onPress={() => setWarnDelete(true)} my={4}>Ta bort jobb</Button>
        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </VStack>;
}
