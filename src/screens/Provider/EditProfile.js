import React, { useState, useEffect } from 'react';
import AppBar from "../../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { Image } from "react-native";
import {
    Button,
    Heading,
    HStack,
    Pressable,
    Text,
    VStack,
    Radio,
    Center,
    Modal,
    FormControl,
    Box,
    Stack, Input, IconButton
} from "native-base";
import counties from "../../data/counties";
import { logOut } from "../../actions/user";
import * as ImagePicker from 'expo-image-picker';
import { cleangigApi, sotApi } from "../../network";
import { LOGIN_SUCCESS, LOGOUT } from "../../actions/types";
import { storeLocal, USER_DATA_KEY } from "../../storage";
import HoshiInput from "../../components/HoshiInput";
import SafeScrollView from "../../components/SafeScrollView";
import { ListItem } from "react-native-elements";
import services from "../../data/services";
import FetchContent from "../../components/FetchContent";
import { resetRoute } from "../../helpers";
import Constants from 'expo-constants';
import HoshiMultiSelectControl from '../../components/HoshiMultiSelectControl';
import { StyleSheet } from 'react-native'
import { colors } from '../../helpers';
import mime from "mime";
import {MaterialIcons} from "@expo/vector-icons";

export default function ({ navigation }) {
    const user = useSelector(state => state.user.data);
    const [businessName, setBusinessName] = useState(user.name);
    const [contactName] = useState(user.contact);
    const [phone, setPhone] = useState(user.phone);
    const [county, setCounty] = useState(user?.county_code ? user.county_code.split(",") : []);
    const [description, setDescription] = useState(user.description);
    const [website, setWebsite] = useState(user.website);
    const [picture, setPicture] = useState(user.picture);
    const [paidOption, setPaidOption] = useState(user.paid_option);
    const [jobFrom, setJobFrom] = useState(user.job_from);
    const [offeredServices, setOfferedServices] = useState([]);
    const [addedServices, setAddedServices] = useState([]);
    const [removedServices, setRemovedServices] = useState([]);
    const [wcModalVisible, setWcModalVisible] = useState(false);
    const [pricePerWindow, setPricePerWindow] = React.useState('10');
    const [offeredServicesNames, setOfferedServicesName] = useState('');
    const [saveIcon, setSaveIcon] = useState('save');
    const [activeTab, setActiveTab] = useState('profile');
    const dispatch = useDispatch();
    const [pictureData, setPictureData] = useState(null);
    // console.log(user)

    useEffect(() => {
        fetchProviderServices();
    }, []);

    async function fetchProviderServices() {
        const { data } = await cleangigApi.get(`providers/${user.id}/services`);
        setOfferedServices(data.services.map(s => ({...s, service: services.find(it => it.id === s.service_id)})));
    }

    /*async function fetchServices() {
        const { data } = await sotApi.get(`services/get_all?provider=${user.id}`);
        let serviceName = [];
        data.services.map(service => serviceName.push(service.name));
        setOfferedServicesName(serviceName.join(", "))
        setOfferedServices(data.services);
    }*/

    async function logOut() {
        dispatch({ type: LOGOUT });
        await storeLocal(USER_DATA_KEY, {});
        navigation.dispatch(resetRoute('Login'));
    }

    async function selectPicture() {
        const image = await askForPicture();
        if (!image.cancelled) {
            setPicture(image.uri);
            setPictureData({
                uri: image.uri,
                name: `${new Date().getTime()}.JPG`,
                type: mime.getType(image.uri),
            });
        }
    }

    function askForPicture() {
        return ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
    }

    async function addService(type, id) {
        if (pricePerWindow.length === 0 || isNaN(pricePerWindow)) {
            alert("Ange ett giltigt nummer");
        } else {
            setWcModalVisible(false);
            const formdata = new FormData();
            formdata.append('service', id);
            formdata.append('type', type);
            formdata.append('rate', pricePerWindow);
            await cleangigApi.post(`providers/${user.id}/services`, formdata);
            await fetchProviderServices();
        }
    }

    async function removeService(type) {
        await cleangigApi.delete(`providers/${user.id}/services/${type}`);
        await fetchProviderServices();
    }

    /*function deleteService(service) {
        let tempOServices = offeredServices.filter(s => s.id !== service.id);
        setOfferedServices(tempOServices);
        setRemovedServices([...removedServices, service]);
    }

    function addService(id) {
        if (!addedServices.some(s => s.id === id)) {
            setAddedServices([...addedServices, services.find(s => s.id === id)]);
        }
    }*/

    async function saveAll() {
        setSaveIcon('circle-notch');
        const pics = pictureData === null ? null : await uploadPictures();
        const formData = new FormData();
        formData.append('id', user.id);
        formData.append('name', businessName);
        formData.append('county_code', county.join());
        formData.append('phone', phone);
        formData.append('description', description);
        formData.append('picture', pics);
        formData.append('website', website);
        formData.append('paid_option', paidOption);
        formData.append('job_from', jobFrom);
        formData.append('services', JSON.stringify({
            add: addedServices.map(s => [s.id]),
            remove: removedServices.map(s => s.id),
        }));
        console.log(formData);
        const { data } = await sotApi.post(`providers/update`, formData);
        console.log(data);
        if (data.success) {
            const { data } = await cleangigApi.get(`providers/${user.id}`);

            dispatch({ type: LOGIN_SUCCESS, payload: data });
            await storeLocal(USER_DATA_KEY, data);
            navigation.goBack();
        }
        setSaveIcon('save');
    }

    async function uploadPictures() {
        const request = new FormData();
        request.append("files[]", pictureData);
        const { data } = await cleangigApi.post("files", request);
        return data?.files && data?.files.length > 0 ? data.files[0] : null;
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
                    <Image source={{ uri: picture }} style={{ width: 100, height: 100, borderRadius: 50 }} alt=" " />
                </Pressable>
            </HStack>

            <VStack my={4}>
                <HoshiInput value={businessName} label="Förnamn" onChangeText={setBusinessName} />
                <HoshiInput value={phone} label="Telefonnummer" onChangeText={setPhone} keyboardType="numeric" />
                <HoshiInput value={website} label="Hemsida" onChangeText={setWebsite} />
                <HoshiInput value={description} label="Företagsbeskrivning" onChangeText={setDescription} multiline
                    height={100} />
                <HoshiMultiSelectControl label="Plats" searchPlaceholderText="Sök"
                confirmText="Välj" selectedValue={county} onValueChange={setCounty}
                    collection={counties.map(c => ({ id: c.code, name: c.name, value: c.code }))} />

            </VStack>



            {/*<FetchContent fetch={fetchServices}>
                <VStack>
                    <Heading size="sm">Tjänster</Heading>
                    <VStack style={{ marginVertical: 10 }}>
                        {offeredServices
                            .filter(s => !removedServices.find(r => r.id === s.id))
                            .map(service => (
                                <ListItem key={service.id} bottomDivider>
                                    <Text style={{ flex: 1 }}>{service.name}</Text>
                                    <Button variant="ghost" colorScheme="brand" onPress={() => deleteService(service)}>
                                        Radera
                                    </Button>
                                </ListItem>
                            ))
                        }
                        {addedServices.map(service => (
                            <ListItem key={service.id} bottomDivider>
                                <Text style={{ flex: 1 }}>{service.name}</Text>
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
                            <ListItem key={service.id} containerStyle={{ justifyContent: 'space-between', padding: 8 }}>
                                <Text style={{ flex: 1 }}>{service.name}</Text>
                                <Button variant="ghost" colorScheme="brand" onPress={() => addService(service.id)}>
                                    Lägg till
                                </Button>
                            </ListItem>
                        ))
                    }
                </VStack>
            </FetchContent>*/}

            <VStack mt={5}>
                <Heading size="sm">Tjänster</Heading>
                {offeredServices.length > 0 && (
                    <HStack pl={2} space={3}>
                        {offeredServices.map(o => {
                            return <HStack key={o.service_id } pl={2} minW={70} minH={30} bg="dark.700" rounded="lg" alignItems="center">
                                <Text>{o.service.name}</Text>
                                <IconButton size="sm" variant="ghost" _icon={{as: MaterialIcons, name: "close"}}
                                    onPress={() => removeService(o.service_type)}/>
                            </HStack>
                        })}
                    </HStack>
                )}

                <VStack bgColor="dark.700" p={2} m={2} rounded="md">
                    <Heading size="xs">Choose a service</Heading>
                    <HStack space={2}>
                        <Button variant="outline" onPress={() => setWcModalVisible(true)}>Städning (fönsterputsning)</Button>
                    </HStack>
                </VStack>
            </VStack>

            <VStack mt={5}>
                <Heading size="sm">Hur vill du få betalt</Heading>
                <Radio.Group name="paidOption" value={paidOption} onChange={nextValue => {
                    setPaidOption(nextValue);
                }}>
                    <Radio value="invoice" my={1} >
                        Invoice
                    </Radio>
                    <Radio value="swish" my={1}>
                        Swish
                    </Radio>
                </Radio.Group>
            </VStack>
            <VStack mt={5}>
                <Heading size="sm">från vem vill du se jobb?</Heading>
                <Radio.Group name="jobFrom" value={jobFrom} onChange={nextValue => {
                    setJobFrom(nextValue);
                }}>
                    <Radio value="1" my={1}>
                        både
                    </Radio>
                    <Radio value="2" my={1}>
                        privat
                    </Radio>
                    <Radio value="3" my={1} >
                        företag
                    </Radio>
                </Radio.Group>
            </VStack>

            <VStack style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }} >
                <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
            </VStack>

            <Modal isOpen={wcModalVisible} onClose={setWcModalVisible}>
                <Modal.Content>
                    <Modal.CloseButton />
                    <Modal.Header>Fönsterputsning</Modal.Header>
                    <Modal.Body>
                        <Box alignItems="center">
                            <Box w="100%" maxWidth="300px">
                                <FormControl isRequired>
                                    <Stack mx="4">
                                        <FormControl.Label>Pris per fönster</FormControl.Label>
                                        <Input value={pricePerWindow} onChangeText={setPricePerWindow}/>
                                    </Stack>
                                </FormControl>
                            </Box>
                        </Box>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button.Group space={2}>
                            <Button variant="ghost" colorScheme="blueGray"
                                    onPress={() => setWcModalVisible(false)}>
                                Avbryt
                            </Button>
                            <Button onPress={async () => await addService('window_cleaning', 4)}>Lägg till</Button>
                        </Button.Group>
                    </Modal.Footer>
                </Modal.Content>
            </Modal>
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