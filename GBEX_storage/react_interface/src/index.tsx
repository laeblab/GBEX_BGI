import React from 'react';
import ReactDOM from 'react-dom/client';
//import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/themes/md-light-deeppurple/theme.css'
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css';
import './App.css'
import App from './App';
import PrimeReact from 'primereact/api';
import {UpdateForm} from "./right_panel/UpdateForm";
PrimeReact.ripple = true;

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        {/*<App />*/}
        <UpdateForm />
    </React.StrictMode>
);
