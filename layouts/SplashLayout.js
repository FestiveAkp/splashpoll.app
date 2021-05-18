import Link from 'next/link';
import { Box, Center, Container, Heading, Tag } from '@chakra-ui/react';
import Wave from 'react-wavify';

const SplashHeader = () => (
    <Box as="header" mb={10}>
        <Link href="/" passHref={true}>
            <Heading as="a" lineHeight="normal" cursor="pointer">
                Splashpoll.app
                <Tag fontStyle="italic" colorScheme="pink" ml={2}>Beta</Tag>
            </Heading>
        </Link>
        <Heading as="h2" size="sm" fontWeight="semibold" mt={2}>Instantly create online polls with open-ended responses</Heading>
    </Box>
);

const SplashContainer = props => (
    <Box position="relative">
        <Center className="chakra-center" minHeight="100vh" zIndex="5" px={2}>
            <Container
                as="main"
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

const SplashLayout = props => (
    <>
        <SplashContainer>
            <SplashHeader />
            {props.children}
        </SplashContainer>
        <div style={{ height:'350px' }}>What this website is about</div>
    </>
);

export default SplashLayout;
