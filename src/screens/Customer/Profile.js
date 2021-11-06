import React, {useCallback, useState} from 'react';
import AppBar from "../../components/AppBar";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN, LOGIN_SUCCESS, LOGOUT} from "../../actions/types";
import {storeLocal, USER_DATA_KEY} from "../../storage";
import {resetRoute} from "../../helpers";
import {Divider, Heading, HStack, Image, Pressable, Select, Text, VStack} from "native-base";
import counties from "../../data/counties";
import HoshiInput from "../../components/HoshiInput";
import * as ImagePicker from 'expo-image-picker';
import lodash from "lodash";
import {cleangigApi} from "../../network";

export default function ({navigation}) {
    const user = useSelector(state => state.user.data);
    const [fname, setFname] = useState(user.fname);
    const [lname, setLname] = useState(user.lname);
    const [phone, setPhone] = useState(user.phone_number);
    const [county, setCounty] = useState(user.county);
    const [city, setCity] = useState(user.city);
    const [picture, setPicture] = useState(user.picture);
    const [street, setStreet] = useState(user.street);
    const dispatch = useDispatch();

    const isSaved = useCallback(() => {
        return lodash.isEqual(user, {...user, fname, lname, phone_number: phone, county, city, picture, street});
    }, [fname, lname, phone, county, city, picture, street, user]);

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
        const request = {id: user.id, fname, lname, phone_number: phone, county, city, street};
        const {data} = await cleangigApi.put('customers', request);
        dispatch({type: LOGIN_SUCCESS, payload: data});
        await storeLocal(USER_DATA_KEY, data);
    }

    return <>
        <AppBar navigation={navigation} screenTitle="Profil" customOptions={[
            isSaved() ? {action: logOut, icon: 'sign-out-alt'} : {action: saveAll, icon: 'save'}
        ]}/>

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
        </VStack>

        <VStack my={4}>
            <SelectControl label="Län" selectedValue={county} onValueChange={setCounty}
                           collection={counties.map(c => ({label: c.name, value: c.code}))}/>
            <SelectControl label="Stad" selectedValue={city} onValueChange={setCity}
                           collection={counties.find(c => c.code === county).cities.map(c => ({label: c, value: c}))}/>
            <HoshiInput value={street} label="Gatuadress" onChangeText={setStreet}/>
        </VStack>
    </>;
};

function SelectControl({label, collection, ...selectProps}) {
    return <>
        <VStack px={4} borderColor="brand.400" borderBottomWidth={3}>
            <Text color="dark.400" fontSize="md" fontWeight={200}>{label}</Text>
            <Select fontSize="lg" color="dark.400" fontWeight="bold" variant="unstyled" h={10}
                    _selectedItem={{bg: 'accent.400'}} {...selectProps}>
                {collection.map((c, i) => {
                    return <Select.Item key={i} label={c.label} value={c.value}/>;
                })}
            </Select>
        </VStack>
        <Divider height={.5} bg="dark.600"/>
    </>;
}
