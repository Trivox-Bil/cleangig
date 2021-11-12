import React from 'react';
import {Card, Text} from "react-native-elements";
import {ScrollView} from "react-native";

export default function ({job}) {
    return !!job ? <>
        <Card>
            <Card.Title>{job.title}</Card.Title>
            <Card.Divider/>
            <Text>{job.description}</Text>
            <Card.Divider style={{marginVertical: 10}}/>
            <Text style={{opacity: 0.6}}>{job.street}{job.city ? `, ${job.city}` : ''}, {job.county.name}</Text>
            {!!job.picture.length && <>
                <Card.Divider style={{marginVertical: 10}}/>
            </>}
        </Card>
    </> : null;
}