import React, {useState, useEffect} from 'react';
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
    Input,
    Link,
    Progress,
    Select,
    Text,
    VStack
} from "native-base";
import counties from "../data/counties";
import validator from "validator";
import {cleangigApi} from "../network";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../actions/user";
import {resetRoute} from "../helpers";

export default function ({navigation}) {
    const pushToken = useSelector(state => state.notification.pushToken);
    const [stage, setStage] = useState(1);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [county, setCounty] = useState('AB');
    const [city, setCity] = useState('');
    const [street, setStreet] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [phone, setPhone] = useState('+46 ');
    const [terms, setTerms] = useState(false);
    const [stage1Error, setStage1Error] = useState('');
    const [stage2Error, setStage2Error] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('pushToken ===>>>', pushToken)
    }, [])

    function validateStage1() {
        if ([firstName, lastName, email, password, phone].some(field => field.trim() === '')) {
            setStage1Error('Vänligen ange alla obligatoriska fält');
        } else if (!validator.isEmail(email)) {
            setStage1Error('Ange en giltig e-postadress');
        } else if (password !== passConfirm) {
            setStage1Error('Lösenorden matchar inte');
        } else {
            setStage(2);
        }
    }

    function validateStage2() {
        if (city.length === 0) {
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
            request.append('first_name', firstName);
            request.append('last_name', lastName);
            request.append('email', email);
            request.append('password', password);
            request.append('street', street);
            request.append('city', city);
            request.append('county', county);
            request.append('phone_number', phone);
            request.append('postal_code', postalCode);
            const {data: response} = await cleangigApi.post('customers', request);
            if (response.success) {
                request.append('pushToken', pushToken);
                dispatch(login('private' ,request));
                navigation.dispatch(resetRoute('Customer'));
            } else {
                setStage2Error('Ett fel inträffade. Försök igen');
            }
        } catch (e) {
            console.error(e);
            setStage2Error('Ett fel inträffade. Försök igen');
        } finally {
            setSubmitting(false);
        }
    }

    const part1 = <VStack bg="#fff" p={4} space={2} m={5} rounded="md" shadow={2}>
        <FormControl isRequired>
            <FormControl.Label>Förnamn</FormControl.Label>
            <Input value={firstName} onChangeText={setFirstName} autoCompleteType="name"/>
        </FormControl>
        <FormControl>
            <FormControl.Label>Efternamn</FormControl.Label>
            <Input value={lastName} onChangeText={setLastName} autoCompleteType="name"/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>E-post adress</FormControl.Label>
            <Input value={email} onChangeText={setEmail} autoCompleteType="email"/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>Telefonnummer</FormControl.Label>
            <Input value={phone} onChangeText={setPhone} autoCompleteType="tel" keyboardType="numeric"/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>Lösenord</FormControl.Label>
            <Input value={password} onChangeText={setPassword} autoCompleteType="password" secureTextEntry/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>Bekräfta lösenordet</FormControl.Label>
            <Input value={passConfirm} onChangeText={setPassConfirm} autoCompleteType="password"
                   secureTextEntry/>
        </FormControl>

        <Collapse isOpen={stage1Error.length > 0}>
            <Alert status="error">
                <HStack space={4}>
                    <Alert.Icon/>
                    <Heading size="sm">Fel</Heading>
                    <Text>{stage1Error}</Text>
                    <IconButton icon={<CloseIcon size="xs"/>} onPress={() => setStage1Error('')}/>
                </HStack>
            </Alert>
        </Collapse>

        <Button _text={{color: '#fff'}} alignSelf="stretch" onPress={validateStage1}>
            Bekräfta
        </Button>
    </VStack>;

    const part2 = <>
        <HStack bg="accent.200" mt={0} m={5} p={3} rounded="xl" alignItems="center">
            <VStack flex={1} space={1}>
                <Text fontSize="md">{firstName} {lastName}</Text>
                <Text fontSize="md">{email}</Text>
                <Text fontSize="md">{phone}</Text>
            </VStack>
            <Divider orientation="vertical" mx={2} bg="brand.700"/>
            <Button variant="ghost" colorScheme="brand" onPress={() => setStage(1)}>Ändra</Button>
        </HStack>

        <VStack bg="#fff" p={4} space={2} m={5} rounded="md" shadow={2}>
            <FormControl isRequired>
                <FormControl.Label>Län</FormControl.Label>
                <Select selectedValue={county} onValueChange={setCounty}
                        _selectedItem={{bg: "brand.300", endIcon: <CheckIcon size={4}/>}}>
                    {counties.map(({code, name}) => <Select.Item key={code} label={name} value={code}/>)}
                </Select>
            </FormControl>
            <FormControl isRequired>
                <FormControl.Label>Stad</FormControl.Label>
                <Select selectedValue={city} onValueChange={setCity}
                        _selectedItem={{bg: "brand.300", endIcon: <CheckIcon size={4}/>}}>
                    {counties.find(c => c.code === county).cities.map((city, i) => {
                        return <Select.Item key={i} label={city} value={city}/>;
                    })}
                </Select>
            </FormControl>
            <FormControl>
                <FormControl.Label>Postnummer</FormControl.Label>
                <Input value={postalCode} onChangeText={setPostalCode}/>
            </FormControl>
            <FormControl>
                <FormControl.Label>Gatuadress</FormControl.Label>
                <Input value={street} onChangeText={setStreet} autoCompleteType="street-address"/>
            </FormControl>
            <FormControl>
                <Checkbox value={terms} onChange={setTerms} colorScheme="accent" my={4}>
                    <Link href="https://cleangig.se/privacy.html" mx={4}>Jag accepterar villkoren</Link>
                </Checkbox>
            </FormControl>

            <Collapse isOpen={stage2Error.length > 0}>
                <Alert status="error">
                    <HStack space={4} flexWrap="wrap">
                        <Alert.Icon/>
                        <Heading size="sm">Fel</Heading>
                        <Text>{stage2Error}</Text>
                        <IconButton icon={<CloseIcon size="xs"/>} onPress={() => setStage2Error('')}/>
                    </HStack>
                </Alert>
            </Collapse>

            <Button colorScheme="brand" isLoading={submitting} onPress={validateStage2} isLoadingText="Laddar, vänta..."
                    alignSelf="stretch">
                Slutföra registreringen
            </Button>
        </VStack>
    </>;

    return <SafeScrollView flex={1}>
        <VStack safeArea mb={100}>
            <VStack alignItems="center" my={4}>
                <Image source={require("../../assets/logo-small.png")} h={150} alt="CleanGig" resizeMode="center"/>
            </VStack>

            <VStack mx={2} mt={5} space={2} alignItems="center">
                <Heading size="md">Registrering av privatpersoner</Heading>
                <Center p="3">
                    <Link onPress={() => navigation.replace('Login')}>
                        Har du redan ett konto?
                        <Text bold color="brand.700"> Logga in</Text>
                    </Link>
                </Center>
            </VStack>

            <Center>
                <Progress size="2xl" my={4} value={stage * 50} w={200} colorScheme="brand"/>
            </Center>

            {stage === 1 ? part1 : part2}

            <Center>
                <Link onPress={() => navigation.replace('ProviderSignUp')}>Registrera dig som företag</Link>
            </Center>
        </VStack>
    </SafeScrollView>;
}