import React, { useState, useEffect, useRef } from 'react';
import SafeScrollView from "../components/SafeScrollView";
import {
    Alert,
    Button,
    Center,
    Checkbox,
    CheckIcon,
    CloseIcon,
    Collapse,
    Divider,
    FormControl,
    Heading,
    HStack,
    IconButton,
    Image,
    Icon,
    Input,
    Link,
    KeyboardAvoidingView,
    Progress,
    Select,
    Text,
    VStack,
    ScrollView,
    Radio
} from "native-base";
import counties from "../data/counties";
import validator from "validator";
import { cleangigApi } from "../network";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../actions/user";
import { resetRoute } from "../helpers";
import { FontAwesome } from '@expo/vector-icons';
import { getLocal } from "../storage";
import { Item } from 'native-base/src/components/primitives/Select/SelectItem';

export default function ({ navigation, route }) {
    const pushToken = useSelector(state => state.notification.pushToken);
    const [stage, setStage] = useState(1);
    const [firstName, setFirstName] = useState(route?.params?.firstName ? route?.params?.firstName : '');
    const [companyName, setCompanyName] = useState('');
    const [lastName, setLastName] = useState(route?.params?.lastName ? route?.params?.lastName : '');
    const [email, setEmail] = useState(route?.params?.email ? route?.params?.email : '');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [county, setCounty] = useState('AB');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [type, setType] = useState('private');
    const [phone, setPhone] = useState('+46 ');
    const [terms, setTerms] = useState(true);
    const [stage1Error, setStage1Error] = useState('');
    const [stage2Error, setStage2Error] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();
    const lNameRef = useRef(null);
    const emailRef = useRef();
    const phoneRef = useRef();
    const passwordRef = useRef();
    const passConfirmRef = useRef(); 
    const streetRef = useRef();
    const [passVisible, setPassVisible] = useState(false)
    const [passConfVisible, setPassConfVisible] = useState(false)
    const [id, setId] = useState(route?.params?.otherLoginApiId ? route?.params?.otherLoginApiId : '');
    const [myCounty, setMyCounty] = useState()

    
    const myData = counties.map((item)=>{
        return {...item,cities:item.cities.sort()}
        }).sort((a,b)=> (a.name > b.name ? 1 : -1));

    function validateStage1() {
        console.log(id)
        if ([firstName, lastName, email, phone].some(field => field.trim() === '')) {
            setStage1Error('Vänligen ange alla obligatoriska fält');
        } else if (!validator.isEmail(email)) {
            setStage1Error('Ange en giltig e-postadress');
        } else if (id === '') {
            if (password.trim() === '') {
                setStage1Error('Vänligen ange alla obligatoriska fält');
            } else {
                setStage(2);
            }
            // else if (password !== passConfirm) {
            //     setStage1Error('Lösenorden matchar inte');
            // } 
        } else {
            setStage(2);
        }
    }

    function validateStage2() {
        if (phone.trim() === '' || phone === '+46 ') {
            setStage2Error('Phone number is required');
        } else if (city.length === 0) {
            setStage2Error('Ange en giltig stad');
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
            request.append('type', type);
            request.append('company_name', companyName);
            request.append('first_name', firstName);
            request.append('last_name', lastName);
            request.append('email', email);
            request.append('password', password);
            request.append('street', street);
            request.append('city', city);
            request.append('county', county);
            request.append('phone_number', phone);
            request.append('postal_code', postalCode);
            request.append('other_login_api_id', id);
            // console.log('request11', request)
            const { data: response } = await cleangigApi.post('customers', request);
            console.log(response);
            if (response.success) {
                request.append('pushToken', pushToken);
                dispatch(login('private', request));
                navigation.dispatch(resetRoute('Customer'));
            } else {
                setStage2Error('Ett fel inträffade. Försök igen');
            }
        } catch (e) {
            console.error(e);
            console.log(e);
            setStage2Error('Ett fel inträffade. Försök igen');
        } finally {
            setSubmitting(false);
        }
    }

    const part1 =
        <SafeScrollView bg="gray.100">
            <FormControl px="4" mb="5">
                 
                <Radio.Group name="type" value={type} onChange={nextValue => {
                    setType(nextValue);
                }}>
                    <Radio value="1" my={1} >
                        Privat
                    </Radio>
                    <Radio value="2" my={1}>
                        Företag
                    </Radio>
                </Radio.Group>
            </FormControl>
            {type == 2 && (
                <FormControl bg="gray.100" px="4" mb="5" >
                    <FormControl.Label>Företagsnamn</FormControl.Label>
                    <Input
                        value={companyName}
                        onChangeText={setCompanyName}
                        placeholder="Företagsnamn"
                        _focus={{
                            borderColor: "#ff7e1a"
                        }}
                        borderRadius="8"
                        borderColor="#ff7e1a"
                        borderWidth={1}
                        InputLeftElement={<Icon as={<FontAwesome name="user" />} size="sm" m={2}
                            color="#ff7e1a" />}
                    />
                </FormControl>
            )}
            <FormControl bg="gray.100" px="4" mb="5" >
                <FormControl.Label>Förnamn</FormControl.Label>
                <Input
                    value={firstName}
                    onChangeText={setFirstName}
                    placeholder="Förnamn"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    InputLeftElement={<Icon as={<FontAwesome name="user" />} size="sm" m={2}
                        color="#ff7e1a" />}
                />
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>Efternamn</FormControl.Label>
                <Input
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    placeholder="Efternamn"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    borderWidth={1}
                    value={lastName}
                    onChangeText={setLastName}
                    InputLeftElement={<Icon as={<FontAwesome name="user" />} size="sm" m={2}
                        color="#ff7e1a" />}
                />
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>E-post</FormControl.Label>
                <Input
                    value={email}
                    onChangeText={setEmail}
                    autoCompleteType="email"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    placeholder="E-postadress"
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    InputLeftElement={<Icon as={<FontAwesome name="envelope" />} size="sm" m={2}
                        color="#ff7e1a" />}
                />
            </FormControl>

            {id === '' && (
                <>
                    <FormControl px="4" mb="5">
                        <FormControl.Label>Lösenord</FormControl.Label>
                        <Input
                            borderRadius="8"
                            borderColor="#ff7e1a"
                            placeholder="Lösenord"
                            borderWidth={1}
                            value={password}
                            _focus={{
                                borderColor: "#ff7e1a"
                            }}
                            onChangeText={setPassword}
                            autoCompleteType="password"
                            secureTextEntry={!passVisible}
                            InputLeftElement={<Icon as={<FontAwesome name="lock" />} size="sm" m={2}
                                color="#ff7e1a" />}
                            InputRightElement={<Icon as={<FontAwesome name={passVisible ? "eye" : "eye-slash"} />} onPress={() => setPassVisible(!passVisible)} size="sm" m={2}
                                color="#bdbcb9" />}
                        />
                    </FormControl>
                    {/* <FormControl px="4" mb="5">
                        <FormControl.Label>Bekräfta lösenordet</FormControl.Label>
                        <Input
                            borderRadius="8"
                            borderColor="#ff7e1a"
                            placeholder="Bekräfta lösenordet"
                            borderWidth={1}
                            _focus={{
                                borderColor: "#ff7e1a"
                            }}
                            value={passConfirm}
                            onChangeText={setPassConfirm}
                            autoCompleteType="password"
                            secureTextEntry={!passConfVisible}
                            InputLeftElement={<Icon as={<FontAwesome name="lock" />} size="sm" m={2}
                                color="#ff7e1a" />}
                            InputRightElement={<Icon as={<FontAwesome name={passConfVisible ? "eye" : "eye-slash"} />} onPress={() => setPassConfVisible(!passConfVisible)} size="sm" m={2}
                                color="#bdbcb9" />}
                        />
                    </FormControl> */}
                </>
            )}



            <Collapse isOpen={stage1Error.length > 0}>
                <Alert status="error">
                    <HStack space={4}>
                        <Alert.Icon />
                        <Heading size="sm">Fel</Heading>
                        <Text>{stage1Error}</Text>
                        <IconButton icon={<CloseIcon size="xs" />} onPress={() => setStage1Error('')} />
                    </HStack>
                </Alert>
            </Collapse>
        </SafeScrollView>;

    const part2 = <>
        <SafeScrollView flex={1} bg="gray.100" justifyContent="center">
            <FormControl bg="gray.100" px="4" mb="5">
                <FormControl.Label>Telefonnummer</FormControl.Label>
                <Input
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Telefonnummer"
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    borderWidth={1}
                    InputLeftElement={<Icon as={<FontAwesome name="phone" />} size="sm" m={2}
                        color="#ff7e1a" />}
                />
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>Län</FormControl.Label>
                <Select
                    selectedValue={county}
                    onValueChange={setCounty}
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    _selectedItem={{ bg: "brand.300", endIcon: <CheckIcon size={4} /> }}>
                    {myData.map(({ code, name }) => <Select.Item key={code} label={name} value={code} />)}
                </Select>
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>Stad</FormControl.Label>
                <Select
                    selectedValue={city}
                    onValueChange={setCity}
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    borderWidth={1}
                    _selectedItem={{ bg: "brand.300", endIcon: <CheckIcon size={4} /> }}>
                    {myData.find(c => c.code === county).cities.map((city, i) => {
                        return <Select.Item key={i} label={city} value={city} />;
                    })}
                </Select>
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>Postnummer</FormControl.Label>
                <Input
                    value={postalCode}
                    onChangeText={setPostalCode}
                    placeholder="Postnummer"
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    borderWidth={1}
                />
            </FormControl>
            <FormControl px="4" mb="5">
                <FormControl.Label>Gatuadress</FormControl.Label>
                <Input
                    value={street}
                    onChangeText={setStreet}
                    placeholder="Gatuadress"
                    _focus={{
                        borderColor: "#ff7e1a"
                    }}
                    borderRadius="8"
                    borderColor="#ff7e1a"
                    borderWidth={1}
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

            <Text flex={1} textAlign="center">Genom att gå vidare godkänner du våra<Link href="https://cleangig.se/privacy.html" _text={{ textDecoration: 'none', fontWeight: 'bold' }}  > avtal</Link></Text>
            {/* <Text textAlign="center">By creating an account, you agree to the<Link href="https://cleangig.se/privacy.html" _text={{ textDecoration: 'none', fontWeight: 'bold' }}  > Terms of Use.</Link></Text> */}
        </SafeScrollView>
    </>;

    return (
        <VStack safeArea flex={1}>
            {/* <SafeScrollView flex={1}> */}
            {/* <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                h={{
                    base: "705px",
                    lg: "auto",
                }}
                flex={1}
            > */}
            <VStack flex={1} justifyContent="space-between">
                <VStack >
                    <VStack alignItems="center" mt="5">
                        <Heading mb="3" fontWeight="semibold">Registrering</Heading>
                        {/* <Text fontSize="sm">Please fill this information</Text> */}
                    </VStack>
                </VStack>
                {stage === 1 ? part1 : part2}
                <VStack >
                    <HStack borderColor="#ff7e1a" borderBottomWidth={1} borderTopWidth={1} mt="5">
                        {
                            stage === 1
                                ? < Button flex={1} py="4" borderRightColor="#ff7e1a" borderRightWidth={1} onPress={() => navigation.goBack()} variant="ghost">Logga in</Button>
                                : <Button flex={1} py="4" variant="ghost" borderRightColor="#ff7e1a" borderRightWidth={1} onPress={() => setStage(1)} >Tillbaka</Button>
                        }
                        {
                            stage === 1
                                ? <Button flex={1} py="4" variant="ghost" onPress={validateStage1} >Nästa</Button>
                                : <Button flex={1} py="4" colorScheme='secondary' backgroundColor='orange.400' onPress={validateStage2} isLoading={submitting} isLoadingText="Laddar, vänta..." >Skapa konto</Button>
                        }
                    </HStack>
                </VStack>
            </VStack>
            {/* </KeyboardAvoidingView > */}
            {/* </SafeScrollView> */}
        </VStack >
    )
}