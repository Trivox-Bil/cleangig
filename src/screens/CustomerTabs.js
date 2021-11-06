import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons';
import ServicesStack from "./Customer/ServicesStack";
import BrowseStack from "./Customer/BrowseStack";
import HistoryTab from "./Customer/HistoryTab";
import ChatStack from "./Customer/ChatStack";
import Profile from "./Customer/Profile";

const Tab = createBottomTabNavigator();

export default function () {
    function options(label, iconName) {
        const tabIcon = name => ({color, size}) => <FontAwesome5 name={name} size={size} color={color}/>;
        return {
            tabBarLabel: label,
            tabBarIcon: tabIcon(iconName),
        };
    }

    return (
        <Tab.Navigator screenOptions={{headerShown: false}} tabBarOptions={{activeTintColor: '#ff7e1a'}}>
            <Tab.Screen name="Services" component={ServicesStack}
                                options={options('Tjänster', 'briefcase')}/>
            <Tab.Screen name="Browse" component={BrowseStack}
                                options={options('Leverantörer', 'search')}/>
            <Tab.Screen name="History" component={HistoryTab} options={options('Jobb', 'tasks')}/>
            <Tab.Screen name="Chat" component={ChatStack} options={options('Chatt', 'comments')}/>
            <Tab.Screen name="Profile" component={Profile} options={options('Profil', 'user')}/>
        </Tab.Navigator>
    );
}
