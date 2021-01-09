import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { SplashHeader, SplashContainer } from '../components/SplashUtils';
import '../styles/globals.css';

export default function MyApp({ Component, pageProps }) {
    return (
        <>
            <ChakraProvider>
                <SplashContainer>
                    <SplashHeader />
                    <Component {...pageProps} />
                </SplashContainer>
            </ChakraProvider>
            <div style={{ height:'350px' }}>What this website is about</div>
        </>
    );
}
