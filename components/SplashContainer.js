import React from 'react';
import Wave from 'react-wavify';
import { Box, Center, Container } from '@chakra-ui/react';

const SplashContainer = props => (
    <Box position="relative">
        <Center className="chakra-center" minHeight="100vh" zIndex="5" px={2}>
            <Container
                pt={4}
                pb={5}
                mt={12}
                mb={24}
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
            <Box height={{ base: '40px', sm: '100px', md: '275px' }} backgroundColor="#1DA1F2" />
        </Box>
    </Box>
);

export default SplashContainer;
