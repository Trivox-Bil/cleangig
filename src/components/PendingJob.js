import React, {useState} from 'react';
import {Button, Center, Heading, HStack, Text} from "native-base";
import {cleangigApi} from "../network";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from '../components/WarningDialog';
import counties from "../data/counties";
import {formatDate} from "../helpers";

export default function ({id, navigation, onDelete, pictures}) {
    const [warnDelete, setWarnDelete] = useState(false);

    return <Center p={4}>
        <Heading my={4}>Väntar Godkännande</Heading>
        <Text>Du kan inte se eller göra ändringar i det här jobbet än. Det granskas av CleanGig.</Text>
        {pictures.length > 0 && (
            <HStack minH={200} mx={1} my={10}>
                <ImageCarousel images={pictures}/>
            </HStack>
        )}

        <Button colorScheme="red" onPress={() => setWarnDelete(true)} my={4}>Ta bort jobb</Button>
        <WarningDialog isVisible={warnDelete}action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </Center>;
}
