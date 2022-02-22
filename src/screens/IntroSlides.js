import React from 'react';
import AppIntroSlider from 'react-native-app-intro-slider';
// import { View, Text, Image, Pressable } from 'react-native'
import { Box, Image, Pressable, VStack, Text, HStack } from 'native-base';
import { FontAwesome } from '@expo/vector-icons'; 
import { storeLocal } from '../storage';

const slides = [
    {
      key: 1,
      title: 'Har du något som behöver åtgärdas hemma?',
    //   text: 'Description.\nSay something cool',
      image: require('../../assets/house.png'),
      backgroundColor: '#ff7e1a',
    },
    {
      key: 2,
      title: 'Vi på Cleangig hjälper er med detta. Allt från att städa förrådet till att skära buskar',
    //   text: 'Other cool stuff',
      image: require('../../assets/idea.png'),
      backgroundColor: '#ff7e1a',
    },
    {
      key: 3,
      title: 'Skapa ett konto och få proffesionell hjälp med dina ärenden.',
    //   text: 'I\'m already out of descriptions\n\nLorem ipsum bla bla bla',
      image: require('../../assets/happiness.png'),
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
                        <Text fontWeight="600" fontSize="md" color="#ffffff" mr="1"> hoppa </Text>
                        <FontAwesome name="angle-right" size={35} color="white" />
                    </HStack>
                </Pressable>
              </Box>
              <Box flex={3} alignItems="center">
                <Image width="5/6" height="5/6" background="white" resizeMode="contain" source={item.image}></Image>
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
            doneLabel="Gjort"
            nextLabel="Nästa"
        />
    );
} 

export default IntroSlides;