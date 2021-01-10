import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Divider, Button } from '@chakra-ui/react';
import MultipleChoiceResponseMultipleAnswer from '../../components/MultipleChoiceResponseMultipleAnswer';
import OpenEndedResponseSingleChoice from '../../components/OpenEndedResponseSingleChoice';
import OpenEndedResponseMultipleChoice from '../../components/OpenEndedResponseMultipleChoice';
import createWarningToast from '../../components/createWarningToast';
import MultipleChoiceResponseSingleAnswer from '../../components/MultipleChoiceResponseSingleAnswer';
import PollHeader from '../../components/PollHeader';

export async function getServerSideProps(context) {
    // Fetch poll from API
    const id = context.params.id;
    try {
        const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id);

        if (!response.ok) {
            throw new Error(response.status);
        }

        const data = await response.json();
        return { props: data };
    } catch (e) {
        console.log(e);
        return { props: { error: true, status: `${e}` } };
    }
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

        const data = {
            choices: poll.multipleChoices? choices : (choice ? [choice] : []),
            openEndedResponses: poll.multipleChoices ? openEndedResponses : (openEndedResponse ? [openEndedResponse] : [])
        };

        try {
            await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });
            goToResults();
        } catch (e) {
            console.log(e);
        }
    }

    if (poll.error) return <code>ERROR {poll.status}</code>;

    return (
        <>
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
                    />
                ) : (
                    <OpenEndedResponseSingleChoice
                        items={getAnswers()}
                        onSelectedItemChange={changes => {setOpenEndedResponse(changes.selectedItem)}}
                    />
                )
            ) : (
                poll.multipleChoices ? (
                    <MultipleChoiceResponseMultipleAnswer
                        options={getAnswers()}
                        choices={choices}
                        update={setChoices}
                    />
                ) : (
                    <MultipleChoiceResponseSingleAnswer
                        options={getAnswers()}
                        choice={choice}
                        update={setChoice}
                    />
                )
            )}
            <Box as="footer" mt={4}>
                <Divider mb={4} />
                <Button onClick={submit} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
            </Box>
        </>
    );
}
