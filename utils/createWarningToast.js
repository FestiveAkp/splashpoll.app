import React from 'react';
import { Box, Flex, createStandaloneToast } from '@chakra-ui/react';
import { BsExclamationCircleFill } from 'react-icons/bs';

export default function createWarningToast(props) {
    const toast = createStandaloneToast();

    toast({
        position: 'top',
        render: () => (
            <Flex
                direction="row"
                align="center"
                color="black"
                backgroundColor="#ffc107"
                borderRadius="md"
                py={3}
                pl={4}
                pr={5}
            >
                <Box mr="0.75rem">
                    <BsExclamationCircleFill fontSize="20px" />
                </Box>
                {props}
            </Flex>
        )
    });
}
