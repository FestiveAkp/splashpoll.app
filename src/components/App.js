import React from 'react';
import {
    Center,
    Container,
    Heading
} from '@chakra-ui/core';
import PollCreate from './PollCreate';
import PollRespond from './PollRespond';

export default function App() {
    const poll = {
        question: 'What is the question?',
        multipleChoices: true,
        answers: [
            'There is a question',
            "There is not a question"
        ]
    };

    return (
        <Center height="100vh">
            <Container pt={4} pb={45}>
                <Heading as="h1">Poll App</Heading>
                <Heading size="sm" fontWeight="semibold" as="h2" mt={2} mb={10} >Instantly create online polls with open-ended responses</Heading>
                {/* <PollCreate /> */}
                <PollRespond poll={poll} />
            </Container>
        </Center>
    );
}
