import React, {useCallback, useState} from 'react';
import AppBar from "../../components/AppBar";
import {useDispatch, useSelector} from "react-redux";
import {Button, Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import counties from "../../data/counties";
import {logOut} from "../../actions/user";
import {isEqual} from "lodash";
import * as ImagePicker from 'expo-image-picker';
import {cleangigApi, sotApi} from "../../network";
import {LOGIN_SUCCESS} from "../../actions/types";
import {storeLocal, USER_DATA_KEY} from "../../storage";
import HoshiInput from "../../components/HoshiInput";
import SafeScrollView from "../../components/SafeScrollView";
import HoshiSelectControl from "../../components/HoshiSelectControl";
import {ListItem} from "react-native-elements";
import services from "../../data/services";
import FetchContent from "../../components/FetchContent";

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [businessName, setBusinessName] = useState(user.name);
    const [contactName] = useState(user.contact);
    const [phone, setPhone] = useState(user.phone_number);
    const [county, setCounty] = useState(user.county_code);
    const [description, setDescription] = useState(user.description);
    const [picture, setPicture] = useState(user.picture);
    const [offeredServices, setOfferedServices] = useState([]);
    const [addedServices, setAddedServices] = useState([]);
    const [removedServices, setRemovedServices] = useState([]);
    const [saveIcon, setSaveIcon] = useState('save');
    const dispatch = useDispatch();

    async function fetchServices() {
        const {data} = await sotApi.get(`services/get_all?provider=${user.id}`);
        setOfferedServices(data.services);
    }

    async function selectPicture() {
        const image = await askForPicture();
        !image.cancelled && setPicture(image.uri);
    }

    function askForPicture() {
        return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    }

    function deleteService(service) {
        setRemovedServices([...removedServices, service]);
    }

    function addService(id) {
        if (!addedServices.some(s => s.id === id)) {
            setAddedServices([...addedServices, services.find(s => s.id === id)]);
        }
    }

    async function saveAll() {
        setSaveIcon('circle-notch');
        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('name', businessName);
        formData.append('county_code', county);
        formData.append('phone_number', phone);
        formData.append('description', description);
        formData.append('services', JSON.stringify({
            add: addedServices.map(s => [s.id]),
            remove: removedServices.map(s => s.id),
        }));

        const {data} = await sotApi.post(`providers/update`, formData);

        if (data.success) {
            const {data} = await cleangigApi.get(`providers/${user.id}`);

            dispatch({type: LOGIN_SUCCESS, payload: data});
            await storeLocal(USER_DATA_KEY, data);
        }
        setSaveIcon('save');
    }

    return <>
        <AppBar navigation={navigation} screenTitle="Profil"
                customOptions={[
                    {action: saveAll, icon: saveIcon},
                    {action: () => logOut(navigation), icon: 'sign-out-alt'},
                ]}/>

        <SafeScrollView flex={1}>
            <HStack m={4} space={2}>
                <Pressable onPress={selectPicture}>
                    <Image source={{uri: picture}} w={100} h={100} rounded="md" alt=" "/>
                </Pressable>
                <VStack space={2}>
                    <Heading size="md" isTruncated noOfLines={2} maxWidth="300">{user.name}</Heading>
                    <Text>{user.contact}</Text>
                    <Text>{user.email}</Text>
                </VStack>
            </HStack>

            <VStack my={4}>
                <HoshiInput value={businessName} label="Förnamn" onChangeText={setBusinessName}/>
                <HoshiInput value={phone} label="Telefonnummer" onChangeText={setPhone} keyboardType="numeric"/>
                <HoshiInput value={description} label="Företagsbeskrivning" onChangeText={setDescription} multiline height={100}/>
                <HoshiSelectControl label="Plats" selectedValue={county} onValueChange={setCounty}
                                    collection={counties.map(c => ({label: c.name, value: c.code}))}/>
            </VStack>

            <FetchContent fetch={fetchServices}>
                <VStack>
                    <Heading size="sm">Tjänster</Heading>
                    <VStack style={{marginVertical: 10}}>
                        {offeredServices
                            .filter(s => !removedServices.find(r => r.id === s.id))
                            .map(service => (
                                <ListItem key={service.id} bottomDivider>
                                    <Text style={{flex: 1}}>{service.name}</Text>
                                    <Button variant="ghost" colorScheme="brand" onPress={() => deleteService(service)}>
                                        Radera
                                    </Button>
                                </ListItem>
                            ))
                        }
                        {addedServices.map(service => (
                            <ListItem key={service.id} bottomDivider>
                                <Text style={{flex: 1}}>{service.name}</Text>
                                <Button variant="ghost" colorScheme="brand"
                                        onPress={() => setAddedServices([...addedServices].filter(s => s.id !== service.id))}>
                                    Radera
                                </Button>
                            </ListItem>
                        ))}
                    </VStack>
                    {services
                        .filter(as => {
                            return offeredServices.concat(addedServices).findIndex(s => s.id === as.id) < 0
                                || removedServices.findIndex(s => s.id === as.id) > 0
                        })
                        .map(service => (
                            <ListItem key={service.id} containerStyle={{justifyContent: 'space-between', padding: 8}}>
                                <Text style={{flex: 1}}>{service.name}</Text>
                                <Button variant="ghost" colorScheme="brand" onPress={() => addService(service.id)}>
                                    Lägg till
                                </Button>
                            </ListItem>
                        ))
                    }
                </VStack>
            </FetchContent>
        </SafeScrollView>
    </>;
};
