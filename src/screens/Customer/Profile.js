import React, {useCallback, useState} from 'react';
import AppBar from "../../components/AppBar";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN_SUCCESS, LOGOUT} from "../../actions/types";
import {storeLocal, USER_DATA_KEY} from "../../storage";
import {resetRoute} from "../../helpers";
import {Heading, HStack, Image, Pressable, Text, VStack} from "native-base";
import counties from "../../data/counties";
import HoshiInput from "../../components/HoshiInput";
import * as ImagePicker from 'expo-image-picker';
import lodash from "lodash";
import {cleangigApi} from "../../network";
import SafeScrollView from "../../components/SafeScrollView";
import HoshiSelectControl from "../../components/HoshiSelectControl";
import Constants from 'expo-constants';

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [fname, setFname] = useState(user.fname);
    const [lname, setLname] = useState(user.lname);
    const [phone, setPhone] = useState(user.phone_number);
    const [county, setCounty] = useState(user.county);
    const [city, setCity] = useState(user.city);
    const [picture, setPicture] = useState(user.picture);
    const [street, setStreet] = useState(user.street);
    const [postalCode, setPostalCode] = useState(user.postal_code);
    const dispatch = useDispatch();

    const isSaved = useCallback(() => {
        return lodash.isEqual(user, {...user, fname, lname, phone_number: phone, county, city, picture, street, postal_code: postalCode});
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
        dispatch({type: LOGOUT});
        await storeLocal(USER_DATA_KEY, {});
        navigation.dispatch(resetRoute('Login'));
    }

    async function saveAll() {
        const request = {id: user.id, fname, lname, phone_number: phone, county, city, street, postal_code: postalCode};
        const {data} = await cleangigApi.put('customers', request);
        dispatch({type: LOGIN_SUCCESS, payload: data});
        await storeLocal(USER_DATA_KEY, data);
    }

    return <>
        <AppBar navigation={navigation} screenTitle="Profil" customOptions={[
            isSaved() ? {action: logOut, icon: 'sign-out-alt'} : {action: saveAll, icon: 'save'}
        ]}/>

        <SafeScrollView flex={1}>
            <HStack m={4} space={2}>
                <Pressable onPress={selectPicture}>
                    <Image source={{uri: picture}} w={100} h={100} rounded="md" alt=" "/>
                </Pressable>
                <VStack space={2}>
                    <Heading size="md" isTruncated noOfLines={2} maxWidth="300">{user.fname} {user.lname}</Heading>
                    <Text>{user.email}</Text>
                    <Text>{counties.find(c => c.code === user.county).name}</Text>
                </VStack>
            </HStack>

            <VStack my={4}>
                <HoshiInput value={fname} label="Förnamn" onChangeText={setFname}/>
                <HoshiInput value={lname} label="Efternamn" onChangeText={setLname}/>
                <HoshiInput value={phone} label="Telefonnummer" onChangeText={setPhone} keyboardType="numeric"/>
                <HoshiSelectControl label="Län" selectedValue={county} onValueChange={setCounty}
                                    collection={counties.map(c => ({label: c.name, value: c.code}))}/>
                <HoshiSelectControl label="Stad" selectedValue={city} onValueChange={setCity}
                                    collection={counties.find(c => c.code === county).cities.map(c => ({label: c, value: c}))}/>
                <HoshiInput value={postalCode} label="Postnummer" onChangeText={setPostalCode}/>
                <HoshiInput value={street} label="Gatuadress" onChangeText={setStreet}/>
            </VStack>
            <VStack style={{alignItems: 'center', justifyContent: 'center', marginTop: 30}} >
                <Text fontWeight='bold' >version {Constants.manifest.version}</Text>
            </VStack>
        </SafeScrollView>
    </>;
};
