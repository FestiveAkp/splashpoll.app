import { createStandaloneToast } from '@chakra-ui/react';

export default function createNetworkErrorToast(e) {
    const toast = createStandaloneToast();

    toast({
        title: 'A network error occurred.',
        description: `Your poll couldn't be created due to a network error. Try refreshing your browser. (${e})`,
        status: 'error',
        position: 'top',
        isClosable: true,
        duration: null
    });
}
