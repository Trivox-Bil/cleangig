import React, {useState} from 'react';
import {Button, Center, Heading, HStack, Text} from "native-base";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";

export default function ({onDelete, pictures, job}) {
    const [warnDelete, setWarnDelete] = useState(false);

    return <Center p={4}>
        <Heading my={4}>Väntar på godkännande för</Heading>
        <Heading my={4}>{job?.title}</Heading>
        <Text>Du kan inte se eller göra ändringar i det här jobbet än. Det granskas av CleanGig.</Text>
        {pictures.length > 0 && (
            <HStack minH={200} mx={1} my={10}>
                <ImageCarousel images={pictures}/>
            </HStack>
        )}

        <Button colorScheme="red" onPress={() => setWarnDelete(true)} my={4}>Ta bort jobb</Button>
        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </Center>;
}
