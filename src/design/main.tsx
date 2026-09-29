import React from 'react';
import ReactDOM from 'react-dom/client';
import { mountModeSwitch } from '../mode/modeSwitch';
import App from './App';
import { mountImageLoadMarks } from './lib/images';
import './styles/base.css';
import './styles/layout.css';
import './styles/case.css';

// Must run before the first render so an arrival curtain is in the first paint.
mountModeSwitch('design');
mountImageLoadMarks();

// Safari (WebKit without Blink's engine) gets cheaper surfaces: no backdrop
// blurs on the header and the stacked work cards, and still pools of colour.
const ua = navigator.userAgent;
if (/AppleWebKit/.test(ua) && !/Chrome|Chromium|CriOS|Edg|OPR|Android/.test(ua)) document.documentElement.classList.add('is-webkit');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
