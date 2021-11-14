import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Chat from "./Screens/Chat";
import ChatList from "./Screens/ChatList";

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="ChatList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="ChatList" component={ChatList}/>
            <Stack.Screen name="Chat" component={Chat}/>
        </Stack.Navigator>
    );
};
