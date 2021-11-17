import React, {useState} from 'react';
import {Button, Image, ListItem, Overlay, Text} from "react-native-elements";
import {TouchableOpacity, View} from "react-native";

export default function ({onAssign, proposal, navigation}) {
    const [confirmAssign, setConfirmAssign] = useState(false);

    function navigateTo(tab, screen, params) {
        navigation.push('CustomerTab', {screen: tab, params: {screen, params}});
    }

    return <>
        <ListItem key={proposal.id} bottomDivider containerStyle={{paddingHorizontal: 0}}>
            <TouchableOpacity
                onPress={() => navigateTo('Browse', 'ProviderProfile', {provider: proposal.provider.id})}
            >
                <Image
                    source={{uri: proposal.provider.picture}}
                    style={{width: 50, height: 50, borderRadius: 25, marginHorizontal: 2.5}}/>
            </TouchableOpacity>
            <ListItem.Content bottomDivider>
                <ListItem.Title>{proposal.provider.name}</ListItem.Title>
                <ListItem.Subtitle style={{marginVertical: 5, fontSize: 16}}>{proposal.price} kr</ListItem.Subtitle>
                <ListItem.Subtitle>{proposal.message}</ListItem.Subtitle>
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                    <Button
                        title="Chatt"
                        type="outline"
                        containerStyle={{flex: 1, marginRight: 5}}
                        buttonStyle={{borderColor: '#ff7e1a'}}
                        titleStyle={{color: '#ff7e1a'}}
                        onPress={() => navigateTo('Chat', 'ChatScreen', {provider: proposal.provider.id})}
                    />
                    <Button
                        title="Tilldela"
                        containerStyle={{flex: 1, marginLeft: 5}}
                        buttonStyle={{backgroundColor: '#ff7e1a'}}
                        onPress={() => setConfirmAssign(true)}
                    />
                </View>
            </ListItem.Content>
        </ListItem>
        <Overlay
            isVisible={confirmAssign}
            onBackdropPress={() => setConfirmAssign(!confirmAssign)}
            overlayStyle={{padding: 15}}>
            <Text>Vill du tilldela detta jobb till {proposal.provider.name}?</Text>
            <View style={{flexDirection: 'row'}}>
                <Button title="Ångra" type="outline" buttonStyle={{marginTop: 8}} onPress={() => setConfirmAssign(false)}/>
                <Button
                    title="Ja"
                    type="outline"
                    buttonStyle={{marginTop: 8}}
                    onPress={() => {
                        setConfirmAssign(!confirmAssign);
                        onAssign(proposal);
                    }}
                    containerStyle={{flex: 1, marginLeft: 10}}
                />
            </View>
        </Overlay>
    </>
}
