import React from 'react';
import { Flex, Heading, Text, Icon } from '@chakra-ui/react';
import { FaCalendarDay } from 'react-icons/fa';

export default function PollHeader(props) {
    const { poll } = props;
    const createdAt = new Date(poll.created_at)
    const createdAtDate = createdAt.toLocaleDateString('default', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <>
            <Heading size="md">{poll.question}</Heading>
            <Flex align="center" color="grey" lineHeight="normal" mt="0.35rem">
                <Flex align="center" title={`Created on ${createdAt}`}>
                    <Icon as={FaCalendarDay} />
                    <Text fontSize="sm" ml="6px">{createdAtDate}</Text>
                </Flex>
                <Text fontSize="sm">&nbsp; –&nbsp; {poll.totalVotes} votes</Text>
            </Flex>
        </>
    );
}
