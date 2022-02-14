import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Services from "./Screens/Services";
import NewJob from "./Screens/NewJob";
import ImageBrowser from "./Screens/ImageBrowser";
import BrowseProvider from './Screens/BrowseProvider';
import ProviderProfile from "./Screens/ProviderProfile";
import PortfolioDetails from '../Provider/Screens/PortfolioDetails';

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="Services" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Services" component={Services}/>
            <Stack.Screen name="NewJob" component={NewJob}/>
            <Stack.Screen name="ImageBrowser" component={ImageBrowser}/>
            <Stack.Screen name="BrowseProvider" component={BrowseProvider}/>
            <Stack.Screen name="ProviderProfile" component={ProviderProfile}/>
            <Stack.Screen name="PortfolioDetails" component={PortfolioDetails}/>
        </Stack.Navigator>
    );
};
