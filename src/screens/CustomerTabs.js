import React, { useEffect, useState, useRef } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome5, Ionicons, FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import ServicesStack from "./Customer/ServicesStack";
import BrowseStack from "./Customer/BrowseStack";
import JobStack from "./Customer/JobStack";
import ChatStack from "./Customer/ChatStack";
import Profile from "./Customer/Profile";
import store from "../store";
import { SET_NOTIFICATION_COUNT, SET_NOTIFICATION_OPENED } from "../actions/types";
import HistoryStack from "./Provider/HistoryStack";
import Notification from "./Customer/Notifications";
import { readNotification } from "../helpers";
import { backgroundColor } from "styled-system";
import { cleangigApi } from "../network";
import ProfileStack from "./Customer/ProfileStack";
import { Icon } from 'native-base';

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

  useEffect(async () => {
    setNotiTabOptions({ ...notiTabOptions, tabBarBadge: notification.count });
    if (notification.isOpen && notification.notification.details) {

      if (notification.notification.notification_id) {
        readNotification(notification.notification.notification_id);
      }

      if (notification.notification.type === "job_approved") {

        navigation.navigate("Job", { screen: "Job", params: { data: notification.notification.details } });
      } else if (notification.notification.type === "proposal") {

        navigation.navigate("Job", { screen: "Job", params: { data: notification.notification.details.job } });
      } else if (notification.notification.type === "closed-job") {

        navigation.navigate("Job", { screen: "Job", params: { data: notification.notification.details.job } });
      } else if (notification.notification.type === "message") {

        navigation.navigate("ChatMain", { screen: "Chat", params: { job: notification.notification.details.job } });
      }
      store.dispatch({ type: SET_NOTIFICATION_OPENED });
    }

    const { data } = await cleangigApi.get(`notifications-count/${user.id}`);

    if (data[0].total_notifications > 0 && data[0].total_notifications > notifcationCount.current ) {
      // store.dispatch({ type: SET_NOTIFICATION_COUNT, payload: data[0].total_notifications });
      setNotiTabOptions({ ...notiTabOptions, tabBarBadge: data[0].total_notifications });
    } else {
      notifcationCount.current = data[0].total_notifications
      setNotiTabOptions({ ...notiTabOptions, tabBarBadge: null });
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
        options={{tabBarLabel: "Chatt",
        tabBarIcon: ({ color, size }) =>
            <Icon name="comments-o" as={FontAwesome}   size={size} color={color} />}}
        listeners={({ navigation, route }) => ({
          tabPress: () => {
            // navigation.navigate("ChatMain", { screen: "ChatList" });
          },
        })}
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
            notifcationCount.current = notiTabOptions.tabBarBadge
            setNotiTabOptions({ ...notiTabOptions, tabBarBadge: null});
          },
        })}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={options("Profil", "user")}
      />
    </Tab.Navigator>
  );
}
