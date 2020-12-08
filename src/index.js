import React from 'react';
import ReactDOM from 'react-dom';
import { ReactQueryCacheProvider } from 'react-query';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css';
import App from './App';
import { queryCache } from './api';

ReactDOM.render(
    <ChakraProvider>
        <React.StrictMode>
            <ReactQueryCacheProvider queryCache={queryCache}>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ReactQueryCacheProvider>
        </React.StrictMode>
    </ChakraProvider>,
    document.querySelector('#root')
);
