import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { queryCache } from '../api';
import {
    Box,
    Flex,
    Stack,
    StackDivider,
    Heading,
    Text,
    Progress,
    Skeleton
} from '@chakra-ui/react';

const NoChoicesResult = () => (
    <Box>
        <Flex justify="space-between" align="flex-end">
            <Text width="60%" fontSize="lg">No votes</Text>
            <Text fontStyle="italic" fontSize="sm">0 votes (0%)</Text>
        </Flex>
        <Box mt={2}>
            <Progress value={0} size="lg" colorScheme="twitter" />
        </Box>
    </Box>
);

const LoadingSkeleton = () => (
    <Box>
        <Skeleton width="50%" height="24px" />
        <Box mt={10}>
            <Skeleton width="80px" height="24px" />
            <Skeleton height="20px" mt={2} />
        </Box>
        <Box mt={10}>
            <Skeleton height="24px" width="80px" />
            <Skeleton height="20px" mt={2} />
        </Box>
    </Box>
);

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

    if (loading) return <LoadingSkeleton />;

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
            {!results.choices.length && <NoChoicesResult />}
        </Box>
    );
}
