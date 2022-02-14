import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Heading, HStack, Image, Pressable, Text, VStack } from "native-base";
import counties from '../../../data/counties';
import SafeScrollView from "../../../components/SafeScrollView";
// import { Button, Card, Divider, Image, ListItem, Text } from 'react-native-elements';
import { colors, formatOrgNumber } from '../../../helpers';
import { sotApi } from "../../../network";
import AppBar from "../../../components/AppBar";
import PortFolio from '../../../components/Portfolio';

export default function ({ navigation, route }) {
    const providerId = route.params.provider;
    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);
    const [provider, setProvider] = useState(null);
    const [services, setServices] = useState([]);
    const [pastWorks, setPastWorks] = useState([]);
    const [ratings, setRatings] = useState([]);
    const [offeredServicesNames, setOfferedServicesName] = useState('');
    const [offeredServices, setOfferedServices] = useState([]);

    const fetchProvider = async () => {
        setLoading(true);
        const { data: result } = await sotApi.get(`providers/read?id=${providerId}`);
        setLoading(false);
        result.success && setProvider(result);
        setLoading(false);
    };

    async function fetchServices() {
        const { data } = await sotApi.get(`services/get_all?provider=${providerId}`);
        let serviceName = [];
        data.services.map(service => serviceName.push(service.name));
        setOfferedServicesName(serviceName.join(", "))
        setOfferedServices(data.services);
    }

    useEffect(() => {
        fetchProvider();
        fetchServices();
    }, []);

    const openPortfolioDetailPage = (item) => {
        console.log(item)
        navigation.push("PortfolioDetails", { portFolio: item });
    }

    return <>
        <AppBar screenTitle="Leverantör" navigation={navigation} backButton />

        {
            provider && <>
                <HStack mt="3" mx="3" justifyContent="center">
                    <Pressable
                        style={activeTab === 'profile' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                        onPress={() => setActiveTab('profile')}
                    >
                        <Text
                            style={activeTab === 'profile' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                        >Profile</Text>
                    </Pressable>
                    <Pressable
                        style={activeTab === 'review' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                        onPress={() => setActiveTab('review')}
                    >
                        <Text
                            style={activeTab === 'review' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                        >Reviews</Text>
                    </Pressable>
                    <Pressable
                        style={activeTab === 'portfolio' ? { ...styles.tabs, ...styles.activeTab } : { ...styles.tabs }}
                        onPress={() => setActiveTab('portfolio')}
                    >
                        <Text
                            style={activeTab === 'portfolio' ? { ...styles.tabTitle, ...styles.activeTabTitle } : { ...styles.tabTitle }}
                        >Portfolio</Text>
                    </Pressable>
                </HStack>

                {activeTab === 'profile' ? (
                    <SafeScrollView flex={1}>
                        <HStack m={4} justifyContent="center" space={2}>
                            <Pressable >
                                <Image source={{ uri: provider.picture }} w={100} h={100} rounded="full" alt=" " />
                            </Pressable>
                        </HStack>

                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Name</Text>
                            <Text>{provider.name}</Text>
                        </VStack>
                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Description</Text>
                            <Text>{provider.description}</Text>
                        </VStack>
                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Email</Text>
                            <Text>{provider.email}</Text>
                        </VStack>
                        <VStack px="3" pb="3" mb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Telefonnummer</Text>
                            <Text>{provider.contact}</Text>
                        </VStack>
                        <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Plats</Text>
                            <Text>{provider.county_code}</Text>
                        </VStack>
                        <VStack px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
                            <Text mb={1} fontWeight="semibold" color="#ff7e1a">Tjänster</Text>
                            <Text>{offeredServicesNames}</Text>
                        </VStack>
                    </SafeScrollView>
                ) : activeTab === 'review' ? (
                    <VStack flex={1} justifyContent="center" alignItems="center">
                        <Text style={{ color: colors.gray }}>Inget att visa</Text>
                    </VStack>
                ) : (
                    <>
                        <PortFolio providerId={providerId} openDetailPage={openPortfolioDetailPage} />
                    </>
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
})