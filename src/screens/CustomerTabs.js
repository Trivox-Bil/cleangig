import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ServicesStack from "./Customer/ServicesStack";
import BrowseStack from "./Customer/BrowseStack";
import JobStack from "./Customer/JobStack";
import ChatStack from "./Customer/ChatStack";
import Profile from "./Customer/Profile";
import store from "../store";
import {SET_NOTIFICATION_OPENED} from "../actions/types";

const Tab = createBottomTabNavigator();

export default function ({ navigation }) {
  const notification = useSelector((state) => state.notification);
  function options(label, iconName) {
    const tabIcon =
      (name) =>
      ({ color, size }) =>
        <FontAwesome5 name={name} size={size} color={color} />;
    return {
      tabBarLabel: label,
      tabBarIcon: tabIcon(iconName),
      unmountOnBlur: true,
    };
  }

  useEffect(() => {
    console.log("notification ===>>", notification);
    if (notification.isOpen && notification.notification.details) {
      if (notification.notification.type === "job_approved") {
        // navigation.navigate('JobList', { screen: 'Job', params: {data: notification.notification.details} });
        navigation.navigate("Job", { screen: "Job", params: {data: notification.notification.details }});
      } else if (notification.notification.type === "proposal") {
        navigation.navigate("Job", { screen: "Job", params: {data: notification.notification.details.job } });
      } else if (notification.notification.type === "closed-job") {
        console.log('closed job notification, ', notification)
        navigation.navigate("Job", { screen: "Job", params: {data: notification.notification.details.job } });
      } else if (notification.notification.type === "message") {
        navigation.navigate("ChatMain", { screen: "Chat", params: {job: notification.notification.details.job } });
      }
      store.dispatch({type: SET_NOTIFICATION_OPENED});
    }
  }, [notification]);

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBarOptions={{ activeTintColor: "#ff7e1a" }}
    >
      <Tab.Screen
        name="Services"
        component={ServicesStack}
        options={options("Hem", "home")}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate("Services", { screen: "Services" });
          },
        })}
        // listeners={({navigation}) => ({ tabPress: e => { navigation.navigate("Services")}})}
      />
      <Tab.Screen
        name="Browse"
        component={BrowseStack}
        options={options("Leverantörer", "search")}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate("Browse", { screen: "ProviderList" });
          },
        })}
      />
      <Tab.Screen
        name="Job"
        component={JobStack}
        options={options("Jobb", "tasks")}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate("Job", { screen: "JobList" });
          },
        })}
      />
      <Tab.Screen
        name="ChatMain"
        component={ChatStack}
        options={options("Chatt", "comments")}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            navigation.navigate("ChatMain", { screen: "ChatList" });
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={options("Profil", "user")}
      />
    </Tab.Navigator>
  );
}
