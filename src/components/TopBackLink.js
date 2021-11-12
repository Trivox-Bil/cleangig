import React from 'react';
import {Button} from "react-native-elements";
import {View} from "react-native";

export default function ({navigation}) {
    return <View style={{alignItems: 'flex-start'}}>
        <Button
            title="Tillbaka"
            titleStyle={{color: 'black'}}
            icon={{type: 'font-awesome', name: 'angle-left', color: 'black'}}
            onPress={() => navigation.goBack()}
            type="clear"
        />
    </View>;
}
