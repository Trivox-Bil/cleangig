import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import MyJobList from "./Screens/MyJobList";
import MyJob from "./Screens/MyJob";
import CloseJob from "./Screens/CloseJob";
import CustomerProfile from './Screens/CustomerProfile';

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="JobList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="JobList" component={MyJobList}/>
            <Stack.Screen name="MyJob" component={MyJob}/>
            <Stack.Screen name="CloseJob" component={CloseJob}/>
            <Stack.Screen name="customer" component={CustomerProfile}  />
        </Stack.Navigator>
    );
};
