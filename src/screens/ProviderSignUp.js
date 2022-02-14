import React, { useState, useRef } from 'react';
import SafeScrollView from "../components/SafeScrollView";
import {
    Alert,
    Button,
    Center,
    Checkbox,
    CloseIcon,
    Collapse,
    Divider,
    FormControl,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Link,
    Progress,
    Icon,
    KeyboardAvoidingView,
    Text,
    VStack
} from "native-base";
import validator from "validator";
import { cleangigApi } from "../network";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/user";
import { resetRoute } from "../helpers";
import { FontAwesome } from '@expo/vector-icons';

export default function ({ navigation }) {
    const pushToken = useSelector(state => state.notification.pushToken);
    const [stage, setStage] = useState(1);
    const [businessName, setBusinessName] = useState('');
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [orgNumber, setOrgNumber] = useState('');
    const [insurance, setInsurance] = useState(false);
    const [terms, setTerms] = useState(true);
    const [stage1Error, setStage1Error] = useState('');
    const [stage2Error, setStage2Error] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const contactNameRef = useRef(null);
    const orgNumberRef = useRef(null);
    const passwordRef = useRef();
    const passConfirmRef = useRef();
    const [passVisible, setPassVisible] = useState(false)
    const [passConfVisible, setPassConfVisible] = useState(false)

    function validateStage1() {
        if ([businessName, contactName, orgNumber].some(field => field.trim() === '')) {
            setStage1Error('Vänligen ange alla obligatoriska fält');
        } else {
            setStage(2);
        }
    }

    function validateStage2() {
        if ([email, password].some(field => field.trim() === '')) {
            setStage2Error('Vänligen ange alla obligatoriska fält');
        } else if (!validator.isEmail(email)) {
            setStage2Error('Ange en giltig e-postadress');
        } else if (password !== passConfirm) {
            setStage2Error('Lösenorden matchar inte');
        } else if (!terms) {
            setStage2Error('Du måste acceptera villkoren för att fortsätta');
        } else {
            register().then();
        }
    }

    async function register() {
        try {
            setSubmitting(true);
            const request = new FormData();
            request.append('business_name', businessName);
            request.append('contact_name', contactName);
            request.append('email', email);
            request.append('password', password);
            request.append('insurance', insurance);
            request.append('organisation_number', orgNumber);
            const { data: response } = await cleangigApi.post('providers', request);
            if (response.success) {
                request.append('pushToken', pushToken);
                dispatch(login(request));
                navigation.dispatch(resetRoute('Provider'));
            } else {
                setStage1Error('Ett fel inträffade. Försök igen');
            }
        } catch (e) {
            console.error(e);
            setStage1Error('Ett fel inträffade. Försök igen');
        } finally {
            setSubmitting(false);
        }
    }

    const part1 = <VStack >
        <FormControl px="4" mb="5">
            <FormControl.Label>Ditt företags namn</FormControl.Label>
            <Input
                value={businessName}
                onChangeText={setBusinessName}
                placeholder="Ditt företags namn"
                borderRadius="8"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderColor="#ff7e1a"
                borderWidth={1}
                InputLeftElement={<Icon as={<FontAwesome name="user" />} size="sm" m={2}
                    color="#ff7e1a" />}
            />
        </FormControl>
        <FormControl px="4" mb="5">
            <FormControl.Label>Konto ägare</FormControl.Label>
            <Input
                value={contactName}
                onChangeText={setContactName}
                placeholder="Konto ägare"
                borderRadius="8"
                borderColor="#ff7e1a"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderWidth={1}
                InputLeftElement={<Icon as={<FontAwesome name="user" />} size="sm" m={2}
                    color="#ff7e1a" />}
            />
        </FormControl>
        <FormControl px="4" mb="5">
            <FormControl.Label>Organisationsnummer</FormControl.Label>
            <Input
                value={orgNumber}
                onChangeText={setOrgNumber}
                placeholder="Organisationsnummer"
                borderRadius="8"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderColor="#ff7e1a"
                borderWidth={1}
            />
        </FormControl>
        <FormControl px="4" mb="5">
            <Checkbox value={insurance} onChange={setInsurance}>Försäkring?</Checkbox>
        </FormControl>

        <Collapse isOpen={stage1Error.length > 0}>
            <Alert status="error">
                <HStack space={4} flexWrap="wrap">
                    <Alert.Icon />
                    <Heading size="sm">Fel</Heading>
                    <Text>{stage1Error}</Text>
                    <IconButton icon={<CloseIcon size="xs" />} onPress={() => setStage1Error('')} />
                </HStack>
            </Alert>
        </Collapse>
    </VStack>;

    const part2 = <VStack >
        <FormControl px="4" mb="5">
            <FormControl.Label>E-post adress</FormControl.Label>
            <Input
                value={email}
                onChangeText={setEmail}
                placeholder="E-post adress"
                borderRadius="8"
                borderColor="#ff7e1a"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderWidth={1}
                InputLeftElement={<Icon as={<FontAwesome name="envelope" />} size="sm" m={2}
                    color="#ff7e1a" />}
            />
        </FormControl>
        <FormControl px="4" mb="5">
            <FormControl.Label>Lösenord</FormControl.Label>
            <Input
                value={password}
                onChangeText={setPassword}
                placeholder="Lösenord"
                borderRadius="8"
                borderColor="#ff7e1a"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderWidth={1}
                secureTextEntry={!passVisible}
                InputLeftElement={<Icon as={<FontAwesome name="lock" />} size="sm" m={2}
                    color="#ff7e1a" />}
                InputRightElement={<Icon as={<FontAwesome name={passVisible ? "eye" : "eye-slash"} />} onPress={() => setPassVisible(!passVisible)} size="sm" m={2}
                    color="#bdbcb9" />}
            />
        </FormControl>
        <FormControl px="4" mb="5">
            <FormControl.Label>Bekräfta lösenordet</FormControl.Label>
            <Input
                value={passConfirm}
                onChangeText={setPassConfirm}
                placeholder="Bekräfta lösenordet"
                borderRadius="8"
                _focus={{
                    borderColor: "#ff7e1a"
                }}
                borderColor="#ff7e1a"
                borderWidth={1}
                secureTextEntry={!passConfVisible}
                InputLeftElement={<Icon as={<FontAwesome name="lock" />} size="sm" m={2}
                    color="#ff7e1a" />}
                InputRightElement={<Icon as={<FontAwesome name={passConfVisible ? "eye" : "eye-slash"} />} onPress={() => setPassConfVisible(!passVisible)} size="sm" m={2}
                    color="#bdbcb9" />}
            />
        </FormControl>

        <Collapse isOpen={stage2Error.length > 0}>
            <Alert status="error">
                <HStack space={4} flexWrap="wrap">
                    <Alert.Icon />
                    <Heading size="sm">Fel</Heading>
                    <Text>{stage2Error}</Text>
                    <IconButton icon={<CloseIcon size="xs" />} onPress={() => setStage2Error('')} />
                </HStack>
            </Alert>
        </Collapse>

        <Text textAlign="center">By creating an account, you agree to the<Link href="https://cleangig.se/privacy.html" _text={{ textDecoration: 'none', fontWeight: 'bold' }}  > Terms of Use.</Link></Text>
    </VStack>;


    return (
        <VStack safeArea flex={1}>
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
                        {/* <Pressable pl="3" onPress={() => navigation.goBack()}>
                    <FontAwesome name="angle-left" size={35} color="#ff7e1a" />
                </Pressable> */}
                        <VStack alignItems="center" mt="5">
                            <Heading mb="3" fontWeight="semibold">Registrering</Heading>
                            <Text fontSize="sm">Please fill this information</Text>
                        </VStack>
                    </VStack>
                    {stage === 1 ? part1 : part2}
                    <VStack>
                        <HStack borderColor="#ff7e1a" borderBottomWidth={1} borderTopWidth={1} mt="5">
                            {
                                stage === 1
                                    ? < Button flex={1} py="4" borderRightColor="#ff7e1a" borderRightWidth={1} onPress={() => navigation.goBack()} variant="ghost">Logga in</Button>
                                    : <Button flex={1} py="4" variant="ghost" onPress={() => setStage(1)} >Back</Button>
                            }
                            {
                                stage === 1
                                    ? <Button flex={1} py="4" variant="ghost" onPress={validateStage1} >Next</Button>
                                    : <Button flex={1} py="4" variant="ghost" onPress={validateStage2} isLoading={submitting} isLoadingText="Laddar, vänta..." >Skapa konto</Button>
                            }
                        </HStack>
                    </VStack>
                </VStack>
            </KeyboardAvoidingView >
        </VStack >
    )
}
