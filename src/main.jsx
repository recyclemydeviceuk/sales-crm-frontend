import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { LeadsProvider } from './context/LeadsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LeadsProvider>
        <App />
      </LeadsProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
