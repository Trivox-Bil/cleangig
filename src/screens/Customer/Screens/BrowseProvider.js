import React, { useEffect, useState, useRef } from 'react';
import { Image, Platform, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { BottomSheet, Button, ListItem, SearchBar, Text } from 'react-native-elements';
import { Icon, IconButton, VStack } from 'native-base';
import counties, { county } from "../../../data/counties";
import services from "../../../data/services";
import { sotApi } from "../../../network";
import SafeScrollView from "../../../components/SafeScrollView";
import { Picker } from "@react-native-picker/picker";
import AppBar from "../../../components/AppBar";
import { FontAwesome5 } from "@expo/vector-icons";
import { providerCountyName } from '../../../helpers';

export default function ({ route, navigation }) {
    const [loading, setLoading] = useState(false);
    const [providers, setProviders] = useState([]);
    const [filterLocation, setFilterLocation] = useState(false);
    const [filterService, setFilterService] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [searchToken, setSearchToken] = useState('');
    const [searching, setSearching] = useState(false);
    const selectedProviders = useRef({ ...route.params?.selectedProviders });

    let filter = {
        location: null,
        service: null,
    };

    const filterOptions = [
        {
            title: 'Plats',
            component: (
                <Picker selectedValue={filterLocation} style={{ flex: 1 }} onValueChange={setFilterLocation}>
                    <Picker.Item label="Alla platser" value={null} />
                    {counties.map((item, index) => <Picker.Item label={item.name} value={item.code} key={index} />)}
                </Picker>
            ),
        },
        {
            title: 'Tjänster',
            component: (
                <Picker selectedValue={filterService} style={{ flex: 1 }} onValueChange={setFilterService}>
                    <Picker.Item label="Alla tjänster" value={false} />
                    {services.map((item, index) => (
                        <Picker.Item label={item.name} value={item.id} key={index} />
                    ))}
                </Picker>
            ),
        },
    ];

    const resetFilter = () => {
        filter = {
            location: null,
            service: null,
        };
        setFilterLocation(false);
        setFilterService(false);
        setShowFilter(false);
    }

    const searchProviders = async () => {
        setSearching(true);
        const result = await sotApi.get(`providers/search?token=${searchToken}`);
        if (result.success) {
            formatProviders(result.providers)
            // setProviders(result.providers);
            // setSearching(false);
        }
    }

    const fetchProviders = async () => {
        setLoading(true);
        const { location, service } = filter;
        const { data } = await sotApi.get(`providers/get_all?location=${location || ''}&service=${service || ''}`);
        formatProviders(data.providers)
        // setProviders(result.providers);
        // setSearching(false);

    }

    const formatProviders = (providers) => {
        providers.forEach(provider => {
            if (!!selectedProviders.current[provider.id]) {
                provider.selected = true
            } else {
                provider.selected = false
            }
        });
        setProviders(providers);
        setLoading(false);
    }

    const selectProvider = (provider) => {

        if (!provider.selected) {
            selectedProviders.current[provider.id] = provider
        } else {
            delete selectedProviders.current[provider.id]
            // selectedProviders.current = selectedProviders.current.filter(item => item.id != provider.id)
        }
        // console.log(selectedProviders.current)
        let temp = [...providers];
        temp.forEach(item => { item.id === provider.id ? item.selected = !item.selected : null });
        setProviders(temp)
    }

    const closeModal = () => {
        route.params.setSelectedProviders(selectedProviders.current);
        navigation.goBack();
    }

    useEffect(() => {
        fetchProviders().then();
    }, []);

    return (<>
        <AppBar
            backButton
            navigation={navigation}
            screenTitle="välj företag"
            customOptions={[{ action: closeModal, icon: 'check' }]}
        />

        <SafeScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={fetchProviders} />
            }>
            <VStack safeArea>
                <SearchBar
                    placeholder="Sök"
                    platform={Platform.OS}
                    onChangeText={setSearchToken}
                    value={searchToken}
                    showLoading={searching}
                    onSubmitEditing={searchProviders}
                />
                <Button title="Filtrera" titleStyle={{ color: '#ff7000' }} type="clear"
                    onPress={() => setShowFilter(true)} />
                {filter.location && <Text style={{
                    color: '#ff7000',
                    fontSize: 14,
                    textAlign: 'center'
                }}>Län: {county(filterLocation).name}</Text>}

                <View style={styles.mainBody}>
                    {providers.map((provider, i) => (
                        <ListItem key={i}
                            onPress={() => navigation.push('ProviderProfile', { provider: provider.id })}>
                            <Image
                                source={{ uri: provider.picture }}
                                style={{ width: 50, height: 50, borderRadius: 25, marginHorizontal: 10 }} />
                            <ListItem.Content>
                                <ListItem.Title>{provider.name}</ListItem.Title>
                                <ListItem.Subtitle>{provider.county_code ? providerCountyName(provider.county_code) : 'Plats ej specificerad'}</ListItem.Subtitle>
                            </ListItem.Content>
                            <IconButton onPress={() => selectProvider(provider)}
                                icon={<Icon as={<FontAwesome5 name={`${provider.selected ? "check-circle" : "circle"}`} />} size="sm" color="light.400" />} />
                        </ListItem>
                    ))}
                </View>
            </VStack>
        </SafeScrollView>
        <BottomSheet
            isVisible={showFilter}
            containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
            <View style={{ backgroundColor: '#fff', padding: 10 }}>
                {filterOptions.map((option, i) => (
                    <View key={i} style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontWeight: 'bold', width: 100 }}>{option.title}</Text>
                        {option.component}
                    </View>
                ))}
                <Button
                    title="Välj"
                    buttonStyle={{ backgroundColor: '#ff7000' }}
                    titleStyle={{ color: '#fff' }}
                    onPress={() => {
                        filter.location = filterLocation;
                        filter.service = filterService;
                        setShowFilter(false);
                        fetchProviders();
                    }}
                />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Button
                        title="Avbryt"
                        type="clear"
                        titleStyle={{ color: '#ff7000' }}
                        onPress={() => setShowFilter(false)}
                    />
                    <Button
                        title="Återställa"
                        type="clear"
                        titleStyle={{ color: '#ff7000' }}
                        onPress={resetFilter}
                    />
                </View>
            </View>
        </BottomSheet>
    </>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
});
