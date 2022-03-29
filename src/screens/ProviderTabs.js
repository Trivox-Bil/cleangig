import React, { useEffect, useRef, useState } from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesome5, Ionicons} from '@expo/vector-icons';
import Profile from "./Provider/Profile";
import ChatStack from "./Provider/ChatStack";
import JobTab from "./Provider/JobTab";
import HistoryStack from "./Provider/HistoryStack";
import JobStack from "./Provider/JobStack";
import store from "../store";
import {SET_NOTIFICATION_OPENED, SET_NOTIFICATION_COUNT} from "../actions/types";
import { useSelector } from "react-redux";
import { readNotification } from '../helpers';
import Notification from './Provider/Notifications';
import { cleangigApi } from "../network";
import ProfileStack from './Provider/ProfileStack';

const Tab = createBottomTabNavigator();

export default function ({ navigation }) {
    const notification = useSelector((state) => state.notification);
    const user = useSelector(state => state.user.data);
    const notifcationCount = useRef(0)
    const [notiTabOptions, setNotiTabOptions] = useState({
        tabBarBadgeStyle: { backgroundColor: "#e66500", color: "#fff" },
        tabBarBadge: null
    })
    function options(label, iconName) {
        const tabIcon = name => ({color, size}) => <FontAwesome5 name={name} size={size} color={color}/>;
        return {
            tabBarLabel: label,
            tabBarIcon: tabIcon(iconName),
            unmountOnBlur: true,
        };
    }

    useEffect( async() => {
        // setNotiTabOptions({ ...notiTabOptions, tabBarBadge: notification.count });
        // console.log("notification ===>>", notification);
        if (notification.isOpen && notification.notification.details) {
            readNotification(notification.notification.notification_id);

            if (notification.notification.type === "message") {

                navigation.navigate("Chat", { screen: "Chat", params: {job: notification.notification.details.job } });
            } else if (notification.notification.type === "assigned-job") {

                navigation.navigate("Jobs", { screen: "MyJob", params: {data: notification.notification.details.job } });
            }
            store.dispatch({type: SET_NOTIFICATION_OPENED});
        }

        const { data } = await cleangigApi.get(`notifications-count/${user.id}`);

        if (data[0].total_notifications > 0 && data[0].total_notifications > notifcationCount.current ) {
            // store.dispatch({ type: SET_NOTIFICATION_COUNT, payload: data[0].total_notifications });
            setNotiTabOptions({ ...notiTabOptions, tabBarBadge: data[0].total_notifications });
        } else {
            if (notiTabOptions.tabBarBadge !== null) {
            setNotiabOptions({ ...notiTabOptions, tabBarBadge: null });
            }
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
                // listeners={({ navigation, route }) => ({
                //     tabPress: () => {navigation.navigate("Chat", {screen: "ChatList"})},
                // })}
            />

            <Tab.Screen
                name="Notifications"
                component={Notification}
                options={{
                tabBarLabel: "Aviseringar",
                tabBarIcon: ({ color, size }) =>
                    <Ionicons name="notifications-outline" size={size} color={color} />,
                unmountOnBlur: true,
                ...notiTabOptions
                }}
                listeners={({ navigation, route }) => ({
                    tabPress: () => {
                      notifcationCount.current =notiTabOptions.tabBarBadge
                      setNotiTabOptions({ ...notiTabOptions, tabBarBadge: null});
                    },
                  })}
            />
            <Tab.Screen name="Profile" component={ProfileStack} options={options('Profil', 'user')}/>
        </Tab.Navigator>
    );
}
