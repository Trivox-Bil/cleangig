import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons';
import Profile from "./Provider/Profile";
import ChatStack from "./Provider/ChatStack";
import JobTab from "./Provider/JobTab";
import HistoryStack from "./Provider/HistoryStack";
import JobStack from "./Provider/JobStack";

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
            <Tab.Screen name="Browse" component={JobStack} options={options('Sök', 'search')}/>
            <Tab.Screen name="Jobs" component={HistoryStack} options={options('Jobb', 'tasks')}/>
            <Tab.Screen name="Chat" component={ChatStack} options={options('Chatt', 'comments')}/>
            <Tab.Screen name="Profile" component={Profile} options={options('Profil', 'user')}/>
        </Tab.Navigator>
    );
}
