import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Flex,
    Stack,
    StackDivider,
    Heading,
    Text,
    Progress
} from '@chakra-ui/core';

export default function PollResults() {
    const { id } = useParams();
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    // On mount, fetch the poll
    useEffect(() => {
        setLoading(true);
        let eventSource = new EventSource(`https://splashpoll-api.herokuapp.com/api/polls/${id}/stream`);
        eventSource.addEventListener('message', m => {
            const data = JSON.parse(m.data);
            console.log(data);
            setResults(data);
            setLoading(false);
        });

        return () => eventSource.close();
    }, [id]);

    // Calculates the percentage the given vote accounts for, rounded to two decimal places
    const toPercentage = votes => Math.round((votes / results.totalVotes) * 10000) / 100 || 0;

    return (loading) ? (
        <Heading size="md">Loading...</Heading>
    ) : (
        <Box>
            <Box as="header">
                <Heading size="md">{results.question}</Heading>
            </Box>
            <Stack as="section" spacing={6} mt={10} divider={<StackDivider />}>
                {results.choices.sort((a, b) => b.votes - a.votes).map((answer, i) => (
                    <Box key={i}>
                        <Flex justify="space-between" align="flex-end">
                            <Text width="60%" fontSize="lg">{answer.text}</Text>
                            <Text fontStyle="italic" fontSize="sm">{answer.votes} votes ({toPercentage(answer.votes)}%)</Text>
                        </Flex>
                        <Box mt={2}>
                            <Progress value={toPercentage(answer.votes)} size="lg" colorScheme="twitter" />
                        </Box>
                    </Box>
                ))}
            </Stack>
        </Box>
    );
}
