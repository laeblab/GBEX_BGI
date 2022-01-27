import React from 'react';
import ReactDOM from 'react-dom';
//import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/themes/md-light-deeppurple/theme.css'
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons
import 'primeflex/primeflex.css';
import './App.css'
import App from './App';
import PrimeReact from 'primereact/api';
PrimeReact.ripple = true;

ReactDOM.render(
  <React.StrictMode>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
);