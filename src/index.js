import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/core';
import './index.css';
import App from './App';

ReactDOM.render(
    <ChakraProvider>
        <React.StrictMode>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </React.StrictMode>
    </ChakraProvider>,
    document.querySelector('#root')
);
