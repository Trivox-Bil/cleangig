import { Box, Button, Heading, Text, TextArea } from 'native-base';
import React, { useState, useEffect } from 'react';
import { AirbnbRating } from 'react-native-ratings';
import { useSelector } from "react-redux";
import { cleangigApi } from "../network";

const LeaveReview = ({ job, reviewer }) => {
    const user = useSelector((state) => state.user.data);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(3);
    const [disableBtn, setDisableBtn] = useState(false)

    useEffect(() => {
        checkIfReviewed()
    }, []);

    const checkIfReviewed = async () => {
        const { data } = await cleangigApi.get(`review_check/${job.id}/${job.provider.id}/${job.customer.id}/${reviewer}/`);
        if (data.review.length > 0) {
            setDisableBtn(true);
            setComment(data.review[0].comment)
            setRating(data.review[0].rating)
        }
    }

    const submitReviewHanlder = async () => {
        const data = new FormData();
        data.append('comment', comment);
        data.append('rating', rating);
        data.append('job', job.id);
        console.log(reviewer)
        if (reviewer === '1') {
            data.append('customer', user.id);
            const { data: reviewID } = await cleangigApi.post(`providers/${job.provider.id}/add_review`, data);
            if (reviewID) { setDisableBtn(true) }
        } else {
            data.append('provider', user.id);
            const { data: reviewID } = await cleangigApi.post(`customer/${job.customer.id}/add_review`, data);
            if (reviewID) { setDisableBtn(true) }
        }

    }

    return (
        <>
            <Heading>Lämna en recension</Heading>
            <AirbnbRating
                showRating={false}
                onFinishRating={setRating}
                count={5}
                defaultRating={rating}
                selectedColor="#ff7e1a"
                size={20}
                starContainerStyle={{
                    alignSelf: "flex-start",
                    marginVertical: 10
                }}
            />
            {console.log(disableBtn)}
            {
                !disableBtn ? (
                    <>
                        <TextArea
                            borderRadius="8"
                            _focus={{
                                borderColor: "#ff7e1a"
                            }}
                            placeholder="kommentar"
                            borderColor="#ff7e1a"
                            borderWidth={1}
                            onChangeText={setComment}
                            h="150"
                            mb="5"
                        ></TextArea>
                        <Box alignItems="center">
                            <Button disable={disableBtn} _text={{ color: 'white' }} onPress={submitReviewHanlder}>Skicka in</Button>
                        </Box>
                    </>)
                    : <>
                        <Text>{comment}</Text>

                    </>
            }

        </>
    );
}

export default LeaveReview;