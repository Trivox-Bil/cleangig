import React, {useState} from 'react';
import {Button, Center, HStack, Image, Modal, Pressable, ScrollView, StatusBar, Text, VStack} from "native-base";
import services from "../../../data/services";
import {Dimensions} from "react-native";

export default function ({navigation}) {
    const [chosenService, setChosenService] = useState(null);

    function toNewJob() {
        navigation.navigate('NewJob', {service: chosenService});
        setChosenService(null);
    }

    return <>
        <StatusBar backgroundColor="#ff7e1a"/>

        <VStack flexGrow={1} bg="dark.400">
            <Center flexBasis={Dimensions.get('window').height * .35} bg="brand.400" roundedBottomRight="full"
                    alignItems="flex-start" px={2} shadow={4}>
                <Text fontSize="2xl" color="light.100" bold>Hur kan vi hjälpa dig?</Text>
            </Center>

            <ScrollView flex={1}>
                <HStack flexWrap="wrap">
                    {services.map(service => (
                        <Pressable key={service.id} p={4} bg="dark.700" rounded="md" flexBasis="40%" m={4} flex={1}
                                   alignItems="center" onPress={() => setChosenService(service)}>
                            <Image source={service.icon} w={75} h={75} alt=" "/>
                            <Text mt={4} fontSize="md" bold>{service.name}</Text>
                        </Pressable>
                    ))}
                </HStack>
            </ScrollView>
        </VStack>

        <Modal isOpen={chosenService !== null} onClose={() => setChosenService(null)}>
            {chosenService && (
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header>{chosenService.name}</Modal.Header>
                    <Modal.Body>
                        <ScrollView horizontal>
                            <VStack>
                                {chosenService.description.split('\n').map((item, i) => (
                                    <HStack key={i}>
                                        <Text mx={4}>•</Text>
                                        <Text>{item}</Text>
                                    </HStack>
                                ))}
                            </VStack>
                        </ScrollView>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" colorScheme="brand" onPress={toNewJob}>Lägg till jobb</Button>
                    </Modal.Footer>
                </Modal.Content>
            )}
        </Modal>
    </>;
}
