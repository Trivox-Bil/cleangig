import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {ImageBrowser} from 'expo-image-picker-multiple';
import mime from "mime";
import AppBar from "../../../components/AppBar";
import {Heading, Text, VStack} from "native-base";

export default function({route, navigation}) {
    const [customOptions, setCustomOptions] = useState([]);
    const [count, setCount] = useState(0);

    function imagesCallback(callback) {
        callback
            .then(async (photos) => {
                const cPhotos = [];
                for (let photo of photos) {
                    const pPhoto = await _processImageAsync(photo.uri);
                    // console.log('pPhoto', pPhoto)
                    cPhotos.push({
                        uri: pPhoto.uri,
                        name: photo.filename,
                        type: mime.getType(pPhoto.uri),
                    });
                }
                route.params.setPictures(route.params.pictures.concat(cPhotos));
                navigation.goBack();
                // navigation.replace('AddPortfolio', {photos: route.params.pictures.concat(cPhotos), ...route.params});
            })
            .catch((e) => console.log(e));
    }

    async function _processImageAsync(uri) {
        return await ImageManipulator.manipulateAsync(
            uri,
            [{resize: {width: 1000}}],
            {compress: 0.8, format: ImageManipulator.SaveFormat.JPEG}
        );
    }

    function updateHandler(count, onSubmit) {
        setCustomOptions(count ? [{action: onSubmit, icon: 'check'}] : []);
        setCount(count);
    }

    function renderSelectedComponent(number) {
        return <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{number}</Text>
        </View>;
    }

    return <>
        <AppBar backButton navigation={navigation} screenTitle="Välj bilder" customOptions={customOptions}/>

        <VStack flex={1} position="relative">
            <Heading size="md">Valde {count} filer</Heading>

            <ImageBrowser
                onChange={updateHandler}
                callback={imagesCallback}
                renderSelectedComponent={renderSelectedComponent}
                emptyStayComponent={<Text textAlign="center">Inga bilder hittades</Text>}
            />
        </VStack>
    </>
}

const styles = StyleSheet.create({
    countBadge: {
        paddingHorizontal: 8.6,
        paddingVertical: 5,
        borderRadius: 50,
        position: 'absolute',
        right: 3,
        bottom: 3,
        justifyContent: 'center',
        backgroundColor: '#0580FF'
    },
    countBadgeText: {
        fontWeight: 'bold',
        alignSelf: 'center',
        padding: 'auto',
        color: '#ffffff'
    }
});
