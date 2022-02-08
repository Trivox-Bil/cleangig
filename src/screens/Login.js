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

    const openSignUpPage = () => {
        if (userType === 'private') {
            navigation.navigate('CustomerSignUp');
        } else {
            navigation.navigate('ProviderSignUp');
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
                        <Button py={4} _text={{ color: 'white', fontWeight: 600, fontSize: 15 }} onPress={() => setUserType('private')}>Fortsätt som privatperson</Button>
                    </Box>
                    <Box>
                        <Button py={4} _text={{ color: 'white', fontWeight: 600, fontSize: 15 }} onPress={() => setUserType('company')}>Fortsätt som företag</Button>
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

                        </VStack>
                        <VStack>
                            {/* <Button py="3" alignSelf="center" width={100} _text={{color: 'white', fontWeight: 600, fontSize: 15}}>Log In</Button> */}
                            <HStack borderColor="#ff7e1a" borderBottomWidth={1} borderTopWidth={1} mt="5">
                                <Button flex={1} py="4" borderRightColor="#ff7e1a" borderRightWidth={1} variant="ghost" onPress={submit}>Logga in</Button>
                                <Button flex={1} py="4" variant="ghost" onPress={openSignUpPage}>Skapa konto</Button>
                            </HStack>
                        </VStack>
                    </VStack>
                </KeyboardAvoidingView>
            )}

        </VStack>
    );
}