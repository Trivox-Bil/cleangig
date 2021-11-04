import React, {useState} from 'react';
import {Button, Center, FormControl, Heading, HStack, Icon, Image, Input, Radio, Text, VStack} from 'native-base';
import SafeScrollView from "../components/SafeScrollView";
import {FontAwesome5} from "@expo/vector-icons";

export default function ({navigation}) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userType, setUserType] = useState('private');

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
                           InputLeftElement={<Icon as={<FontAwesome5 name="envelope"/>} size="sm" m={2} color="light.700"/>}/>
                </FormControl>
                <FormControl>
                    <Input value={password} onChangeText={setPassword} autoCompleteType="password" secureTextEntry
                           placeholder="Lösenord"
                           InputLeftElement={<Icon as={<FontAwesome5 name="lock"/>} size="sm" m={2} color="light.700"/>}/>
                </FormControl>
                <Button _text={{color: 'white'}}>Logga in</Button>
            </VStack>

            <VStack bg="light.200" space={2} mb={4} rounded="md" p={4}>
                <Heading size="sm">Registrera dig som...</Heading>

                <VStack space={2}>
                    <Button _text={{color: 'white'}} onPress={() => navigation.navigate('CustomerSignUp')}>Privatperson</Button>
                    <Button _text={{color: 'white'}}>Företag</Button>
                </VStack>
            </VStack>
        </VStack>
    </SafeScrollView>;
}