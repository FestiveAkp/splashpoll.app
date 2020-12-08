import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import { queryCache } from '../index';
import {
    Box,
    Stack,
    Input,
    Checkbox,
    Button
} from '@chakra-ui/react';

const createPoll = async poll => {
    const response = await fetch('https://splashpoll-api.herokuapp.com/api/polls', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(poll)
    });
    const data = await response.json();
    return data;
}

export default function PollCreate() {
    // Router state
    const history = useHistory();

    // Form fields
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '']);
    const [openEnded, setOpenEnded] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState(false);
    const [mutate] = useMutation(createPoll);

    // Submit newly created poll to API
    const submit = async () => {
        const newPoll = {
            question,
            answers: answers.filter(answer => answer !== ''),     // Filter out empty answers
            openEnded,
            multipleChoices
        };

        try {
            const data = await mutate(newPoll);
            queryCache.setQueryData(['poll', data.id], data);
            history.push('/' + data.id);
        } catch (e) {
            console.log(e);
        }
    }

    // Append a new answer field
    const addAnswerField = () => setAnswers(arr => [...arr, '']);

    // Modify an existing answer field
    const updateAnswerField = (i, newValue) => {
        const updatedAnswers = [...answers];
        updatedAnswers[i] = newValue;
        setAnswers(updatedAnswers);

        // Add new field if typing into the last one
        if (i === answers.length - 1) {
            addAnswerField();
        }
    }

    return (
        <Box className="poll-create">
            <Box as="header">
                <Input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    variant="flushed"
                    placeholder="What's your question?"
                />
            </Box>
            <Stack as="section" spacing={3} mt={8}>
                {answers.map((answer, i) => (
                    <Input
                        key={i}
                        value={answer}
                        onChange={e => updateAnswerField(i, e.target.value)}
                        variant="flushed"
                        placeholder="Enter answer"
                    />
                ))}
            </Stack>
            <Box as="section" mt={6}>
                <Stack direction="column">
                    <Checkbox
                        value={openEnded}
                        onChange={() => setOpenEnded(b => !b)}
                        size="sm"
                    >
                        Enable open-ended response
                    </Checkbox>
                    <Checkbox
                        value={multipleChoices}
                        onChange={() => setMultipleChoices(b => !b)}
                        size="sm"
                    >
                        Allow multiple selections
                    </Checkbox>
                </Stack>
            </Box>
            <Box as="footer" mt={10}>
                <Button onClick={submit} colorScheme="twitter">Create Poll</Button>
            </Box>
        </Box>
    );
}
