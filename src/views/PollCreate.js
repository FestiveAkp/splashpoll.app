import React, { useState } from 'react';
import {
    useHistory
} from 'react-router-dom';
import {
    Box,
    Stack,
    Input,
    Checkbox,
    Button
} from '@chakra-ui/core';

export default function PollCreate() {
    // Router state
    const history = useHistory();

    // Form fields
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '']);
    const [openEnded, setOpenEnded] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState(false);

    // Submit newly created poll to API
    const submit = () => {
        // Collect data
        const data = {
            question,
            answers: answers.filter(answer => answer !== ''),     // Filter out empty answers
            openEnded,
            multipleChoices
        };

        console.log(data);
        console.log(`Question: ${data.question}`);
        data.answers.forEach((answer, i) => console.log(`Answer ${i}: ${answer}`));
        console.log(`Open ended: ${data.openEnded}`);
        console.log('---');

        fetch('https://splashpoll-api.herokuapp.com/api/polls', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(response => response.json())
            .then(data => history.push('/' + data.id));
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
