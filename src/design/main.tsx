import React from 'react';
import ReactDOM from 'react-dom/client';
import { mountModeSwitch } from '../mode/modeSwitch';
import App from './App';
import './styles/base.css';
import './styles/layout.css';
import './styles/case.css';

// Must run before the first render so an arrival curtain is in the first paint.
mountModeSwitch('design');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
