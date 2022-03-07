import React from 'react';
import { FlatList, Image, VStack, Text, HStack } from 'native-base';
import { AirbnbRating } from 'react-native-ratings';
import { colors } from '../helpers';

const Reviews = ({ reviews }) => {

    const ListItem = ({ item }) => (
        <VStack mb="5" px="3" pb="3" borderBottomColor="#cccccc" borderBottomWidth="1">
            <HStack alignItems="center" mb="5">
                <Image
                    source={{ uri: item.picture }}
                    alt="profile-pic"
                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }} />
                <VStack justifyContent="center">
                    <Text> { item.reviewer==='0' ? item.name : `${item.fname} ${item.lname}` }</Text>
                    <AirbnbRating
                        showRating={false}
                        isDisabled={true}
                        count={5}
                        defaultRating={item.rating}
                        selectedColor="#ff7e1a"
                        size={20}
                        starContainerStyle={{
                            alignSelf: "flex-start",
                            padding: 0
                        }}
                    />
                </VStack>
            </HStack>

            <Text>{item.comment}</Text>
        </VStack>
    )

    return <>
        {
            reviews.length > 0 ? (
                <VStack safeArea my="3" mx="1" >
                    <FlatList
                        mt="3"
                        mb="100"
                        nestedScrollEnabled={true}
                        data={reviews}
                        renderItem={ListItem}
                        keyExtractor={item => item.id}
                    >
                    </FlatList>
                </VStack>
            ) : (
                <VStack flex={1} justifyContent="center" alignItems="center" >
                    <Text style={{ color: colors.gray }}>Inget att visa</Text>
                </VStack>
            )
        }
    </>;
}

export default Reviews;