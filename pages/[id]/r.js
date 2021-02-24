import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Error from 'next/error';
import Pusher from 'pusher-js';
import { Box, Flex, Stack, StackDivider, Text, Progress } from '@chakra-ui/react';
import { PollHeader } from '../../components';
import SplashLayout from '../../layouts/SplashLayout';
import getPoll from '../../api/getPoll';

export async function getServerSideProps(context) {
    return getPoll(context);
}

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

export default function PollResults(poll) {
    const router = useRouter();
    const { id } = router.query;
    const [results, setResults] = useState(poll);

    useEffect(() => {
        if (poll.error) return;

        // Start streaming poll results from server
        // Enable pusher logging - don't include this in production
        Pusher.logToConsole = true;

        const pusher = new Pusher('132012a7ff56d99a91a8', {
            cluster: 'us2'
        });

        const channel = pusher.subscribe(`polls.${id}`);
        channel.bind('PollVotesUpdated', function(data) {
            setResults(data.poll);
        });

        // End stream when user leaves
        return () => pusher.disconnect();
    }, [id]);

    // Calculates the percentage the given vote accounts for, rounded to two decimal places
    const toPercentage = votes => Math.round((votes / results.totalVotes) * 10000) / 100 || 0;

    // Handle errors
    if (poll.error) {
        return <Error statusCode={poll.status} />;
    }

    return (
        <SplashLayout>
            <Head>
                <title>{results.question} - Results - Splashpoll.app</title>
            </Head>
            <Box as="section">
                <PollHeader poll={results} />
            </Box>
            <Stack as="section" spacing={6} mt={10} divider={<StackDivider />}>
                {results.choices.sort((a, b) => b.votes - a.votes).map((answer, i) => (
                    <Box key={i}>
                        <Flex justify="space-between" align="flex-end">
                            <Text width="60%" fontSize="lg" fontWeight="bold">{answer.text}</Text>
                            <Text fontStyle="italic" fontSize="sm" fontWeight="semibold" color="gray.600">{answer.votes} votes ({toPercentage(answer.votes)}%)</Text>
                        </Flex>
                        <Box mt={2}>
                            <Progress value={toPercentage(answer.votes)} size="lg" colorScheme="twitter" />
                        </Box>
                    </Box>
                ))}
            </Stack>
            {!results.choices.length && <NoChoicesResult />}
        </SplashLayout>
    );
}
