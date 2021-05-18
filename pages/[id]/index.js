import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Error from 'next/error';
import { Box, Divider, Button, Spinner, Flex } from '@chakra-ui/react';
import {
    MultipleChoiceResponseSingleAnswer,
    MultipleChoiceResponseMultipleAnswer,
    OpenEndedResponseSingleChoice,
    OpenEndedResponseMultipleChoice,
    PollHeader
} from '../../components';
import SplashLayout from '../../layouts/SplashLayout';
import { getPollRequest, voteRequest, createWarningToast, getVotesListener } from '../../utils';

export async function getServerSideProps(context) {
    return getPollRequest(context);
}

export default function Poll(poll) {
    const router = useRouter();
    const { id } = router.query;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [choice, setChoice] = useState(null);
    const [choices, setChoices] = useState([]);
    const [liveChoices, setLiveChoices] = useState(poll.choices);

    const validateFields = () => poll.multipleChoices ? choices.length < 1 : !choice || choice.trim() === '';
    const goToResults = () => router.push(`/${id}/r`);

    // Stream answers if poll is open-ended, so that user can pick as they come in
    useEffect(() => {
        if (poll.error) return;
        if (!poll.openEnded) return;

        // Start listening to votes
        const pusher = getVotesListener(id, data => setLiveChoices(data.poll.choices));

        // End stream when user leaves
        return () => pusher.disconnect();
    }, [id]);

    // Submit poll response to API
    const submit = async () => {
        const data = {
            answers: poll.multipleChoices ? choices : (choice ? [choice] : [])
        };

        try {
            setIsSubmitting(true);
            await voteRequest(id, data);
            goToResults();
        } catch (e) {
            console.log(e);
            setIsSubmitting(false);
            createWarningToast('An error occurred, try refreshing your browser. ' + e);
        }
    }

    // Handle errors
    if (poll.error) {
        return <Error statusCode={poll.status} />;
    }

    return (
        <SplashLayout>
            <Head>
                <title>{poll.question} - Splashpoll.app</title>
            </Head>
            <Box as="section">
                <PollHeader poll={poll} />
            </Box>
            {poll.openEnded ? (
                poll.multipleChoices ? (
                    <OpenEndedResponseMultipleChoice
                        items={liveChoices.map(choice => choice.text)}
                        selectedItems={choices}
                        onSelectedItemsChange={changes => {
                            if (changes.selectedItems) {
                                setChoices(changes.selectedItems);
                            }
                        }}
                        mt={10} mb={6}
                    />
                ) : (
                    <OpenEndedResponseSingleChoice
                        items={liveChoices.map(choice => choice.text)}
                        onSelectedItemChange={changes => {setChoice(changes.selectedItem)}}
                        mt={10} mb={6}
                    />
                )
            ) : (
                poll.multipleChoices ? (
                    <MultipleChoiceResponseMultipleAnswer
                        options={poll.choices}
                        choices={choices}
                        update={setChoices}
                        mt={10} mb={10}
                    />
                ) : (
                    <MultipleChoiceResponseSingleAnswer
                        options={poll.choices}
                        choice={choice}
                        update={setChoice}
                        mt={10} mb={10}
                    />
                )
            )}
            <Divider mb={4} />
            <Flex as="footer" align="center" mt={4}>
                <Button onClick={submit} isDisabled={validateFields()} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
                {isSubmitting && <Spinner ml={6} />}
            </Flex>
        </SplashLayout>
    );
}
