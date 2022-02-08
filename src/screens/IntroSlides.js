import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
// import { View, Text, Image, Pressable } from 'react-native'
import { Box, Image, Pressable, VStack, Text, HStack } from 'native-base';
import { FontAwesome } from '@expo/vector-icons'; 
import { storeLocal } from '../storage';

const slides = [
    {
      key: 1,
      title: 'Easily to look for thousands of handymen to help your problems',
    //   text: 'Description.\nSay something cool',
      image: require('../../assets/slide1.png'),
      backgroundColor: '#ff7e1a',
    },
    {
      key: 2,
      title: 'Cheaper and faster than hiring normal craftman ',
    //   text: 'Other cool stuff',
      image: require('../../assets/slide2.png'),
      backgroundColor: '#ff7e1a',
    },
    {
      key: 3,
      title: 'Be one of the handyman and start to work and earn money',
    //   text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      image: require('../../assets/slide3.png'),
      backgroundColor: '#ff7e1a',
    }
  ];
  

const IntroSlides = ({navigation}) => {

    const skipHandler = () => {
        storeLocal("skipIntro", 1)
        navigation.replace('Login');
    }

    const renderItem = ({ item }) => {
        return (
          <VStack bg={item.backgroundColor} flex={1} pt="10" justifyContent="space-between" >
              <Box flex={1} alignItems="flex-end" pr="3">
                <Pressable onPress={skipHandler}>
                    <HStack alignItems="center">
                        <Text fontWeight="600" fontSize="md" color="#ffffff" mr="1"> Skip </Text>
                        <FontAwesome name="angle-right" size={35} color="white" />
                    </HStack>
                </Pressable>
              </Box>
              <Box flex={3} alignItems="center">
                <Image width="5/6" height="5/6" borderRadius="20" source={item.image}></Image>
              </Box>
              <Box flex={3} justifyContent="center" px="6" alignItems="center">
                <Text textAlign="center" color="white" fontWeight="600" fontSize="md">{item.title}</Text>
              </Box>
          </VStack>
        );
      }
    
    return (
        <AppIntroSlider 
            renderItem={renderItem} 
            data={slides} 
            onDone={skipHandler}
        />
    );
} 

export default IntroSlides;