import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { initAICharacterBridge } from './services/aiCharacterBridge.js'
import './index.css'
import './mobile-refresh.css'
import './commercial-refresh.css'
import './product-v2.css'
import './home-background-refresh.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

initAICharacterBridge()
