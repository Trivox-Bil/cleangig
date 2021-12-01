import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Services from "./Screens/Services";
import NewJob from "./Screens/NewJob";
import ImageBrowser from "./Screens/ImageBrowser";
import ProviderList from "./Screens/ProviderList";

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="Services" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Services" component={Services}/>
            <Stack.Screen name="NewJob" component={NewJob}/>
            <Stack.Screen name="ImageBrowser" component={ImageBrowser}/>
            <Stack.Screen name="ProviderList" component={ProviderList}/>
        </Stack.Navigator>
    );
};
