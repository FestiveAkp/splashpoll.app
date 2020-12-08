import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queryCache } from '../api';
import {
    Box,
    Flex,
    Stack,
    StackDivider,
    Center,
    Heading,
    Text,
    Progress,
    Spinner
} from '@chakra-ui/react';

export default function PollResults() {
    const { id } = useParams();
    const [results, setResults] = useState({});
    const [loading, setLoading] = useState(true);

    // On mount, fetch the poll
    useEffect(() => {
        setLoading(true);

        // Try getting from the cache
        const cachedPoll = queryCache.getQueryData(['poll', id]);
        if (cachedPoll !== undefined) {
            setResults(cachedPoll);
            setLoading(false);
        }

        // Start streaming poll results from server
        let eventSource = new EventSource(`https://splashpoll-api.herokuapp.com/api/polls/${id}/stream`);
        eventSource.addEventListener('message', m => {
            const data = JSON.parse(m.data);
            setResults(data);
            setLoading(false);
        });

        // End stream when user leaves
        return () => eventSource.close();
    }, [id]);

    // Calculates the percentage the given vote accounts for, rounded to two decimal places
    const toPercentage = votes => Math.round((votes / results.totalVotes) * 10000) / 100 || 0;

    if (loading) return <Center><Spinner /></Center>;

    return (
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
