import React, { useEffect } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5} from '@expo/vector-icons';
import Profile from "./Provider/Profile";
import ChatStack from "./Provider/ChatStack";
import JobTab from "./Provider/JobTab";
import HistoryStack from "./Provider/HistoryStack";
import JobStack from "./Provider/JobStack";
import store from "../store";
import {SET_NOTIFICATION_OPENED} from "../actions/types";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function ({ navigation }) {
    const notification = useSelector((state) => state.notification);
    function options(label, iconName) {
        const tabIcon = name => ({color, size}) => <FontAwesome5 name={name} size={size} color={color}/>;
        return {
            tabBarLabel: label,
            tabBarIcon: tabIcon(iconName),
            unmountOnBlur: true,
        };
    }

    useEffect(() => {
        console.log("notification ===>>", notification);
        if (notification.isOpen && notification.notification.details) {
          if (notification.notification.type === "message") {
            navigation.navigate("Chat", { screen: "Chat", params: {job: notification.notification.details.job } });
          } else if (notification.notification.type === "assigned-job") {
            console.log('closed job notification, ', notification)
            navigation.navigate("Jobs", { screen: "MyJob", params: {data: notification.notification.details.job } });
          }
          store.dispatch({type: SET_NOTIFICATION_OPENED});
        }
      }, [notification]);

    return (
        <Tab.Navigator screenOptions={{headerShown: false}} tabBarOptions={{activeTintColor: '#ff7e1a'}}>
            <Tab.Screen 
                name="Browse" 
                component={JobStack} 
                options={options('Sök', 'search')}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {navigation.navigate("Browse", {screen: "JobList"})},
                })}
            />
            <Tab.Screen 
                name="Jobs" 
                component={HistoryStack} 
                options={options('Jobb', 'tasks')}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {navigation.navigate("Jobs", {screen: "JobList"})},
                })}
            />
            <Tab.Screen 
                name="Chat" 
                component={ChatStack} 
                options={options('Chatt', 'comments')}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {navigation.navigate("Chat", {screen: "ChatList"})},
                })}
            />
            <Tab.Screen name="Profile" component={Profile} options={options('Profil', 'user')}/>
        </Tab.Navigator>
    );
}
