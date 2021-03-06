import React, {useState} from 'react';
import {Button, Center, Heading, HStack, Text} from "native-base";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";

export default function ({navigation, onDelete, pictures, job, isNew = false}) {
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
        {isNew && <Button onPress={() => navigation.navigate('Services')} my={4} _text={{color: '#fff'}}>Gå till hemsidan</Button>}
        <WarningDialog isVisible={warnDelete} action={onDelete} onCancel={() => setWarnDelete(false)}
                       message="Är du säker att du vill radera"/>
    </Center>;
}
