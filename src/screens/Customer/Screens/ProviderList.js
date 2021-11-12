import React, {useEffect, useState} from 'react';
import {Image, Picker, Platform, RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {BottomSheet, Button, ListItem, SearchBar, Text} from 'react-native-elements';
import counties from "../../../data/counties";
import services from "../../../data/services";
import axios from "axios";

export default function ({navigation}) {
    const [loading, setLoading] = useState(true);
    const [providers, setProviders] = useState([]);
    const [filterLocation, setFilterLocation] = useState(false);
    const [filterService, setFilterService] = useState(false);
    const [showFilter, setShowFilter] = useState(false);
    const [searchToken, setSearchToken] = useState('');
    const [searching, setSearching] = useState(false);

    let filter = {
        location: null,
        service: null,
    };

    const filterOptions = [
        {
            title: 'Plats',
            component: (
                <Picker
                    selectedValue={filterLocation}
                    style={{flex: 1}}
                    onValueChange={value => setFilterLocation(value)}
                >
                    <Picker.Item label="Alla platser" value={null} key={-1}/>
                    {counties.map((item, index) => {
                        return (
                            <Picker.Item label={item.name} value={item.code} key={index}/>
                        );
                    })
                    }
                </Picker>
            ),
        },
        {
            title: 'Tjänster',
            component: (
                <Picker
                    selectedValue={filterService}
                    style={{flex: 1}}
                    onValueChange={value => setFilterService(value)}
                >
                    <Picker.Item label="Alla tjänster" value={false} key={-1}/>
                    {services.map((item, index) => {
                        return (
                            <Picker.Item label={item.name} value={item.id} key={index}/>
                        );
                    })
                    }
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
        const result = await axios.get(`https://stadochtradgard.se/sot_api/providers/search?token=${searchToken}`);
        if (result.success) {
            setProviders(result.providers);
            setSearching(false);
        }
    }

    const fetchProviders = async () => {
        setLoading(true);
        const {location, service} = filter;
        const result = await axios.get(
            `https://stadochtradgard.se/sot_api/providers/get_all?location=${location||''}&service=${service||''}`
        );
        if (result.success) {
            setProviders(result.providers);
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchProviders().then();
    }, []);

    return (<>
            <ScrollView
                contentContainerStyle={styles.container}
                refreshControl={
                    <RefreshControl refreshing={loading} onRefresh={fetchProviders}/>
                }>
                <SearchBar
                    placeholder="Sök"
                    platform={Platform.OS}
                    onChangeText={value => setSearchToken(value)}
                    value={searchToken}
                    showLoading={searching}
                    onSubmitEditing={searchProviders}
                />
                <Button title="Filtrera" titleStyle={{color: colors.blue}} type="clear"
                        onPress={() => setShowFilter(true)}/>
                {filter.location && <Text style={{
                    color: colors.blue,
                    fontSize: 14,
                    textAlign: 'center'
                }}>Län: {counties.find(c => c.code === filterLocation).name()}</Text>}

                <View style={styles.mainBody}>
                    {providers.map(provider => (
                        <ListItem key={provider.id} bottomDivider
                                  onPress={() => navigation.push('ProviderProfile', {provider: provider.id})}>
                            <Image
                                source={{uri: provider.picture}}
                                style={{width: 50, height: 50, borderRadius: 25, marginHorizontal: 10}}/>
                            <ListItem.Content bottomDivider>
                                <ListItem.Title>{provider.name}</ListItem.Title>
                                <ListItem.Subtitle>{provider.insurance == 1 ? 'Försäkring' : 'Ingen försäkring'}</ListItem.Subtitle>
                                <ListItem.Subtitle>{provider.county_code ? countyName(counties, provider.county_code) : 'Plats ej specificerad'}</ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    ))}
                </View>
            </ScrollView>
            <BottomSheet
                isVisible={showFilter}
                containerStyle={{backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)'}}>
                <View style={{backgroundColor: '#fff', padding: 10}}>
                    {filterOptions.map((option, i) => (
                        <View key={i} style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text style={{fontWeight: 'bold', width: 100}}>{option.title}</Text>
                            {option.component}
                        </View>
                    ))}
                    <Button
                        title="Välj"
                        buttonStyle={{backgroundColor: colors.blue}}
                        titleStyle={{color: '#fff'}}
                        onPress={() => {
                            filter.location = filterLocation;
                            filter.service = filterService;
                            setShowFilter(false);
                            fetchProviders();
                        }}
                    />
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Button
                            title="Avbryt"
                            type="clear"
                            titleStyle={{color: '#846'}}
                            onPress={() => setShowFilter(false)}
                        />
                        <Button
                            title="Återställa"
                            type="clear"
                            titleStyle={{color: '#846'}}
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
