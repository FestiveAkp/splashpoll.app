import React from 'react';
import Link from 'next/link';
import Wave from 'react-wavify';
import { Box, Center, Container, Heading } from '@chakra-ui/react';

export const SplashHeader = () => (
    <Box as="header" mb={10}>
        <Link href="/">
            <Heading fontStyle="italic" lineHeight="normal" cursor="pointer">Splashpoll.app</Heading>
        </Link>
        <Heading as="h2" size="sm" fontWeight="semibold" mt={2}>Instantly create online polls with open-ended responses</Heading>
    </Box>
);

export const SplashContainer = props => (
    <Box position="relative">
        <Center className="chakra-center" minHeight="100vh" zIndex="5">
            <Container
                pt={4}
                pb={5}
                my={10}
                backgroundColor="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                shadow="sm"
            >
                {props.children}
            </Container>
        </Center>
        <Box position="absolute" left="0" right="0" bottom="0" zIndex="-1">
            <Wave
                fill='#1DA1F2'
                paused={false}
                options={{
                    height: 20,
                    amplitude: 12,
                    speed: 0.25,
                    points: 4
                }}
                style={{ display: 'block' }}
                className="react-wavify"
            />
            <Box height="275px" backgroundColor="#1DA1F2" />
        </Box>
    </Box>
);
