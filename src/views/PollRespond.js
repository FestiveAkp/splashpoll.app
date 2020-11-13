import React, { useState } from 'react';
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
    const [choice, setChoice] = useState('');
    const [choices, setChoices] = useState([]);
    const poll = {
        question: 'What is the question?',
        multipleChoices: true,
        answers: [
            'There is a question',
            "There is not a question"
        ]
    };

    // Submit poll response to API
    const submit = () => {
        const data = {
            choices: []
        };

        // Choices are currently indices, convert it to answer text
        if (poll.multipleChoices) {
            data.choices = choices.map(i => poll.answers[i]);
        } else {
            data.choices = [poll.answers[choice]];
        }

        console.log(data);
        goToResults();
    }

    // Navigate to results page
    const goToResults = () => history.push(`/${id}/r`);

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
                                {poll.answers.map((answer, i) => (
                                    <Checkbox key={i} value={`${i}`} spacing="1rem" size="lg">{answer}</Checkbox>
                                ))}
                            </Stack>
                        </CheckboxGroup>
                    ) : (
                        <RadioGroup onChange={setChoice} value={choice}>
                            <Stack spacing={3}>
                                {poll.answers.map((answer, i) => (
                                    <Radio key={i} value={`${i}`} spacing="1rem" size="lg">{answer}</Radio>
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
