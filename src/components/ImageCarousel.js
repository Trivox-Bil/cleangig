import Carousel from 'react-native-anchor-carousel';
import React, {useRef, useState} from "react";
import {Badge, Button, HStack, Pressable, Text} from "native-base";
import {Dimensions, ImageBackground, Modal, StyleSheet} from "react-native";
import Gallery from 'react-native-image-gallery';

export default function ({images}) {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const carouselRef = useRef(null);
    const windowWidth = Dimensions.get('window').width;

    function chooseImage(index) {
        carouselRef.current.scrollToIndex(index);
        setModalVisible(true);
        setModalIndex(index);
    }

    function renderItem({index, item}) {
        return <Pressable borderRadius={8} shadow={3} onPress={() => chooseImage(index)}>
            <ImageBackground source={{uri: item}} style={styles.imageBackground}>
                <Badge colorScheme="accent" m={2} p={2} rounded="md">
                    <Text color="dark.300">{index + 1}/{images.length}</Text>
                </Badge>
            </ImageBackground>
        </Pressable>;
    }

    return <>
        <Carousel
            ref={carouselRef}
            data={images}
            renderItem={renderItem}
            containerWidth={windowWidth - 10}
            itemWidth={(windowWidth * 0.8) - 10}
            separatorWidth={2}
        />

        <Modal visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
            <HStack bgColor="#000" safeAreaTop py={8}>
                <Button onPress={() => setModalVisible(false)} variant="ghost" colorScheme="accent">
                    Tillbaka
                </Button>
            </HStack>
            <Gallery
                style={{flex: 1, backgroundColor: 'black'}}
                initialPage={modalIndex}
                images={images.map(image => ({source: {uri: image}}))}
            />
        </Modal>
    </>;
}

const styles = StyleSheet.create({
    imageBackground: {
        alignItems: 'flex-start',
        backgroundColor: '#EBEBEB',
        minHeight: 200,
        borderRadius: 8,
    },
});
