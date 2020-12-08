import React from 'react';
import {
    Center,
    Container,
    Heading
} from '@chakra-ui/react';

export const SplashHeader = () => (
    <>
        <Heading as="h1">Poll App</Heading>
        <Heading size="sm" fontWeight="semibold" as="h2" mt={2} mb={10} >Instantly create online polls with open-ended responses</Heading>
    </>
);

export const SplashContainer = props => (
    <>
        <Center height="100vh">
            <Container pt={4} pb={45}>
                {props.children}
            </Container>
        </Center>
    </>
);
