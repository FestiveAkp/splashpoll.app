import React, { useState, useEffect } from 'react';
import {
    useHistory,
    useParams
} from 'react-router-dom';
import {
    Box,
    Stack,
    Heading,
    Checkbox,
    CheckboxGroup,
    Radio,
    RadioGroup,
    Button
} from '@chakra-ui/core';

export default function PollRespond() {
    // Router state
    const { id } = useParams();
    const history = useHistory();

    // Poll state
    const [poll, setPoll] = useState({});
    const [fetched, setFetched] = useState(false);
    const [choice, setChoice] = useState('');
    const [choices, setChoices] = useState([]);

    // On mount, fetch the poll
    useEffect(() => {
        fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setPoll(data);
                setFetched(true);
            });
    }, [id]);


    // Submit poll response to API
    const submit = () => {
        const data = {
            choices: choices
        };

        // Choices are currently indices, convert it to answer text
        if (poll.multipleChoices) {
            data.choices = choices.map(i => poll.choices[i].text);
        } else {
            data.choices = [poll.choices[choice].text];
        }

        fetch('https://splashpoll-api.herokuapp.com/api/polls/' + id, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(() => history.push('/' + id + '/r'))

        console.log(data);
        goToResults();
    }

    // Navigate to results page
    const goToResults = () => history.push(`/${id}/r`);

    return (!fetched) ? (
        <Heading size="md">Loading...</Heading>
    ) : (
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
