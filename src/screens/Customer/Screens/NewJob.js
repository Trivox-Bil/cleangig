import React, {useState} from 'react';
import AppBar from "../../../components/AppBar";
import {Button, Center, FormControl, HStack, Input, Pressable, Select, Text, VStack} from "native-base";
import {useSelector} from "react-redux";
import counties from "../../../data/counties";
import addDays from 'date-fns/addDays';
import DatePicker from "../../../components/DatePicker";
import {cleangigApi} from "../../../network";
import {CheckBox} from "react-native-elements";
import SafeScrollView from "../../../components/SafeScrollView";
import ImageCarousel from "../../../components/ImageCarousel";
import format from "date-fns/format";

export default function ({route, navigation}) {
    const service = useState(route.params.service)[0];
    const user = useSelector(state => state.user.data);
    const [title, setTitle] = useState(route.params.title || '');
    const [description, setDescription] = useState(route.params.description || '');
    const [pictures, setPictures] = useState(route.params.photos || []);
    const [editAddress, setEditAddress] = useState(false);
    const [street, setStreet] = useState(route.params.street || user.street);
    const [city, setCity] = useState(route.params.city || user.city);
    const [county, setCounty] = useState(route.params.county || counties.find(c => c.code === user.county));
    const [deadlineFrom, setDeadlineFrom] = useState(route.params.deadlineFrom || addDays(new Date(), 7));
    const [deadlineTo, setDeadlineTo] = useState(route.params.deadlineTo || addDays(new Date(), 14));
    const [visibility, setVisibility] = useState(route.params.visibility || 'public');
    const [loading, setLoading] = useState(false);

    function choosePictures() {
        navigation.navigate(
            'ImageBrowser',
            {
                job: {
                    title,
                    description,
                    deadlineFrom,
                    deadlineTo,
                    service,
                    editAddress,
                    street,
                    city,
                    county,
                    visibility
                }
            }
        );
    }

    async function create() {
        try {
            setLoading(true);
            const pics = await uploadPictures();
            const request = new FormData();
            request.append('customer', user.id);
            request.append('service', service.id);
            request.append('county', county.code);
            request.append('street', street);
            request.append('city', city);
            request.append('title', title);
            request.append('description', description);
            request.append('deadline_begin', format(deadlineFrom, 'yyyy-MM-dd HH:mm:ss'));
            request.append('deadline_end', format(deadlineTo, 'yyyy-MM-dd HH:mm:ss'));
            request.append('visibility', visibility);
            request.append('pictures', JSON.stringify(pics));
            const {data} = await cleangigApi.post('/jobs', request, {
                transformRequest: [data => data],
            });
            if (data.id) {
                navigation.replace('Customer', {
                    screen: 'Job',
                    params: {screen: 'Job', params: {id: data.id}},
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function uploadPictures() {
        const request = new FormData();
        pictures.forEach(pic => request.append('files[]', pic));
        const {data} = await cleangigApi.post('files', request);

        return data.files;
    }

    return <>
        <AppBar backButton navigation={navigation} screenTitle="Skapa nytt jobb"/>

        <SafeScrollView flex={1}>
            <VStack space={2} m={4}>
                <Center bg="accent.400" p={4} rounded="lg">
                    <Text>Enbart Swish används som betalningsalternativ</Text>
                </Center>

                <FormControl>
                    <Input editable={false} value={service.name}/>
                </FormControl>

                <FormControl isRequired>
                    <FormControl.Label>Rubrik</FormControl.Label>
                    <Input value={title} onChange={setTitle}/>
                </FormControl>

                <FormControl isRequired>
                    <FormControl.Label>Beskrivande text</FormControl.Label>
                    <Input value={description} onChange={setDescription} multiline numberOfLines={4}/>
                </FormControl>

                {pictures.length > 0 && (
                    <>
                        <HStack minH={200} ml={5} my={10}>
                            <ImageCarousel images={pictures.map(pic => pic.uri)}/>
                        </HStack>
                        <Button variant="subtle" onPress={() => setPictures([])}>Ta bort bilder</Button>
                    </>
                )}

                <Pressable bg="light.200" p={4} alignItems="center" rounded="md" _pressed={{bg: 'dark.700'}}
                           onPress={choosePictures}>
                    <Text fontSize="md">Lägg till bilder</Text>
                </Pressable>

                {editAddress ? (
                    <>
                        <FormControl>
                            <FormControl.Label>Län</FormControl.Label>
                            <Select value={county.name} onValueChange={setCounty} selectedValue={county}>
                                {counties.map(county => {
                                    return <Select.Item label={county.name} value={county} key={county.code}/>;
                                })}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormControl.Label>Stad</FormControl.Label>
                            <Select selectedValue={city} onValueChange={setCity}>
                                {county.cities.map((city, i) => {
                                    return <Select.Item label={city} value={city} key={i}/>;
                                })}
                            </Select>
                        </FormControl>

                        <FormControl isRequired>
                            <FormControl.Label>Gatuadress</FormControl.Label>
                            <Input value={street} onChange={setStreet} autoComplete="street-address"/>
                        </FormControl>
                    </>
                ) : (
                    <Pressable bg="light.200" p={4} alignItems="center" rounded="md" _pressed={{bg: 'dark.700'}}
                               onPress={() => setEditAddress(true)}>
                        <Text>{user.street}, {user.city}, {county ? county.name : 'NA'}</Text>
                    </Pressable>
                )}

                <FormControl>
                    <FormControl.Label>När vill du ha jobbet utfört?</FormControl.Label>
                    <DatePicker value={deadlineFrom} onChange={setDeadlineFrom}/>
                    <Text style={{textAlign: 'center'}}>till</Text>
                    <DatePicker value={deadlineTo} onChange={setDeadlineTo}/>
                </FormControl>

                <FormControl>
                    <FormControl.Label>Synlighet</FormControl.Label>
                    <VStack>
                        <CheckBox title="Låt leverantörer svara mig" checkedIcon="dot-circle-o" uncheckedIcon="circle-o"
                                  checked={visibility === 'public'} checkedColor="#000"
                                  onPress={() => setVisibility('public')}/>
                        <CheckBox title="Jag vill välja en specifikt" checkedIcon="dot-circle-o"
                                  uncheckedIcon="circle-o"
                                  checked={visibility === 'private'} checkedColor="#000"
                                  onPress={() => setVisibility('private')}/>
                    </VStack>
                </FormControl>

                <Button _text={{color: 'light.200'}} my={5} onPress={create} isLoading={loading}
                        isLoadingText="Läser in...">
                    Skicka in
                </Button>
            </VStack>
        </SafeScrollView>
    </>;
}
