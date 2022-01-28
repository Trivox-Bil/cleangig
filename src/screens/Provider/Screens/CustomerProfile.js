import React, {useEffect, useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import counties from '../../../data/counties';
import {Button, Card, Divider, Image, ListItem, Text} from 'react-native-elements';
import {colors, formatOrgNumber} from '../../../helpers';
import {cleangigApi} from "../../../network";
import AppBar from "../../../components/AppBar";

export default function ({navigation, route}) {
    const custmerId = route.params.customer;
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null);

    const fatchCustomer = async () => {
        setLoading(true);
        const {data: result} = await cleangigApi.get(`customers/${custmerId}`);
        console.log("customer", result)
        setCustomer(result);
        setLoading(false);
    };

    
    useEffect(() => {
        fatchCustomer();
    }, []);

    return <>
        <AppBar screenTitle="Kund" navigation={navigation} backButton/>
        <ScrollView
            contentContainerStyle={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={loading}
                    onRefresh={fatchCustomer}
                />
            }>
                {console.log("html",customer)}
            {customer && <>
                <Card wrapperStyle={{flexDirection: 'row'}}>
                    <Image
                        source={{uri: customer.picture}}
                        resizeMode="cover"
                        style={{height: 100, width: 100, borderRadius: 50}}/>
                    <View style={{marginLeft: 20, marginTop: 10}}>
                        <Text style={{fontSize: 18, fontWeight: 'bold', color: colors.blue}}>{customer.fname} {customer.lname}</Text>
                        <Text style={{marginTop: 5}}>{customer.email}</Text>
                        <Text>+46 {customer.phone_number}</Text>
                        <Text>{customer.county && counties.length ? Array.from(counties).find(c => c.code === customer.county.toUpperCase())?.name : (
                            <Text style={{fontStyle: 'italic', color: '#777'}}>Plats har inte ställts in</Text>)}</Text>
                    </View>
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
