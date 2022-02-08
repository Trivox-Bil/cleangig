import React, {useEffect, useRef} from 'react';
import {Provider} from "react-redux";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "react-native-screens/native-stack";
import store from "./src/store";
import Splash from "./src/screens/Splash";
import Login from "./src/screens/Login";
import {NativeBaseProvider} from "native-base/src/core/NativeBaseProvider";
import {
    Poppins_300Light,
    Poppins_300Light_Italic,
    Poppins_400Regular,
    Poppins_400Regular_Italic,
    Poppins_500Medium,
    Poppins_500Medium_Italic,
    Poppins_600SemiBold,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold,
    Poppins_700Bold_Italic,
    Poppins_800ExtraBold,
    Poppins_800ExtraBold_Italic,
    Poppins_900Black,
    Poppins_900Black_Italic,
    useFonts
} from "@expo-google-fonts/poppins";
import AppLoading from 'expo-app-loading';
import {defaultTheme} from "./src/theme";
import CustomerSignUp from "./src/screens/CustomerSignUp";
import {SET_NOTIFICATION, SET_PUSH_TOKEN, SET_NOTIFICATION_OPEN, SET_NOTIFICATION_COUNT} from "./src/actions/types";
import * as Notifications from "expo-notifications";
import {registerForPushNotificationsAsync} from "./src/notifications";
import ProviderSignUp from "./src/screens/ProviderSignUp";
import CustomerTabs from "./src/screens/CustomerTabs";
import ProviderTabs from "./src/screens/ProviderTabs";
import config from "./src/config";
import { cleangigApi } from './src/network';
import IntroSlides from './src/screens/IntroSlides';

const Stack = createNativeStackNavigator();

export default function App() {
    let [fontsLoaded] = useFonts({
        Poppins_300Light,
        Poppins_400Regular,
        Poppins_500Medium,
        Poppins_600SemiBold,
        Poppins_700Bold,
        Poppins_800ExtraBold,
        Poppins_900Black,
        Poppins_300Light_Italic,
        Poppins_400Regular_Italic,
        Poppins_500Medium_Italic,
        Poppins_600SemiBold_Italic,
        Poppins_700Bold_Italic,
        Poppins_800ExtraBold_Italic,
        Poppins_900Black_Italic,
    });
    const notificationListener = useRef();
    const responseListener = useRef();
    const notificationState =  store.getState().notification;

    useEffect( async () => {


        

        registerForPushNotificationsAsync().then(token => {
            // console.log('token', token)
            store.dispatch({type: SET_PUSH_TOKEN, payload: token});
        });
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // console.log('addNotificationReceivedListener', notification)
            
            store.dispatch({type: SET_NOTIFICATION, payload: notification.request.content.data});
        });
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
           
            // console.log('addNotificationResponseReceivedListener', response)
            store.dispatch({type: SET_NOTIFICATION_OPEN, payload: response.notification.request.content.data});

        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    if (!fontsLoaded) {
        return <AppLoading/>;
    } else {
        return <Provider store={store}>
            <NativeBaseProvider config={config} theme={defaultTheme}>
                <NavigationContainer>
                    <Stack.Navigator initialRouteName="Splash" screenOptions={{headerShown: false}}>
                        <Stack.Screen name="Splash" component={Splash}/>
                        <Stack.Screen name="IntroSlide" component={IntroSlides}/>
                        <Stack.Screen name="Login" component={Login}/>
                        <Stack.Screen name="CustomerSignUp" component={CustomerSignUp}/>
                        <Stack.Screen name="ProviderSignUp" component={ProviderSignUp}/>
                        <Stack.Screen name="Customer" component={CustomerTabs}/>
                        <Stack.Screen name="Provider" component={ProviderTabs}/>
                    </Stack.Navigator>
                </NavigationContainer>
            </NativeBaseProvider>
        </Provider>;
    }
}
