import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/scrollbar.css'
import { mountModeSwitch } from './mode/modeSwitch'

// Researcher ⇄ Designer switch. It lives outside the React tree and links to
// the separate designer entry at /design/; nothing in <App /> depends on it.
mountModeSwitch('research')

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
