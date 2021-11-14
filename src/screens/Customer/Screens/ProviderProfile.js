import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import counties from '../../../data/counties';
import {Button, Card, Divider, Image, ListItem, Text} from 'react-native-elements';
import {colors, formatOrgNumber} from '../../../helpers';
import {sotApi} from "../../../network";
import AppBar from "../../../components/AppBar";

export default function ({navigation, route}) {
    const providerId = route.params.provider;

    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [pastWorks, setPastWorks] = useState([]);
    const [ratings, setRatings] = useState([]);

    const fetchProvider = async () => {
        setLoading(true);
        const {data: result} = await sotApi.get(`providers/read?id=${providerId}`);
        setLoading(false);
        result.success && setProvider(result);
        setLoading(false);
    };

    async function fetchServices() {
        const {data} = await sotApi.get(`services/get_all?provider=${providerId}`);
        setServices(data.services);
    }

    async function fetchRatings() {
        const {data} = await sotApi.get(`providers/ratings?provider=${providerId}`);
        setRatings(data.ratings);
    }

    const fetchPastWorks = async () => {
        const {data: result} = await sotApi.get(`providers/past-works?provider=${providerId}`);
        if (result.success === "1") {
            setPastWorks(result.past_works);
        }
    }

    useEffect(() => {
        fetchProvider();
        fetchPastWorks();
        fetchServices();
        fetchRatings();
    }, []);

    return <>
        <AppBar screenTitle="Leverantör" navigation={navigation} backButton/>
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fetchProvider}
                />
            }>
            {provider && <>
                <Card wrapperStyle={{flexDirection: 'row'}}>
                    <Image
                        source={{uri: provider.picture}}
                        resizeMode="cover"
                        style={{height: 100, width: 100, borderRadius: 50}}/>
                    <View style={{marginLeft: 20, marginTop: 10}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.blue}}>{provider.name}</Text>
                        <Text
                            style={{color: colors.blue}}>{provider.organisation_number ? formatOrgNumber(provider.organisation_number) : (
                            <Text style={{fontStyle: 'italic', color: '#777'}}>Organisationsnummer
                                saknas</Text>)}</Text>
                        <Text style={{marginTop: 5}}>{provider.email}</Text>
                        <Text>+46 {provider.phone_number}</Text>
                        <Text>{provider.county_code && counties.length ? Array.from(counties).find(c => c.code === provider.county_code).name : (
                            <Text style={{fontStyle: 'italic', color: '#777'}}>Plats har inte ställts in</Text>)}</Text>
                        <Text>Försäkring - {provider.insurance ? 'Ja' : 'Nej'}</Text>
                    </View>
                </Card>

                <Card>
                    <Card.Title>Företagsbeskrivning</Card.Title>
                    <Card.Divider/>
                    {!! provider.description
                        ? <Text style={{marginTop: 5, paddingLeft: 20}}>{provider.description}</Text>
                        : <Text style={{textAlign: 'center', color: colors.gray}}>Inget att visa</Text>
                    }

                </Card>
                <Card>
                    <Card.Title>Tidigare arbete</Card.Title>
                    <Card.Divider/>
                    {!!pastWorks.length && (
                        <ScrollView contentContainerStyle={{height: 250}} horizontal={true}>
                            {pastWorks.map(({service, picture_url}, i) => (
                                <View style={{padding: 5}} key={i}>
                                    <Image
                                        source={{uri: picture_url}}
                                        key={i}
                                        style={{width: 250, height: 250}}
                                        resizeMode="stretch"
                                    />
                                    <Text style={styles.imageCaption}>{service}</Text>
                                </View>   
                            ))}
                        </ScrollView>
                    )}
                    {pastWorks.length < 1 && (
                        <Text style={{textAlign: 'center', color: colors.gray}}>Inget att visa</Text>
                    )}
                </Card>

                <Card>
                    <Card.Title>Recensioner</Card.Title>
                    <Card.Divider/>
                    {ratings.map(({cp_rating, cp_review, customer}, i) => (
                        <View key={i}>
                            <Text style={{fontWeight: 'bold'}}>{customer} - {cp_rating}/5</Text>
                            <Text style={{fontStyle: 'italic'}}>{cp_review}</Text>
                            <Divider style={{marginVertical: 10}}/>
                        </View>
                    ))}
                    {ratings.length < 1 && (
                        <Text style={{textAlign: 'center', color: colors.gray}}>Inget att visa</Text>
                    )}
                </Card>
            </>}
        </ScrollView>
    </>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    imageCaption: {
        width: '100%',
        padding: 10,
        textAlign: 'center',
        fontSize: 18,
        color: '#ccc',
        backgroundColor: '#777777cc',
        position: 'absolute',
        left: 5,
        bottom: 0,
    },
});
