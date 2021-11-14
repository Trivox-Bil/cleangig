import React from "react";
import {Button, HStack, Modal, Text} from "native-base";

export default function ({action, message, isVisible, onCancel}) {
    return <Modal isOpen={isVisible} onClose={onCancel}>
        <Modal.Content>
            <Modal.CloseButton/>
            <Modal.Header>Oåterkallelig handling</Modal.Header>
            <Modal.Body>
                <Text my={4}>{message}</Text>
            </Modal.Body>
            <Modal.Footer>
                <HStack space={4}>
                    <Button variant="ghost" colorScheme="brand" onPress={onCancel}>Avbryt</Button>
                    <Button variant="ghost" colorScheme="brand" onPress={action}>Ja</Button>
                </HStack>
            </Modal.Footer>
        </Modal.Content>
    </Modal>;
}
