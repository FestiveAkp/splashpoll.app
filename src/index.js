import React from 'react';
import ReactDOM from 'react-dom';
import { ChakraProvider } from '@chakra-ui/core';
import './index.css';
import App from './components/App';

ReactDOM.render(
    <ChakraProvider>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </ChakraProvider>,
    document.querySelector('#root')
);
