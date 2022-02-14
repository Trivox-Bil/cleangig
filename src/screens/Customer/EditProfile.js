import React, { useCallback, useState } from 'react';
import AppBar from "../../components/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_SUCCESS } from "../../actions/types";
import { storeLocal, USER_DATA_KEY } from "../../storage";
import { HStack, Image, Pressable, VStack } from "native-base";
import counties from "../../data/counties";
import HoshiInput from "../../components/HoshiInput";
import * as ImagePicker from 'expo-image-picker';
import lodash from "lodash";
import { cleangigApi } from "../../network";
import SafeScrollView from "../../components/SafeScrollView";
import HoshiSelectControl from "../../components/HoshiSelectControl";

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

    async function saveAll() {
        const request = { id: user.id, fname, lname, phone_number: phone, county, city, street, postal_code: postalCode };
        const { data } = await cleangigApi.put('customers', request);
        dispatch({ type: LOGIN_SUCCESS, payload: data });
        await storeLocal(USER_DATA_KEY, data);
    }

    return <>
        {<AppBar backButton navigation={navigation} screenTitle="Edit Profile" customOptions={[
           !isSaved() && { action: saveAll, icon: 'save' }
        ]} />}

            <SafeScrollView flex={1}>
                <HStack m={4} justifyContent="center" space={2}>
                    <Pressable onPress={selectPicture}>
                        <Image source={{ uri: picture }} w={100} h={100} rounded="full" alt=" " />
                    </Pressable>
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
        </SafeScrollView>
    </>;
};