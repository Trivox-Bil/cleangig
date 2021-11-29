import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import JobList from "./Screens/JobList";
import Job from "./Screens/Job";

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="JobList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="JobList" component={JobList}/>
            <Stack.Screen name="Job" component={Job}/>
        </Stack.Navigator>
    );
};
