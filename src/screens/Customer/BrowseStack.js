import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Services from "./Screens/Services";
import NewJobForm from "./Screens/NewJob";

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="ProviderList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProviderList" component={Services}/>
            <Stack.Screen name="NewJob" component={NewJobForm}/>
        </Stack.Navigator>
    );
};
