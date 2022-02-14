import React, {useState, useEffect} from 'react';
import AppBar from "../../components/AppBar";
import {useDispatch, useSelector} from "react-redux";
import {Button, Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import counties from "../../data/counties";
import {logOut} from "../../actions/user";
import * as ImagePicker from 'expo-image-picker';
import {cleangigApi, sotApi} from "../../network";
import {LOGIN_SUCCESS, LOGOUT} from "../../actions/types";
import {storeLocal, USER_DATA_KEY} from "../../storage";
import HoshiInput from "../../components/HoshiInput";
import SafeScrollView from "../../components/SafeScrollView";
import {ListItem} from "react-native-elements";
import services from "../../data/services";
import FetchContent from "../../components/FetchContent";
import {resetRoute} from "../../helpers";
import Constants from 'expo-constants';
import HoshiMultiSelectControl from '../../components/HoshiMultiSelectControl';
import { StyleSheet } from 'react-native'
import {colors} from '../../helpers';

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [businessName, setBusinessName] = useState(user.name);
    const [contactName] = useState(user.contact);
    const [phone, setPhone] = useState(user.phone_number);
    const [county, setCounty] = useState(user.county_code.split(","));
    const [description, setDescription] = useState(user.description);
    const [picture, setPicture] = useState(user.picture);
    const [offeredServices, setOfferedServices] = useState([]);
    const [addedServices, setAddedServices] = useState([]);
    const [removedServices, setRemovedServices] = useState([]);
    const [offeredServicesNames, setOfferedServicesName] = useState('');
    const [saveIcon, setSaveIcon] = useState('save');
    const [activeTab, setActiveTab] = useState('profile');
    const dispatch = useDispatch();
    // console.log(user)

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const {data} = await sotApi.get(`services/get_all?provider=${user.id}`);
        let serviceName = [];
        data.services.map(service => serviceName.push(service.name));
        setOfferedServicesName(serviceName.join(", "))
        setOfferedServices(data.services);
    }

    async function logOut() {
        dispatch({type: LOGOUT});
        await storeLocal(USER_DATA_KEY, {});
        navigation.dispatch(resetRoute('Login'));
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
        let tempOServices = offeredServices.filter(s => s.id !==  service.id);
        setOfferedServices(tempOServices);
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
        formData.append('county_code', county.join());
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

    const openEditPage = () => {
        navigation.push("EditPorfile");
    }

    return <>
       {<AppBar backButton navigation={navigation} screenTitle="Edit Profile" customOptions={[
           { action: saveAll, icon: 'save' }
        ]} />}

            <SafeScrollView flex={1}>
                <HStack m={4} justifyContent="center" space={2}>
                    <Pressable onPress={selectPicture}>
                        <Image source={{ uri: picture }} w={100} h={100} rounded="full" alt=" " />
                    </Pressable>
                </HStack>

            <VStack my={4}>
                <HoshiInput value={businessName} label="Förnamn" onChangeText={setBusinessName}/>
                <HoshiInput value={phone} label="Telefonnummer" onChangeText={setPhone} keyboardType="numeric"/>
                <HoshiInput value={description} label="Företagsbeskrivning" onChangeText={setDescription} multiline
                            height={100}/>
                <HoshiMultiSelectControl label="Plats" selectedValue={county} onValueChange={setCounty}
                                    collection={counties.map(c => ({id: c.code, name: c.name, value: c.code}))}/>

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
            <VStack style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}} >
                <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
            </VStack>
        </SafeScrollView> 
    </>;
};

const styles = StyleSheet.create({
    tabs: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    activeTab: {
        backgroundColor: '#ff7e1a',
        borderRadius: 6,
    },
    tabTitle: {
        fontSize: 16,
        fontWeight: "600"
    },
    activeTabTitle: {
        color: "#ffffff"
    }
})