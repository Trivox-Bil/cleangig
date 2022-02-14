import { Heading, ScrollView, Text, HStack } from 'native-base';
import React from 'react';
import AppBar from "../../../components/AppBar";
import ImageCarousel from "../../../components/ImageCarousel";

const PortfolioDetails = ({ navigation, route }) => {
  const portFolio = route.params.portFolio || null;
    const pictures = [];

    return (
        <>
            <AppBar backButton navigation={navigation} screenTitle="Portfolio Details" customOptions={[]} />
            <ScrollView mx="3" my="3">
                <Heading>{portFolio?.title}</Heading>
                <Text>{portFolio?.servicesNames.join(", ")}</Text>

                {portFolio?.picture_url.length > 0 && (
                <>
                  <HStack minH={200} ml={5} my={10}>
                    <ImageCarousel
                      images={portFolio?.picture_url}
                    />
                  </HStack>
                </>
              )}

                <Text>{portFolio?.content}</Text>
            </ScrollView>
        </>
    );
}

export default PortfolioDetails;
