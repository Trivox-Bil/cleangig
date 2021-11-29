import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, TextInput, View} from 'react-native';
import {CheckBox, Overlay} from 'react-native-elements';
import {sotApi} from "../../../network";
import SafeScrollView from "../../../components/SafeScrollView";
import {totalPayment} from "../../../helpers";
import AppBar from "../../../components/AppBar";
import {
    AddIcon,
    Button,
    CloseIcon,
    Heading,
    HStack,
    IconButton,
    Image,
    Input,
    Modal,
    Radio,
    Text,
    VStack
} from "native-base";

export default function ({navigation, route}) {
    const job = route.params.job;
    const [milestones, setMilestones] = useState([]);
    const [description, setDescription] = useState('');
    const [rate, setRate] = useState('0');
    const [hours, setHours] = useState('0');
    const [deduction, setDeduction] = useState('0');
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [deadline, setDeadline] = useState('10');

    const addMilestone = () => {
        setMilestones([...milestones, new Milestone(description, rate, hours, deduction)]);
        setDescription('');
        setRate('0');
        setHours('0');
        setDeduction('0');
    };

    const removeMilestone = (i) => {
        const copy = [...milestones];
        copy.splice(i, 1);
        setMilestones(copy);
    };

    const closeJob = async () => {
        setShowConfirm(false);
        setLoading(true);
        const formData = new FormData();
        formData.append('job', job.id);
        formData.append('invoice', JSON.stringify(milestones));
        formData.append('deadline', deadline);
        formData.append('deduction', deduction);
        const {data: result} = await sotApi.post(`jobs/close`, formData);
        if (result.token) {
            await fetch('https://exp.host/--/api/v2/push/send', {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: result.token,
                    sound: 'default',
                    title: `Jobbet är stängt`,
                    body: `Jobbet "${job.title}" är stängt`,
                    data: {type: 'closed-job'},
                }),
            });
        }
        setLoading(false);
        navigation.replace('MyJob', {job});
    };

    return <>
        <AppBar screenTitle="Skapa faktura" navigation={navigation} backButton/>
        <SafeScrollView contentContainerStyle={styles.container}>
            {job && <>
                <VStack p={4} space={4}>
                    <Heading size="md" textAlign="center">{job.title}</Heading>

                    <HStack alignItems="center">
                        <Image source={{uri: job.customer.picture}} w={20} h={20} m={4} rounded="full"
                               borderColor="accent.400"
                               borderWidth={2} alt=" "/>
                        <VStack space={2}>
                            <Heading size="sm">{job.customer.fname} {job.customer.lname}</Heading>
                            <Text>{job.customer.email}</Text>
                        </VStack>
                    </HStack>

                    <VStack bg="accent.200" rounded="md" p={4}>
                        <Text bold>Betalningsvillkor (i dagar)</Text>
                        <View style={{flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10}}>
                            <Radio.Group value={deadline} onChange={setDeadline} name="deadline">
                                <HStack space={4}>
                                    <Radio value="10">10</Radio>
                                    <Radio value="20">20</Radio>
                                    <Radio value="30">30</Radio>
                                </HStack>
                            </Radio.Group>
                        </View>
                    </VStack>

                    <View style={styles.table}>
                        <Row cells={['RUT', 'Beskrivning', 'H', 'Pris', ''].map(t => {
                            return <Text style={{fontWeight: 'bold'}}>{t}</Text>;
                        })}/>

                        {milestones.map((milestone, i) => {
                            return <Row key={i} cells={[
                                <Text>{milestone.deduction === 50 ? '50%' : '-'}</Text>,
                                <Text>{milestone.description}</Text>,
                                <Text>{milestone.hours}</Text>,
                                <Text>{milestone.rate}kr</Text>,
                                <IconButton icon={<CloseIcon size="xs" color="danger.400"/>}
                                            onPress={() => removeMilestone(i)}/>,
                            ]}/>
                        })}

                        <InputRow cells={[
                            <CheckBox checked={deduction === 50} checkedColor="#ff7e1a"
                                      onPress={() => setDeduction(deduction === 50 ? '0' : 50)}/>,
                            {value: description, onChangeText: setDescription, multiline: true},
                            {value: hours, onChangeText: setHours, keyboardType: 'number-pad'},
                            {value: rate, onChangeText: setRate, keyboardType: 'number-pad'},
                            <IconButton icon={<AddIcon size="xs" color="brand.400"/>} onPress={addMilestone}/>,
                        ]}/>
                    </View>

                    <VStack alignItems="flex-end">
                        <Text fontSize="md" bold>Total betalning - SEK {totalPayment(milestones)}</Text>
                        <Text style={{fontSize: 14}}>Utan MOMS - SEK {totalPayment(milestones) * .75}</Text>
                    </VStack>

                    {milestones.length > 0 && (
                        <Button _text={{color: 'white'}} onPress={() => setShowConfirm(true)}>
                            Stäng jobbet och skicka faktura
                        </Button>
                    )}
                </VStack>

                <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)}>
                    <Modal.Content>
                        <Modal.CloseButton/>
                        <Modal.Header>Är du säker?</Modal.Header>
                        <Modal.Body>
                            Är du säker på att du vill skicka faktura och avsluta jobbet.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button _text={{color: 'white'}} onPress={closeJob}>Ja, stäng jobbet</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Overlay isVisible={loading} overlayStyle={{padding: 15}}>
                    <ActivityIndicator color={'#ff7e1a'} size="large"/>
                </Overlay>
            </>}
        </SafeScrollView>
    </>;
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: 'white',
    },
    table: {
        borderBottomWidth: 2,
        borderColor: '#aaa',
    },
    row: {
        flexDirection: 'row',
        borderRightWidth: 2,
        borderColor: '#aaa',
    },
    rowItem: {
        alignItems: 'center',
        justifyContent: 'center',
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#aaa',
        paddingVertical: 5,
        paddingHorizontal: 2,
        borderRadius: 0,
    },
    summaryItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#999',
        paddingVertical: 12,
    },
    summaryItemCell: {
        flex: 1,
        textAlign: 'center',
    },
    smallInput: {
        minHeight: 40,
        minWidth: 100,
    }
});

function Row({cells}) {
    return <View style={styles.row}>
        <View style={{...styles.rowItem, width: 50}}>{cells[0]}</View>
        <View style={{...styles.rowItem, flex: 1}}>{cells[1]}</View>
        <View style={{...styles.rowItem, width: 50}}>{cells[2]}</View>
        <View style={{...styles.rowItem, width: 70}}>{cells[3]}</View>
        <View style={{...styles.rowItem, width: 60}}>{cells[4]}</View>
    </View>
}

function InputRow({cells}) {
    return <View style={styles.row}>
        <View style={{...styles.rowItem, width: 50}}>{cells[0]}</View>
        <Input style={{...styles.rowItem}} flex={1} h={20} {...cells[1]}/>
        <Input style={{...styles.rowItem}} w={50} h={20} {...cells[2]}/>
        <Input style={{...styles.rowItem}} w={70} h={20} {...cells[3]}/>
        <View style={{...styles.rowItem, width: 60}}>{cells[4]}</View>
    </View>;
}

class Milestone {
    constructor(description, rate, hours, deduction) {
        this.description = description;
        this.rate = rate;
        this.hours = hours;
        this.deduction = deduction;
    }

    get price() {
        return this.rate * this.hours;
    }
}
