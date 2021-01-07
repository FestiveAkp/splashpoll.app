import React from 'react';
import Wave from 'react-wavify';
import {
    Box,
    Center,
    Container,
    Heading
} from '@chakra-ui/react';

export const SplashHeader = () => (
    <>
        <Heading as="h1" fontStyle="italic" lineHeight="normal">Splashpoll.app</Heading>
        <Heading size="sm" fontWeight="semibold" as="h2" mt={2} mb={10} >Instantly create online polls with open-ended responses</Heading>
    </>
);

export const SplashContainer = props => (
    <Box position="relative">
        <Center className="chakra-center" minHeight="100vh" zIndex="5">
            <Container
                pt={4}
                pb={5}
                mb={4}
                backgroundColor="white"
                borderWidth="1px"
                borderColor="gray.200"
                borderRadius="md"
                shadow="sm"
            >
                {props.children}
            </Container>
        </Center>
        <Box
            position="absolute"
            left="0"
            right="0"
            bottom="0"
            zIndex="-1"
        >
            <Wave
                fill='#1DA1F2'
                paused={false}
                options={{
                    height: 20,
                    amplitude: 30,
                    speed: 0.25,
                    points: 3
                }}
                style={{ display: 'block' }}
            />
        </Box>
    </Box>
);
