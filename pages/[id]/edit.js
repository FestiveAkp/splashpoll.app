// https://stackoverflow.com/a/46256174

import React, { useState } from 'react';
import Head from 'next/head';
import { Alert, AlertDescription, AlertTitle, Box, Button, Checkbox, CheckboxGroup, Divider, Flex, Input, Spinner, Stack, StackDivider, Text } from '@chakra-ui/react';
import { FaTrash, FaSyncAlt } from 'react-icons/fa';
import getPoll from '../../api/getPoll';
import SplashLayout from '../../layouts/SplashLayout';
import { PollHeader } from '../../components';

export async function getServerSideProps(context) {
    return getPoll(context);
}

export default function Admin(poll) {
    const [_poll, setPoll] = useState(poll);
    const [selectedVotes, setSelectedVotes] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Refresh choices list
    const refreshVotes = async () => {
        setIsRefreshing(true);
        const response = await fetch('https://splashpoll-api.herokuapp.com/v1/polls/' + poll.id);
        const data = await response.json();
        setPoll(data);
        setIsRefreshing(false);
    }

    // Create copy and sort choices by votes first, then alphabetically
    const sortedChoices = () => [..._poll.choices].sort((a, b) => b.votes - a.votes || a.text.localeCompare(b.text));

    return (
        <SplashLayout>
            <Head>
                <title>{_poll.question} - Poll Editor - Splashpoll.app</title>
            </Head>

            <Alert as="section" status="success" mb={8} borderRadius="md">
                <Flex direction="column">
                    <AlertTitle mr={2}>Poll created successfully! Here's your shareable link.</AlertTitle>
                    <AlertDescription display="block">
                        Since this is an open-ended poll,
                        you can use this page to monitor the votes that come in, combine similar results,
                        and remove any inappropriate or irrelevant responses.
                    </AlertDescription>
                </Flex>
            </Alert>

            <Box as="section">
                <PollHeader poll={_poll} />
                <Input
                    size="lg"
                    mt={4}
                    isReadOnly={true}
                    variant="filled"
                    value={`https://splashpoll.app/${_poll.id}`}
                />
                <Stack direction="row" mt={3}>
                    <Button as="a" href={`/${_poll.id}`} size="sm" colorScheme="twitter">Voting page</Button>
                    <Button as="a" href={`/${_poll.id}/r`} size="sm">Results page</Button>
                </Stack>
            </Box>

            <Divider my={4} />

            <Box as="section">
                <Flex justify="space-between" align="center" px={3}>
                    <Stack direction="row" spacing={1} align="center">
                        <Text as="h3" size="md" fontWeight="semibold" mr={2}>Edit Votes</Text>
                        {isRefreshing && <Spinner size="sm" />}
                    </Stack>
                    <Stack direction="row">
                        <Button size="sm" variant="outline" onClick={refreshVotes}>
                            <FaSyncAlt />
                        </Button>
                        <Button size="sm" colorScheme="yellow" isDisabled={selectedVotes.length < 2}>Combine</Button>
                    </Stack>
                </Flex>
                <CheckboxGroup value={selectedVotes} onChange={setSelectedVotes}>
                    <Stack mt={1} px={3} py={2} divider={<StackDivider />}>
                        {sortedChoices().map(choice => (
                            <Flex key={choice.id}>
                                <Flex align="center" width="100%">
                                    <Checkbox size="lg" value={choice.id.toString()}>
                                        <Text ml={2} fontSize="md" fontWeight="semibold">{choice.text}</Text>
                                    </Checkbox>
                                    <Text color="gray.600" mx={2}>&ndash;</Text>
                                    <Text fontStyle="italic" color="gray.600">{choice.votes} votes</Text>
                                </Flex>
                                <Button colorScheme="red" variant="ghost">
                                    <FaTrash />
                                </Button>
                            </Flex>
                        ))}
                    </Stack>
                </CheckboxGroup>
            </Box>

            <Text as="footer" fontSize="xs" color="gray.600" mt={6}>
                This browser has been granted access to edit this poll for a period of 2 days after creation.
                If you'd like to retain edit access beyond that, you can <a href="#"><u>create an account</u></a>.
            </Text>
        </SplashLayout>
    );
}
