import React, {useEffect, useState} from 'react';
import {
    Alert,
    Button,
    CloseIcon,
    Collapse,
    FormControl,
    Heading, HStack,
    Icon,
    IconButton,
    Image,
    Input,
    Radio, Text,
    VStack
} from 'native-base';
import SafeScrollView from "../components/SafeScrollView";
import {FontAwesome5} from "@expo/vector-icons";
import {useDispatch, useSelector} from "react-redux";
import {LOGIN, LOGIN_ERROR, LOGIN_ERROR_NOT_FOUND, LOGIN_SUCCESS} from "../actions/types";
import {storeLocal, USER_DATA_KEY} from "../storage";
import {resetRoute} from "../helpers";
import {login} from "../actions/user";

export default function ({navigation}) {
    const loggedInStatus = useSelector(state => state.user.loggedInStatus);
    const user = useSelector(state => state.user.data);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('private');
    const [showError, setShowError] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        afterLogin().then();
    }, [loggedInStatus]);

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
        dispatch(login(userType, request));
    }

    return <SafeScrollView margin="5%" flex={1} width="90%">
        <VStack safeArea mb={100}>
            <VStack alignItems="center" p="10" space={3}>
                <Image source={require("../../assets/logo-small.png")} size="lg" alt="CleanGig" resizeMode="center"/>
            </VStack>

            <VStack bg="light.200" p={4} space={2} my={5}>
                <Heading size="sm">Logga in som...</Heading>

                <Radio.Group name="userType" value={userType} onChange={setUserType} flexDirection="row">
                    <Radio value="private" mx={1}>Privatperson</Radio>
                    <Radio value="company" mx={1}>Företag</Radio>
                </Radio.Group>

                <FormControl>
                    <Input value={email} onChangeText={setEmail} autoCompleteType="email" placeholder="E-postadress"
                           InputLeftElement={<Icon as={<FontAwesome5 name="envelope"/>} size="sm" m={2}
                                                   color="light.700"/>}/>
                </FormControl>

                <FormControl>
                    <Input value={password} onChangeText={setPassword} autoCompleteType="password" secureTextEntry
                           placeholder="Lösenord"
                           InputLeftElement={<Icon as={<FontAwesome5 name="lock"/>} size="sm" m={2}
                                                   color="light.700"/>}/>
                </FormControl>

                <Collapse isOpen={showError && [LOGIN_ERROR_NOT_FOUND, LOGIN_ERROR].some(x => x === loggedInStatus)}>
                    <Alert status="error">
                        <HStack space={4} flexWrap="wrap">
                            <Alert.Icon/>
                            <Heading size="sm">Fel</Heading>
                            <Text>{loggedInStatus === LOGIN_ERROR_NOT_FOUND
                                ? 'E-postadress eller lösenord är felaktigt.'
                                : 'Timeout -fel. Kontrollera din internetanslutning.'
                            }</Text>
                            <IconButton icon={<CloseIcon size="xs"/>} onPress={() => setShowError(false)}/>
                        </HStack>
                    </Alert>
                </Collapse>

                <Button _text={{color: 'white'}} onPress={submit} isLoading={loggedInStatus === LOGIN}
                        isLoadingText="Laddar, vänta...">
                    Logga in
                </Button>
            </VStack>

            <VStack bg="light.200" space={2} mb={4} rounded="md" p={4}>
                <Heading size="sm">Registrera dig som...</Heading>

                <VStack space={2}>
                    <Button _text={{color: 'white'}}
                            onPress={() => navigation.navigate('CustomerSignUp')}>Privatperson</Button>
                    <Button _text={{color: 'white'}}
                            onPress={() => navigation.navigate('ProviderSignUp')}>Företag</Button>
                </VStack>
            </VStack>
        </VStack>
    </SafeScrollView>;
}