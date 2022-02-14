import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProviderList from "./Screens/ProviderList";
import ProviderProfile from "./Screens/ProviderProfile";
import PortfolioDetails from '../Provider/Screens/PortfolioDetails';

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="ProviderList" screenOptions={{headerShown: false}}>
            <Stack.Screen name="ProviderList" component={ProviderList}/>
            <Stack.Screen name="ProviderProfile" component={ProviderProfile}/>
            <Stack.Screen name="PortfolioDetails" component={PortfolioDetails}/>
        </Stack.Navigator>
    );
};
