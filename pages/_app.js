import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

export default function MyApp({ Component, pageProps }) {
    const theme = extendTheme({
        styles: {
            global: {
                '.chakra-toast__inner': {
                    marginTop: '3rem !important'
                }
            }
        }
    });

    return (
        <ChakraProvider theme={theme}>
            <Component {...pageProps} />
        </ChakraProvider>
    );
}
