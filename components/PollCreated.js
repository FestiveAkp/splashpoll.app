import React from 'react';
import { Alert, AlertIcon, AlertTitle, useToast } from '@chakra-ui/react';

export default function PollCreate() {
    const toast = useToast();

    return (
        <>
            <Box as="section">
                <Alert status="success" borderRadius="md">
                    <AlertIcon />
                    <AlertTitle>Success!</AlertTitle>
                    Your poll has been created! Here is your link.
                </Alert>
            </Box>
            <Flex as="section" direction="column" mt={8}>
                <Input
                    value="https://splashpoll.app/fDYFA7ad34"
                    size="lg"
                    variant="filled"
                    isReadOnly={true}
                    width="75%"
                    onFocus={e => e.target.select()}
                    // onFocus={() => toast({
                    //     title: 'Copied to clipboard',
                    //     status: 'success',
                    //     render: () => (
                    //         <Box
                    //             backgroundColor="gray.200"
                    //             borderRadius="md"
                    //             color="gray.900"
                    //             mb={8}
                    //             py={3}
                    //             pl={5}
                    //             fontWeight="semibold"
                    //         >
                    //             Copied to clipboard
                    //         </Box>
                    //     )
                    // })}
                />
                {/* <Text fontSize="sm" color="grey" mt={2}>Click to copy the URL to your clipboard</Text> */}
            </Flex>
            <Box as="footer" mt={8}>
                <Button rightIcon={<HiArrowNarrowRight />}>Visit Poll</Button>
            </Box>
        </>
    );
}
