import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from './Profile';
import EditProfile from './EditProfile';

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="EditPorfile" component={EditProfile}/>
        </Stack.Navigator>
    );
};
