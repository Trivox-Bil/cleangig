import React, {useState} from 'react';
import {Button, Center, Flex, HStack, Image, Modal, Pressable, ScrollView, StatusBar, Text, VStack} from "native-base";
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

        <VStack flexGrow={1} >
            <Center flexBasis={Dimensions.get('window').height * .35} bg="brand.400" roundedBottomRight="full"
                    alignItems="flex-start" px={2} shadow={4}>
                <Text fontSize="2xl" color="light.100" bold>Hur kan vi hjälpa dig?</Text>
            </Center>

            <ScrollView flex={1}>
                <HStack flexWrap="wrap">
                    {/* { console.log('services', services) } */}
                    {services.map(service => (
                        <Pressable disabled={service.disabled} opacity={service.disabled ? 0.5 : 1} key={service.id} p={4} bg="dark.700" rounded="md" flexBasis="40%" m={4} flex={1}
                                   alignItems="center" onPress={() => setChosenService(service)}>
                                       {/* { console.log(service.icon) } */}
                            <Image source={service.icon} w={75} h={75} alt=" " resizeMode='contain'/>
                            <Text mt={4} fontSize="md" bold>{service.name}</Text>
                           { service.disabled && <Text mt={2}>Fler tjänster kommer inom kort</Text>}
                        </Pressable>
                    ))}
                </HStack>
            </ScrollView>
        </VStack>

        <Modal isOpen={chosenService !== null} onClose={() => setChosenService(null)} size='xl'>
            {chosenService && (
                <Modal.Content>
                    <Modal.CloseButton/>
                    <Modal.Header _text={{fontSize: '2xl'}} >{chosenService.name}</Modal.Header>
                    <Modal.Body px={6}>
                        {/* <ScrollView horizontal> */}
                            <Text fontSize="md" mb="2" fontWeight="medium" >Exempel på jobb som kan utföras</Text>
                            <Flex direction='column'>
                                {chosenService.description.split('\n').map((item, i) => (
                                    // flexDirection: "row", maxWidth: "100%", flex: 1, flexWrap: 'wrap'
                                    <Flex key={i} direction='row' >
                                        <Text mr={4}>•</Text>
                                        <Text fontSize="md">{item}</Text>
                                    </Flex>
                                ))}
                            </Flex>
                           {chosenService.id == 4 && <Text mt={4}>Fler tjänster kommer inom kort..</Text>}
                        {/* </ScrollView> */}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="ghost" colorScheme="brand" onPress={toNewJob}>Skapa förfrågan</Button>
                    </Modal.Footer>
                </Modal.Content>
            )}
        </Modal>
    </>;
}
