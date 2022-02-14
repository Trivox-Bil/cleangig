import React, { useEffect, useState } from 'react';
import { Box, FlatList, Image, Pressable, VStack } from 'native-base';
import { cleangigApi } from "../network";
import voca from "voca";
import { useSelector } from "react-redux";
import services from "../data/services";

const PortFolio = ({providerId, openDetailPage, refresh}) => {
    const [portfolios, setPortfolios] = useState();

/*     useEffect(() => {
        fatchPortfolio().then();
    }, []); */

    useEffect(() => {
        fatchPortfolio().then();
    }, [refresh]);

    const fatchPortfolio = async () => {
        const { data: result } = await cleangigApi.get(`providers/${providerId}/portfolios`);
        result.portfolios.map(item => {
            item.picture_url = JSON.parse(voca.unescapeHtml(item.picture_url));
            item.services = JSON.parse(voca.unescapeHtml(item.services));
            item.servicesNames = [];
            services.forEach(service => {
                if (item.services.includes(service.id)) {
                    item.servicesNames.push(service.name)
                }
            })
        });
        setPortfolios(result.portfolios);
    }

/*     const openDetailPage = (item) => {
        
        navigation.navigate("PortfolioDetails", { portFolio: item });
    } */

    const ListItem = ({ item }) => (
        <Pressable flex={1} mx="2" h={150} mb="4"  onPress={() => openDetailPage(item)}>
            {/* <Box ></Box> */}
            {console.log(item.picture_url)}
            <Image flex={1} rounded="lg" source={{ uri: item.picture_url[0] }} alt="portfolio_pic" />
        </Pressable>
    )

    return (
        <VStack safeArea my="3" mx="1" >
            
            <FlatList
                mt="3"
                mb="100"
                nestedScrollEnabled={true}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                data={portfolios}
                renderItem={ListItem}
                keyExtractor={item => item.id}
            >
            </FlatList>
        </VStack>
    );
}

export default PortFolio;