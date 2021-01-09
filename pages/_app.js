import React from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SplashHeader, SplashContainer } from '../components/SplashUtils';

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
        <>
            <ChakraProvider theme={theme}>
                <SplashContainer>
                    <SplashHeader />
                    <Component {...pageProps} />
                </SplashContainer>
            </ChakraProvider>
            <div style={{ height:'350px' }}>What this website is about</div>
        </>
    );
}
