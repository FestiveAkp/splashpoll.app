import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useQuery, useMutation } from 'react-query';
import { queryCache } from '../index';
import {
    Box,
    Stack,
    Center,
    Heading,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Button,
    Spinner
} from '@chakra-ui/react';

const updatePoll = async ({data, id}) => {
    await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
}

const getPoll = async (_, id) => {
    const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id);
    const data = await response.json();
    return data;
}

export default function PollRespond() {
    // Router state
    const { id } = useParams();
    const history = useHistory();

    // Poll state
    const [choice, setChoice] = useState('');
    const [choices, setChoices] = useState([]);

    // Fetch poll and cache it
    const { status, data: poll, error } = useQuery(['poll', id], getPoll);
    const [mutate] = useMutation(updatePoll, {
        onSettled: () => queryCache.invalidateQueries('polls')
    });

    const goToResults = () => history.push(`/${id}/r`);

    // Submit poll response to API
    const submit = async () => {
        const data = { choices };

        // Choices are currently indices, convert it to answer text
        if (poll.multipleChoices) {
            data.choices = choices.map(i => poll.choices[i].text);
        } else {
            data.choices = [poll.choices[choice].text];
        }

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
                <p>ID: {id}</p>
            </Box>
            <Box as="section" mt={10}>
                {(poll.multipleChoices === true) ? (
                        <CheckboxGroup onChange={setChoices} value={choices}>
                            <Stack spacing={3}>
                                {poll.choices.map((choice, i) => (
                                    <Checkbox key={i} value={`${i}`} spacing="1rem" size="lg">{choice.text}</Checkbox>
                                ))}
                            </Stack>
                        </CheckboxGroup>
                    ) : (
                        <RadioGroup onChange={setChoice} value={choice}>
                            <Stack spacing={3}>
                                {poll.choices.map((choice, i) => (
                                    <Radio key={i} value={`${i}`} spacing="1rem" size="lg">{choice.text}</Radio>
                                ))}
                            </Stack>
                        </RadioGroup>
                    )
                }
            </Box>
            <Box as="footer" mt={12}>
                <Button onClick={submit} colorScheme="twitter">Vote</Button>
                <Button onClick={goToResults} ml={2}>Results</Button>
            </Box>
        </Box>
    );
}
