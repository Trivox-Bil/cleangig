import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Services from "./Screens/Services";
import NewJob from "./Screens/NewJob";
import ImagePicker from "./Screens/ImagePicker";

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="Services" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Services" component={Services}/>
            <Stack.Screen name="NewJob" component={NewJob}/>
            <Stack.Screen name="ImageBrowser" component={ImagePicker}/>
        </Stack.Navigator>
    );
};
