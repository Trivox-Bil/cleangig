import Carousel from 'react-native-anchor-carousel';
import React, {useRef, useState} from "react";
import {Badge, Button, HStack, Pressable, Text, IconButton, Icon} from "native-base";
import {Dimensions, ImageBackground, Modal, StyleSheet} from "react-native";
import Gallery from 'react-native-image-gallery';
import { FontAwesome5 } from "@expo/vector-icons";

export default function ({images, removePic, isNewJob = false}) {
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
                {
                    isNewJob 
                        ?
                        <Badge position="absolute" right={images.length > 1 ? 0 : 3} colorScheme="accent" m={2} p={2} rounded="md">
                            <IconButton 
                                p={0} m={0}
                                onPress={() => removePic(index) } color="red.900"
                                _icon={{ color: "red.500", size: "sm" }}
                                icon={<Icon as={<FontAwesome5 name="times" />} size="sm" color="light.100" />} />
                        </Badge>
                        : <></>
                }
               
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
