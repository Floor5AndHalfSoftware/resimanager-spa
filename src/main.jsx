import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import 'admin-lte/dist/css/adminlte.min.css' // Commented out until properly configured
import '@fortawesome/fontawesome-free/css/all.min.css'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
