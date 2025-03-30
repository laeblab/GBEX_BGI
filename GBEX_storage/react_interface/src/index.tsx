import React from 'react';
import ReactDOM from 'react-dom/client';
import 'primereact/resources/themes/md-light-deeppurple/theme.css'
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css';
import './App.css'
import App from './App';
import { PrimeReactProvider } from 'primereact/api';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const value = {
    ripple: true,
};
root.render(
    <React.StrictMode>
        <PrimeReactProvider value={value}>
            <App />
        </PrimeReactProvider>
    </React.StrictMode>
);
