import React, { useState } from 'react';
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

export default function PollRespond(props) {
    const poll = props.poll;
    const [choice, setChoice] = useState('');
    const [choices, setChoices] = useState([]);

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
    }

    return (
        <Box className="poll-respond">
            <Box as="header">
                <Heading size="md">{poll.question}</Heading>
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
                <Button ml={2}>Results</Button>
            </Box>
        </Box>
    );
}
