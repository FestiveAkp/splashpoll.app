import React, {  } from 'react';
import {
    Box,
    Flex,
    Stack,
    StackDivider,
    Heading,
    Text,
    Progress
} from '@chakra-ui/core';

export default function PollResults(props) {
    const results = props.results;

    // Calculates the percentage the given vote accounts for, rounded to two decimal places
    const toPercentage = votes => Math.round((votes / results.totalVotes) * 10000) / 100;

    return (
        <Box>
            <Box as="header">
                <Heading size="md">{results.question}</Heading>
            </Box>
            <Stack as="section" spacing={6} mt={10} divider={<StackDivider />}>
                {results.answers.map((answer, i) => (
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
