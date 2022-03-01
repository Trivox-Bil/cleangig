import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Heading, HStack, Image, Pressable, Text, VStack } from "native-base";
import counties from '../../../data/counties';
// import { Button, Card, Divider, Image, ListItem, Text } from 'react-native-elements';
import { colors, formatOrgNumber } from '../../../helpers';
import { cleangigApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import SafeScrollView from "../../../components/SafeScrollView";

export default function ({ navigation, route }) {
    const custmerId = route.params.customer;
    const [loading, setLoading] = useState(false);
    const [customer, setCustomer] = useState(null);
    const [activeTab, setActiveTab] = useState('profile');

    const fatchCustomer = async () => {
        setLoading(true);
        const { data: result } = await cleangigApi.get(`customers/${custmerId}`);
        console.log("customer", result)
        setCustomer(result);
        setLoading(false);
    };


    useEffect(() => {
        fatchCustomer();
    }, []);

    return <>
        <AppBar screenTitle="Kund" navigation={navigation} backButton />
        {
            customer &&
            <>
                <HStack mt="3" mx="3" justifyContent="center">
                    <Pressable
                        style={activeTab === 'profile' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                        onPress={() => setActiveTab('profile')}
                    >
                        <Text
                            style={activeTab === 'profile' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                        >Profil</Text>
                    </Pressable>
                    <Pressable
                        style={activeTab === 'review' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                        onPress={() => setActiveTab('review')}
                    >
                        <Text
                            style={activeTab === 'review' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                        >Omdömen</Text>
                    </Pressable>
                </HStack>

                {activeTab === 'profile' ? (
                    <SafeScrollView flex={1}>
                        <HStack m={4} justifyContent="center" space={2}>
                            <Image source={{ uri: customer?.picture }} w={100} h={100} rounded="full" alt=" " />
                        </HStack>

                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Name</Text>
                            <Text>{customer.fname} {customer.lname}</Text>
                        </VStack>
                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Email</Text>
                            <Text>{customer.email}</Text>
                        </VStack>
                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Telefonnummer</Text>
                            <Text>{customer.phone_number}</Text>
                        </VStack>
                        <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Address</Text>
                            <Text>{customer.street}, {customer.city}, {customer.county}, {customer.postalCode}</Text>
                        </VStack>

                    </SafeScrollView>
                ) : (
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Text style={{ color: colors.gray }}>Inget att visa</Text>
                    </VStack>
                )}
            </>
        }
    </>;
}

const styles = StyleSheet.create({
    tabs: {
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    activeTab: {
        backgroundColor: '#ff7e1a',
        borderRadius: 6,
    },
    tabTitle: {
        fontSize: 16,
        fontWeight: "600"
    },
    activeTabTitle: {
        color: "#ffffff"
    }
});
