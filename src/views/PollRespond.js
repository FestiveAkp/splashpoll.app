import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import {
    Box,
    Center,
    Heading,
    Divider,
    Text,
    Button,
    Spinner
} from '@chakra-ui/react';
import { queryCache, getPoll, updatePoll } from '../api';
import OpenEndedResponse from '../components/OpenEndedResponse';
import MultipleChoiceResponse from '../components/MultipleChoiceResponse';

export default function PollRespond() {
    // Router state
    const { id } = useParams();
    const history = useHistory();

    // Poll state
    const [choices, setChoices] = useState([]);
    const [openEndedResponses, setOpenEndedResponses] = useState([]);

    // Fetch poll and cache it
    const { status, data: poll, error } = useQuery(['poll', id], getPoll);
    const [mutate] = useMutation(updatePoll, { onSettled: () => queryCache.invalidateQueries('polls') });

    const goToResults = () => history.push(`/${id}/r`);

    // Submit poll response to API
    const submit = async () => {
        const data = { choices, openEndedResponses };

        try {
            await mutate({ data, id });
            goToResults();
        } catch (e) {
            console.log(e);
        }
    }

    if (status === 'loading') return <Center><Spinner /></Center>;
    if (status === 'error') console.log(error);

    return (
        <Box className="poll-respond">
            <Box as="header">
                <Heading size="md">{poll.question}</Heading>
                <Text fontSize="sm">ID: {id}</Text>
            </Box>
            {poll.openEnded ? (
                <OpenEndedResponse
                    responses={openEndedResponses}
                    update={setOpenEndedResponses}
                    multipleChoice={poll.multipleChoices}
                />
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
        </Box>
    );
}
