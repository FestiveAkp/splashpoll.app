import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Error from 'next/error';
import { Box, Divider, Button } from '@chakra-ui/react';
import {
    MultipleChoiceResponseSingleAnswer,
    MultipleChoiceResponseMultipleAnswer,
    OpenEndedResponseSingleChoice,
    OpenEndedResponseMultipleChoice,
    PollHeader
} from '../../components';
import { createWarningToast } from '../../utils';
import SplashLayout from '../../layouts/SplashLayout';
import getPoll from '../../api/getPoll';

export async function getServerSideProps(context) {
    return getPoll(context);
}

export default function Poll(poll) {
    // Router state
    const router = useRouter();
    const { id } = router.query;
    const goToResults = () => router.push(`/${id}/r`);

    // Poll state
    const [choice, setChoice] = useState('');
    const [choices, setChoices] = useState([]);
    const [openEndedResponses, setOpenEndedResponses] = useState([]);
    const [openEndedResponse, setOpenEndedResponse] = useState('');

    const getAnswers = () => poll.choices.map(choice => choice.text);

    // Submit poll response to API
    const submit = async () => {
        // Validate fields
        if (poll.openEnded) {
            if (poll.multipleChoices) {
                if (openEndedResponses.length < 1) {
                    createWarningToast('Enter at least one answer.')
                    return;
                }
            } else {
                if (openEndedResponse.trim() === '') {
                    createWarningToast('Please enter an answer.');
                    return;
                }
            }
        } else {
            if (poll.multipleChoices) {
                if (choices.length < 1) {
                    createWarningToast('Select at least one item.');
                    return;
                }
            } else {
                if (choice.trim() === '') {
                    createWarningToast('Please select an answer.');
                }
            }
        }

        const data = {};

        if (poll.openEnded) {
            data.answers = poll.multipleChoices ? openEndedResponses : (openEndedResponse ? [openEndedResponse] : []);
        } else {
            data.answers = poll.multipleChoices ? choices : (choice ? [choice] : []);
        }

        try {
            await fetch('https://splashpoll-api.herokuapp.com/v1/polls/' + id + '/vote', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            goToResults();
        } catch (e) {
            console.log(e);
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
                        items={getAnswers()}
                        selectedItems={openEndedResponses}
                        onSelectedItemsChange={changes => {
                            if (changes.selectedItems) {
                                setOpenEndedResponses(changes.selectedItems);
                            }
                        }}
                        mt={10} mb={6}
                    />
                ) : (
                    <OpenEndedResponseSingleChoice
                        items={getAnswers()}
                        onSelectedItemChange={changes => {setOpenEndedResponse(changes.selectedItem)}}
                        mt={10} mb={6}
                    />
                )
            ) : (
                poll.multipleChoices ? (
                    <MultipleChoiceResponseMultipleAnswer
                        options={getAnswers()}
                        choices={choices}
                        update={setChoices}
                        mt={10} mb={10}
                    />
                ) : (
                    <MultipleChoiceResponseSingleAnswer
                        options={getAnswers()}
                        choice={choice}
                        update={setChoice}
                        mt={10} mb={10}
                    />
                )
            )}
            <Box as="footer" mt={4}>
                <Divider mb={4} />
                <Button onClick={submit} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
            </Box>
        </SplashLayout>
    );
}
