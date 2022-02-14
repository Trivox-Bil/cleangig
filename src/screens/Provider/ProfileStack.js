import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Profile from './Profile';
import EditProfile from './EditProfile';
import AddPortFolio from './Screens/AddPortfolio';
import PortfolioDetails from './Screens/PortfolioDetails';
import ImageBrowser from './Screens/ImageBrowser';

const Stack = createStackNavigator();

export default function () {
    return (
        <Stack.Navigator initialRouteName="Profile" screenOptions={{headerShown: false}}>
            <Stack.Screen name="Profile" component={Profile}/>
            <Stack.Screen name="EditPorfile" component={EditProfile}/>
            <Stack.Screen name="AddPortfolio" component={AddPortFolio}/>
            <Stack.Screen name="ImageBrowser" component={ImageBrowser}/>
            <Stack.Screen name="PortfolioDetails" component={PortfolioDetails}/>
        </Stack.Navigator>
    );
};
