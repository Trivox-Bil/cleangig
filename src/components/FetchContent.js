import React, {useEffect, useState} from 'react';
import {Button, Center, Spinner, Text} from "native-base";

export default function ({fetch, children = null, child = null}) {
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        load().then();
    }, []);

    async function load() {
        try {
            setLoading(true);
            setFailed(false);
            await fetch();
        } catch (e) {
            console.error(e);
            setFailed(true);
        } finally {
            setLoading(false);
        }
    }

    return <>
        <LoadingScreen isLoading={loading}/>
        <NoInternet isFailed={failed} onRetry={load}/>
        {[loading, failed].every(b => !b) && <>{children}{child}</>}
    </>;
}

export function LoadingScreen({isLoading}) {
    if (isLoading) {
        return <Center flex={1}>
            <Spinner color="brand.400" size="lg"/>
        </Center>;
    }
    return null;
}

export function NoInternet({isFailed, onRetry}) {
    if (isFailed) {
        return <Center flex={1}>
            <Text>Kontrollera din anslutning och försök igen</Text>
            <Button m="6" colorScheme="brand" onPress={onRetry}>Försök igen</Button>
        </Center>;
    }
    return null;
}
