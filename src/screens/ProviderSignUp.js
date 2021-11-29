import React, {useState} from 'react';
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
    Text,
    VStack
} from "native-base";
import validator from "validator";
import {cleangigApi} from "../network";
import {useDispatch, useSelector} from "react-redux";
import {login} from "../actions/user";
import {resetRoute} from "../helpers";

export default function ({navigation}) {
    const pushToken = useSelector(state => state.notification.pushToken);
    const [stage, setStage] = useState(1);
    const [businessName, setBusinessName] = useState('');
    const [contactName, setContactName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passConfirm, setPassConfirm] = useState('');
    const [orgNumber, setOrgNumber] = useState('');
    const [insurance, setInsurance] = useState(false);
    const [terms, setTerms] = useState(false);
    const [stage1Error, setStage1Error] = useState('');
    const [stage2Error, setStage2Error] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const dispatch = useDispatch();

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
            const {data: response} = await cleangigApi.post('providers', request);
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

    const part1 = <VStack bg="#fff" p={4} space={2} m={5} rounded="md" shadow={2}>
        <FormControl isRequired>
            <FormControl.Label>Ditt företags namn</FormControl.Label>
            <Input value={businessName} onChangeText={setBusinessName}/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>Konto ägare</FormControl.Label>
            <Input value={contactName} onChangeText={setContactName} autoCompleteType="name"/>
        </FormControl>
        <FormControl isRequired>
            <FormControl.Label>Organisationsnummer</FormControl.Label>
            <Input value={orgNumber} onChangeText={setOrgNumber} keyboardType="numeric"/>
        </FormControl>
        <FormControl>
            <Checkbox value={insurance} onChange={setInsurance}>Försäkring?</Checkbox>
        </FormControl>

        <Collapse isOpen={stage1Error.length > 0}>
            <Alert status="error">
                <HStack space={4} flexWrap="wrap">
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
                <Text fontSize="md">{businessName}</Text>
                <Text fontSize="md">{contactName}</Text>
                <Text fontSize="md">{orgNumber}</Text>
                <Text fontSize="md">Försäkring - {insurance ? 'Ja' : 'Nej'}</Text>
                <Text fontSize="md">{email}</Text>
            </VStack>
            <Divider orientation="vertical" mx={2} bg="brand.700"/>
            <Button variant="ghost" colorScheme="brand" onPress={() => setStage(1)}>Ändra</Button>
        </HStack>

        <VStack bg="#fff" p={4} space={2} m={5} rounded="md" shadow={2}>
            <FormControl isRequired>
                <FormControl.Label>E-post adress</FormControl.Label>
                <Input value={email} onChangeText={setEmail} autoCompleteType="email"/>
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

            <Button colorScheme="brand" disabled={stage2Error.length} isLoading={submitting} onPress={validateStage2}
                    isLoadingText="Laddar, vänta..." alignSelf="stretch" _disabled={{bg: 'light.300'}}>
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
                <Heading size="md">Registrering av företag</Heading>
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
                <Link onPress={() => navigation.replace('CustomerSignUp')}>Registrera dig som privatperson</Link>
            </Center>
        </VStack>
    </SafeScrollView>;
}
