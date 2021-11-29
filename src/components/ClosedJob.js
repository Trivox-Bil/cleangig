import React, {useEffect, useState} from 'react';
import {Button, Heading, HStack, Text, VStack} from "native-base";
import counties from "../data/counties";
import {formatDate} from "../helpers";
import ImageCarousel from "./ImageCarousel";
import WarningDialog from "./WarningDialog";
import {cleangigApi} from "../network";
import voca from "voca";
import InvoiceCard from "./InvoiceCard";

export default function ({id, pictures}) {
    const [job, setJob] = useState(null);
    const [invoice, setInvoice] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProject = async () => {
        setLoading(true);
        const {data} = await cleangigApi.get(`jobs/${id}`);
        setJob(data.job);
        setInvoice(JSON.parse(voca.unescapeHtml(data.job.invoice)));
        setLoading(false);
    };

    useEffect(() => {
        fetchProject().then();
    }, []);

    return job ? (
        <VStack m={4} space={4}>
            <Heading>{job.title}</Heading>
            <Text color="dark.400">{job.street}, {job.city}, {counties.find(c => c.code === job.county_code).name}</Text>
            <Text m={4} borderLeftWidth={2} borderColor="dark.600" p={4}>{job.description}</Text>

            {pictures.length > 0 && (
                <HStack minH={200} ml={5} my={10}>
                    <ImageCarousel images={pictures}/>
                </HStack>
            )}

            <InvoiceCard job={job} invoice={invoice}/>
        </VStack>
    ) : null;
}
