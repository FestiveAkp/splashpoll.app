import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { Box, Heading, Divider, Text, Button, Skeleton } from '@chakra-ui/react';
import { queryCache, getPoll, updatePoll } from '../api';
import MultipleChoiceResponse from '../components/MultipleChoiceResponse';
import OpenEndedResponseSingleChoice from '../components/OpenEndedResponseSingleChoice';
import OpenEndedResponseMultipleChoice from '../components/OpenEndedResponseMultipleChoice';

const LoadingSkeleton = () => (
    <Box>
        <Skeleton width="60%" height="24px" />
        <Skeleton width="20%" height="20px" mt={3} />
        <Skeleton mt={10} height="48px" />
    </Box>
);

export default function PollRespond() {
    // Router state
    const { id } = useParams();
    const history = useHistory();

    // Poll state
    const [choices, setChoices] = useState([]);
    const [openEndedResponses, setOpenEndedResponses] = useState([]);
    const [openEndedResponse, setOpenEndedResponse] = useState('');

    // Fetch poll and cache it
    const { status, data: poll, error } = useQuery(['poll', id], getPoll);
    const [mutate] = useMutation(updatePoll, { onSettled: () => queryCache.invalidateQueries('polls') });

    const goToResults = () => history.push(`/${id}/r`);

    // Submit poll response to API
    const submit = async () => {
        const data = {
            choices,
            openEndedResponses: poll.multipleChoices ? openEndedResponses : [openEndedResponse]
        };

        try {
            await mutate({ data, id });
            goToResults();
        } catch (e) {
            console.log(e);
        }
    }

    if (status === 'loading') return <LoadingSkeleton />;
    if (status === 'error') console.log(error);

    return (
        <>
            <Box as="section">
                <Heading size="md">{poll.question}</Heading>
                <Text fontSize="sm">ID: {id}</Text>
            </Box>
            {poll.openEnded ? (
                poll.multipleChoices ? (
                    <OpenEndedResponseMultipleChoice
                        items={poll.choices.map(choice => choice.text)}
                        selectedItems={openEndedResponses}
                        onSelectedItemsChange={changes => {
                            if (changes.selectedItems) {
                                setOpenEndedResponses(changes.selectedItems);
                            }
                        }}
                    />
                ) : (
                    <OpenEndedResponseSingleChoice
                        items={poll.choices.map(choice => choice.text)}
                        onSelectedItemChange={changes => {setOpenEndedResponse(changes.selectedItem)}}
                    />
                )
            ) : (
                <MultipleChoiceResponse
                    options={poll.choices}
                    choices={choices}
                    update={setChoices}
                    multipleChoice={poll.multipleChoices}
                />
            )}
            <Box as="footer" mt={4}>
                <Divider mb={4} />
                <Button onClick={submit} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
            </Box>
        </>
    );
}
