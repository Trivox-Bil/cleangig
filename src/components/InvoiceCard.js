import React from 'react';
import {Button, Card} from "react-native-elements";
import {ScrollView, StyleSheet, View, Text} from "react-native";
import voca from "voca";
import {createAndSavePdf, invoiceHtml, totalPayment} from "../helpers";
import { useSelector } from "react-redux";

export default function ({invoice, job}) {
    const user = useSelector(state => state.user.data);
    return <>
        <View style={{marginLeft: 15, marginBottom: 10, flexDirection: 'row'}}>
            <Text color="dark.700" style={{fontWeight: '700'}} > Förfallodatum: </Text>
            <Text color="dark.400">{job.deadline}</Text>
        </View>
        { user.id === job.customer_id 
            ? (
                <View style={{marginLeft: 15, marginBottom: 10, flexDirection: 'row'}}>
                    <Text color="dark.700" style={{fontWeight: '700'}} > Company: </Text>
                    <Text color="dark.400">{job.provider.name}</Text>
                </View>
            ) : (
                <View style={{marginLeft: 15, marginBottom: 10, flexDirection: 'row'}}>
                    <Text color="dark.700" style={{fontWeight: '700'}} > Customer: </Text>
                    <Text color="dark.400">{job.customer.fname} {job.customer.lname}</Text>
                </View>
            )
        }
        
        

        <Card>
            <Card.Title>Sammanfattning</Card.Title>
            {!!invoice.length && (
                <ScrollView horizontal>
                    <View>
                        <View style={styles.summaryItem}>
                            <Text style={styles.summaryItemCell}>Beskrivning</Text>
                            <Text style={styles.summaryItemCell}>Timtaxa</Text>
                            <Text style={styles.summaryItemCell}>Timmar</Text>
                            <Text style={styles.summaryItemCell}>Rotavdrag (50%)</Text>
                            <Text style={styles.summaryItemCell}>Pris</Text>
                        </View>
                        {invoice.map(({description, rate, hours, deduction}, i) => (
                            <View key={i} style={styles.summaryItem}>
                                <Text style={styles.summaryItemCell}>{voca.truncate(description, 20)}</Text>
                                <Text style={styles.summaryItemCell}>{rate}kr</Text>
                                <Text style={styles.summaryItemCell}>{hours}</Text>
                                <Text style={styles.summaryItemCell}>{parseInt(deduction) === 50 ? '50%' : '-'}</Text>
                                <Text style={styles.summaryItemCell}>{hours * rate}kr</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            )}
            <View style={{...styles.summaryItem, marginTop: 10, borderBottomWidth: 0}}>
                <Text style={styles.summaryItemCell}>Total pris</Text>
                <Text style={styles.summaryItemCell}>{totalPayment(invoice)}kr</Text>
            </View>
            <View style={{...styles.summaryItem, borderBottomWidth: 0}}>
                <Text style={styles.summaryItemCell}>Utan MOMS (25%)</Text>
                <Text style={styles.summaryItemCell}>{totalPayment(invoice) * .75}kr</Text>
            </View>
            <View style={styles.summaryItem}>
                <Text h4>Summa</Text>
                <Text h4>{totalPayment(invoice)}kr</Text>
            </View>
        </Card>

        <Button
            title="Betala"
            // icon={{type: 'font-awesome', name: 'file-pdf-o', color: '#fa0f00'}}
            type="clear"
            titleStyle={{color: '#ff7e1a'}}
            onPress={() => {}}
            containerStyle={{marginTop: 30}}
        />
    </>;
}

const styles = StyleSheet.create({
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItemCell: {
        flex: 1,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 5,
        width: 100,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: '#eee',
    },
});
