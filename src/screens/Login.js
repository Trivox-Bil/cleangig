import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CloseIcon,
    Collapse,
    FormControl,
    Heading,
    HStack,
    Icon,
    IconButton,
    Image,
    Input,
    KeyboardAvoidingView,
    Pressable,
    Radio,
    Text,
    VStack
} from 'native-base';
import { useDispatch, useSelector } from "react-redux";
import { LOGIN, LOGIN_ERROR, LOGIN_ERROR_NOT_FOUND, LOGIN_SUCCESS } from "../actions/types";
import { storeLocal, USER_DATA_KEY } from "../storage";
import { resetRoute } from "../helpers";
import { login } from "../actions/user";
import { FontAwesome } from '@expo/vector-icons';
import * as Google from "expo-google-app-auth"
import { TouchableOpacity, View } from 'react-native';

export default function ({ navigation }) {
    const loggedInStatus = useSelector(state => state.user.loggedInStatus);
    const user = useSelector(state => state.user.data);
    const pushToken = useSelector(state => state.notification.pushToken);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('');
    const [showError, setShowError] = useState(false);
    const [passVisible, setPassVisible] = useState(false)
    const dispatch = useDispatch();

    useEffect(() => {
        afterLogin().then();
    }, [loggedInStatus]);

    useEffect(() => {
        setPassVisible(false)
    }, [userType]);

    async function afterLogin() {
        console.log('loggedInStatus', loggedInStatus)
        console.log('LOGIN_SUCCESS', LOGIN_SUCCESS)
        if (loggedInStatus !== LOGIN_SUCCESS) {
            setPassword('');
        } else {
            setShowError(false);
            await storeLocal(USER_DATA_KEY, user);
            navigation.dispatch(resetRoute(userType === 'private' ? 'Customer' : 'Provider'));
        }
    }

    function submit() {
        setShowError(true);
        const request = new FormData();
        request.append('email', email);
        request.append('password', password);
        request.append('pushToken', pushToken);
        dispatch(login(userType, request));
    }

    const openSignUpPage = (params = null) => {
        if (userType === 'private') {
            navigation.navigate('CustomerSignUp', params);
        } else {
            navigation.navigate('ProviderSignUp', params);
        }
    }
    const openForgotPage = () => {
        if (userType === 'private') {
            navigation.navigate('Forgot');
        } 
        else{
            navigation.navigate('Forgot');
        }
    }

    const handleGoogleSignIn = () => {
        // 1071325411415-fsg5q3ms0bflgih4rn4bslvk4sso46r3.apps.googleusercontent.com
        const config = {
            iosClientId: `1071325411415-fsg5q3ms0bflgih4rn4bslvk4sso46r3.apps.googleusercontent.com`,
            iosStandaloneAppClientId: '1071325411415-8dqa81l75lbhm1jtpnu63pen06p6bevv.apps.googleusercontent.com',
            scopes: ['profile', 'email']
        }

        try {
            Google.logInAsync(config)
                .then(async (result) => {
                    if (result.type === "success" && result.user) {
                        const request = new FormData();
                        // setGoogleId(result.user.id)
                        request.append('other_login_api_id', result.user.id);
                        await dispatch(login(userType, request));
                        console.log("result.user", result.user)
                        console.log("user", user)
                        if (user === null) {
                            console.log('LoginScreen user user user if', user)
                            // storeLocal('@other_login_api_id', JSON.stringify(result.user.id))

                            if (userType === 'private') {
                                navigation.navigate('CustomerSignUp', {
                                    firstName: result.user?.givenName || '',
                                    lastName: result.user?.familyName || '',
                                    email: result.user?.email || '',
                                    otherLoginApiId: result.user.id || ''
                                });
                            } else {
                                let firstName = result.user?.givenName || ''
                                let lastName = result.user?.familyName || ''
                                navigation.navigate('ProviderSignUp', {
                                    contactName: `${firstName} ${lastName}`,
                                    email: result.user?.email || '',
                                    otherLoginApiId: result.user.id || ''
                                });
                            }

                            // openSignUpPage({
                            //     firstName: result.user?.givenName || '',
                            //     lastName: result.user?.familyName || '',
                            //     email: result.user?.email || '',
                            //     otherLoginApiId: result.user.id || ''
                            // })
                            // navigation.navigate('Register', {
                            //     firstName: result.user?.givenName || '',
                            //     lastName: result.user?.familyName || '',
                            //     email: result.user?.email || ''
                            // })
                        }
                        // else {
                        //     console.log('LoginScreen user user user else', user)
                        //     storeLocal('@user', JSON.stringify(user)) && storeLocal('@loggedIn', '1')
                        //     navigation.navigate('Inventory')
                        // }


                    }
                })
                .catch((error) => { console.log(error) });
        } catch (error) {
            console.log("error", error)
        }
    }

    return (
        <VStack safeArea flex={1} >
            {userType === '' ? (
                <VStack flex={1} px={65} pt={150}>
                    <VStack alignItems="center">
                        <Image source={require("../../assets/logo-small.png")} w={200} h={200} alt="CleanGig" resizeMode="contain" />
                    </VStack>
                    <Box mb={30}>
                        <Button py={4} _text={{ color: 'white', fontWeight: 600, fontSize: 15 }} onPress={() => setUserType('private')}>Fortsätt som Beställare</Button>
                    </Box>
                    <Box>
                        <Button py={4} _text={{ color: 'white', fontWeight: 600, fontSize: 15 }} onPress={() => setUserType('company')}>Fortsätt som Leverantör</Button>
                    </Box>
                </VStack>
            ) : (
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    h={{
                        base: "705px",
                        lg: "auto",
                    }}
                    flex={1}
                >
                    <VStack flex={1} justifyContent="space-between">
                        <VStack>
                            <Pressable pl="3" onPress={() => setUserType('')}>
                                <FontAwesome name="angle-left" size={35} color="#ff7e1a" />
                            </Pressable>
                            <VStack alignItems="center" mt="5">
                                <Heading mb="3" fontWeight="semibold">Logga in</Heading>
                                <Text fontSize="sm">Välkommen tillbaka till cleangig</Text>
                            </VStack>
                        </VStack>
                        <VStack>
                            <FormControl px="4" mb="5">
                                <FormControl.Label>E-post</FormControl.Label>
                                <Input
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCompleteType="email"
                                    placeholder="E-postadress"
                                    borderRadius="8"
                                    _focus={{
                                        borderColor: "#ff7e1a"
                                    }}
                                    borderColor="#ff7e1a"
                                    borderWidth={1}
                                    InputLeftElement={<Icon as={<FontAwesome name="envelope" />} size="sm" m={2}
                                        color="#ff7e1a" />}
                                />
                            </FormControl>
                            <FormControl px="4" mb="5">
                                <FormControl.Label>Lösenord</FormControl.Label>
                                <Input
                                    borderRadius="8"
                                    borderColor="#ff7e1a"
                                    placeholder="Lösenord"
                                    borderWidth={1}
                                    _focus={{
                                        borderColor: "#ff7e1a"
                                    }}
                                    value={password}
                                    onChangeText={setPassword}
                                    autoCompleteType="password"
                                    secureTextEntry={!passVisible}
                                    InputLeftElement={<Icon as={<FontAwesome name="lock" />} size="sm" m={2}
                                        color="#ff7e1a" />}
                                    InputRightElement={<Icon as={<FontAwesome name={passVisible ? "eye" : "eye-slash"} />} onPress={() => setPassVisible(!passVisible)} size="sm" m={2}
                                        color="#bdbcb9" />}
                                />
                            </FormControl>
                            <Collapse isOpen={showError && [LOGIN_ERROR_NOT_FOUND, LOGIN_ERROR].some(x => x === loggedInStatus)}>
                                <Alert status="error">
                                    <HStack space={4} flexWrap="wrap">
                                        <Alert.Icon />
                                        <Heading size="sm">Fel</Heading>
                                        <Text>{loggedInStatus === LOGIN_ERROR_NOT_FOUND
                                            ? 'E-postadress eller lösenord är felaktigt.'
                                            : 'Timeout -fel. Kontrollera din internetanslutning.'
                                        }</Text>
                                        <IconButton icon={<CloseIcon size="xs" />} onPress={() => setShowError(false)} />
                                    </HStack>
                                </Alert>
                            </Collapse>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop:10}}>
                                <TouchableOpacity onPress={openSignUpPage} style={{ padding:5, borderRadius:5, borderColor:'darkorange', borderWidth:1, paddingHorizontal:10}}><Text style={{ color: '#FF4500' }}>Skapa konto</Text></TouchableOpacity>
                                <TouchableOpacity onPress={openForgotPage} style={{ padding:5}}><Text style={{ color: '#FF4500' }}>Glömt lösenord</Text></TouchableOpacity>
                            </View>
                        </VStack>
                        <VStack>
                            {/* <Button mx="4" variant="outline" onPress={handleGoogleSignIn}>Apple Sign In</Button>
                            <Button mx="4" my='4' variant="outline" onPress={handleGoogleSignIn}>Facebook Sign In</Button> */}
                            <Button mx="4" variant="outline" onPress={handleGoogleSignIn}>Google Sign In</Button>

                            {/* <Button py="3" alignSelf="center" width={100} _text={{color: 'white', fontWeight: 600, fontSize: 15}}>Log In</Button> */}
                            <HStack borderColor="#ff7e1a" borderBottomWidth={1} borderTopWidth={1} mt="5">
                                <Button flex={1} py="4" borderRightColor="#ff7e1a" borderRightWidth={1} variant="ghost" onPress={submit}>Logga in</Button>
                                {/* <Button flex={1} py="4" variant="ghost" onPress={openSignUpPage}>Skapa konto</Button> */}
                            </HStack>
                        </VStack>
                    </VStack>
                </KeyboardAvoidingView>
            )}

        </VStack>
    );
}