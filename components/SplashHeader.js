import React from 'react';
import Link from 'next/link';
import { Box, Heading } from '@chakra-ui/react';

const SplashHeader = () => (
    <Box as="header" mb={10}>
        <Link href="/">
            <Heading fontStyle="italic" lineHeight="normal" cursor="pointer">Splashpoll.app</Heading>
        </Link>
        <Heading as="h2" size="sm" fontWeight="semibold" mt={2}>Instantly create online polls with open-ended responses</Heading>
    </Box>
);

export default SplashHeader;