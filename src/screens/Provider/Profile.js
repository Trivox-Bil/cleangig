import React, { useState, useEffect } from 'react';
import AppBar from "../../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { Button, Heading, HStack, Image, Pressable, Text, VStack } from "native-base";
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
import PortFolio from '../../components/Portfolio';

export default function ({ navigation }) {
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
    const [isPortfolioRefresh, setIsPortfolioRefresh] = useState(false);

    const dispatch = useDispatch();
    // console.log(user)

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        const { data } = await sotApi.get(`services/get_all?provider=${user.id}`);
        let serviceName = [];
        data.services.map(service => serviceName.push(service.name));
        setOfferedServicesName(serviceName.join(", "))
        setOfferedServices(data.services);
    }

    async function logOut() {
        dispatch({ type: LOGOUT });
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
        let tempOServices = offeredServices.filter(s => s.id !== service.id);
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
        const { data } = await sotApi.post(`providers/update`, formData);

        if (data.success) {
            const { data } = await cleangigApi.get(`providers/${user.id}`);

            dispatch({ type: LOGIN_SUCCESS, payload: data });
            await storeLocal(USER_DATA_KEY, data);
        }
        setSaveIcon('save');
    }

    const openEditPage = () => {
        navigation.push("EditPorfile");
    }

    const openAddPortfolio = () => {
        navigation.push("AddPortfolio", { refreshPage: refreshPortfolio });
    }

    const refreshPortfolio = () => { setIsPortfolioRefresh(!isPortfolioRefresh) }

    const openPortfolioDetailPage = (item) => {
        console.log(item)
        navigation.push("PortfolioDetails", { portFolio: item });
    }

    return <>
        <AppBar navigation={navigation} screenTitle="Profil"
            customOptions={[
                activeTab === 'profile'
                    ? { action: openEditPage, icon: 'edit' }
                    : activeTab === 'portfolio' && { action: openAddPortfolio, icon: 'plus' }
            ]} />

        <HStack mt="3" mx="3" justifyContent="center">
            <Pressable
                style={activeTab === 'profile' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                onPress={() => setActiveTab('profile')}
            >
                <Text
                    style={activeTab === 'profile' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                >Profil</Text>
            </Pressable>
            <Pressable
                style={activeTab === 'review' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                onPress={() => setActiveTab('review')}
            >
                <Text
                    style={activeTab === 'review' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                >Omdömen</Text>
            </Pressable>
            <Pressable
                style={activeTab === 'portfolio' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                onPress={() => setActiveTab('portfolio')}
            >
                <Text
                    style={activeTab === 'portfolio' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                >Tidigare arbeten</Text>
            </Pressable>
        </HStack>

        {activeTab === 'profile' ? (
            <SafeScrollView flex={1}>
                <HStack m={4} justifyContent="center" space={2}>
                    <Pressable onPress={selectPicture}>
                        <Image source={{ uri: picture }} w={100} h={100} rounded="full" alt=" " />
                    </Pressable>
                </HStack>

                <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Namn</Text>
                    <Text>{user.name}</Text>
                </VStack>
                <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Beskrivning</Text>
                    <Text>{user.description}</Text>
                </VStack>
                <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Email</Text>
                    <Text>{user.email}</Text>
                </VStack>
                <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Telefonnummer</Text>
                    <Text>{user.phone_number}</Text>
                </VStack>
                <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Plats</Text>
                    <Text>{county}</Text>
                </VStack>
                <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Tjänster</Text>
                    <Text>{offeredServicesNames}</Text>
                </VStack>

                <VStack mt="5" px="3">
                    <Pressable onPress={logOut}>
                        <Text color="#FC3D3D" fontWeight="semibold"> Logga ut </Text>
                    </Pressable>
                </VStack>
                <VStack style={{ alignItems: 'center', justifyContent: 'center', marginTop: 50 }} >
                    <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
                </VStack>
            </SafeScrollView>
        ) : activeTab === 'review' ? (
            <VStack flex={1} justifyContent="center" alignItems="center">
                <Text style={{ color: colors.gray }}>Inget att visa</Text>
            </VStack>
        ) : (
            <>
                <PortFolio providerId={user.id} refresh={isPortfolioRefresh} openDetailPage={openPortfolioDetailPage}></PortFolio>
            </>
        )}
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