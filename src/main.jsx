import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles/tokens.css'
import './styles/theme.css'
import './index.css'

const THEME_KEY = 'yongviewbot-theme'
const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(THEME_KEY) : null
const initialTheme = saved === 'dark' || saved === 'light' ? saved : 'light'
document.documentElement.setAttribute('data-theme', initialTheme)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
