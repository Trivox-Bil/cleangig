import React, { useCallback, useState } from 'react';
import AppBar from "../../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { StyleSheet } from 'react-native'
import { LOGIN_SUCCESS, LOGOUT } from "../../actions/types";
import { storeLocal, USER_DATA_KEY } from "../../storage";
import { resetRoute } from "../../helpers";
import { Button, Heading, HStack, Image, Pressable, Text, VStack } from "native-base";
import counties from "../../data/counties";
import {colors} from '../../helpers';
import HoshiInput from "../../components/HoshiInput";
import * as ImagePicker from 'expo-image-picker';
import lodash from "lodash";
import { cleangigApi } from "../../network";
import SafeScrollView from "../../components/SafeScrollView";
import HoshiSelectControl from "../../components/HoshiSelectControl";
import Constants from 'expo-constants';

export default function ({ navigation }) {
    const user = useSelector(state => state.user.data);
    const [fname, setFname] = useState(user.fname);
    const [lname, setLname] = useState(user.lname);
    const [phone, setPhone] = useState(user.phone_number);
    const [county, setCounty] = useState(user.county);
    const [city, setCity] = useState(user.city);
    const [picture, setPicture] = useState(user.picture);
    const [street, setStreet] = useState(user.street);
    const [postalCode, setPostalCode] = useState(user.postal_code);
    const [activeTab, setActiveTab] = useState('profile');
    const dispatch = useDispatch();

    const isSaved = useCallback(() => {
        return lodash.isEqual(user, { ...user, fname, lname, phone_number: phone, county, city, picture, street, postal_code: postalCode });
    }, [fname, lname, phone, county, city, picture, street, postalCode, user]);

    async function selectPicture() {
        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        !image.cancelled && setPicture(image.uri);
    }

    async function logOut() {
        dispatch({ type: LOGOUT });
        await storeLocal(USER_DATA_KEY, {});
        navigation.dispatch(resetRoute('Login'));
    }

    async function saveAll() {
        const request = { id: user.id, fname, lname, phone_number: phone, county, city, street, postal_code: postalCode };
        const { data } = await cleangigApi.put('customers', request);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
        await storeLocal(USER_DATA_KEY, data);
    }

    const openEditPage = () => {
        navigation.push("EditPorfile");
    }

    return <>
        {<AppBar navigation={navigation} screenTitle="Profil" customOptions={[
            activeTab === 'profile' && { action: openEditPage, icon: 'edit' }
        ]} />}

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
                    <Text>{user.fname} {user.lname}</Text>
                </VStack>
                <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Email</Text>
                    <Text>{user.email}</Text>
                </VStack>
                <VStack px="3" pb="3"  mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Telefonnummer</Text>
                    <Text>{user.phone_number}</Text>
                </VStack>
                <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                    <Text mb={1} fontWeight="semibold" color="#ff7e1a">Adress</Text>
                    <Text>{street}, {city}, {county}, {postalCode}</Text>
                </VStack>

                <VStack mt="5" px="3">
                    <Pressable onPress={logOut}>
                    <Text color="#FC3D3D" fontWeight="semibold"> Logga ut </Text>
                    </Pressable>
                </VStack>
                <VStack style={{ alignItems: 'center', justifyContent: 'center', marginTop: 100 }} >
                    <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
                </VStack>
            </SafeScrollView>
        ) : (
            <VStack flex={1} justifyContent="center" alignItems="center">
                <Text style={{color: colors.gray}}>Inget att visa</Text>
            </VStack>
        )}

        

        {/* <SafeScrollView flex={1}>
            <HStack m={4} space={2}>
                <Pressable onPress={selectPicture}>
                    <Image source={{ uri: picture }} w={100} h={100} rounded="md" alt=" " />
                </Pressable>
                <VStack space={2}>
                    <Heading size="md" isTruncated noOfLines={2} maxWidth="300">{user.fname} {user.lname}</Heading>
                    <Text>{user.email}</Text>
                    <Text>{counties.find(c => c.code === user.county).name}</Text>
                </VStack>
            </HStack>

            <VStack my={4}>
                <HoshiInput value={fname} label="Förnamn" onChangeText={setFname} />
                <HoshiInput value={lname} label="Efternamn" onChangeText={setLname} />
                <HoshiInput value={phone} label="Telefonnummer" onChangeText={setPhone} keyboardType="numeric" />
                <HoshiSelectControl label="Län" selectedValue={county} onValueChange={setCounty}
                    collection={counties.map(c => ({ label: c.name, value: c.code }))} />
                <HoshiSelectControl label="Stad" selectedValue={city} onValueChange={setCity}
                    collection={counties.find(c => c.code === county).cities.map(c => ({ label: c, value: c }))} />
                <HoshiInput value={postalCode} label="Postnummer" onChangeText={setPostalCode} />
                <HoshiInput value={street} label="Gatuadress" onChangeText={setStreet} />
            </VStack>
            <VStack style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }} >
                <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
            </VStack>
        </SafeScrollView> */}
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